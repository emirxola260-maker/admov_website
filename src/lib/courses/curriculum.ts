/**
 * Turns a course's curriculum markdown into the pieces the academy layout
 * presents separately. The owner writes one markdown document per language
 * in /admin; the conventions are:
 *
 *   ## Section title         a section ("Who it's for", "The modules", "Tools")
 *   ### 1. Module title      a numbered module inside a section
 *   - lesson                 a lesson line inside a module (or a list item)
 *   A · B · C                a single line of short items becomes tool chips
 *   **Label:** text          a note ("How it's taught", "What you take away")
 *
 * Anything that does not fit falls back to plain markdown, so nothing the
 * owner writes is ever dropped.
 */

export interface CurriculumModule {
  /** As written ("3." → 3), or its position when the heading has no number. */
  number: number;
  title: string;
  lessons: string[];
  /** Any other markdown inside the module (paragraphs under the heading). */
  body: string;
}

export type SectionKind = "modules" | "list" | "chips" | "text";

export interface CurriculumSection {
  title: string;
  kind: SectionKind;
  /** Markdown between the section heading and its first module. */
  intro: string;
  modules: CurriculumModule[];
  /** List items (kind "list") or chips (kind "chips"). */
  items: string[];
  /** The section's raw markdown (kind "text"). */
  body: string;
}

export interface CurriculumNote {
  label: string;
  text: string;
}

export interface ParsedCurriculum {
  sections: CurriculumSection[];
  notes: CurriculumNote[];
  moduleCount: number;
  lessonCount: number;
}

const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)]|[٠-٩]+[.)])\s+(.*)$/;
const NOTE = /^\*\*([^*]+?)[:：]\*\*\s*(.+)$/;
const NUMBERED_TITLE = /^([0-9٠-٩]+)[.)\-–]\s*(.+)$/;
const CHIP_SEPARATOR = /\s*[·•|]\s*/;

function toNumber(digits: string): number {
  const western = digits.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  return Number.parseInt(western, 10);
}

interface RawSection {
  title: string;
  lines: string[];
  modules: { heading: string; lines: string[] }[];
}

export function parseCurriculum(markdown: string | null | undefined): ParsedCurriculum {
  const lines = (markdown ?? "").replace(/\r\n?/g, "\n").split("\n");
  const raw: RawSection[] = [];
  const notes: CurriculumNote[] = [];
  let section: RawSection | null = null;
  let current: RawSection["modules"][number] | null = null;

  const ensureSection = () => {
    if (!section) {
      section = { title: "", lines: [], modules: [] };
      raw.push(section);
    }
    return section;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const h2 = /^##\s+(.+?)\s*#*$/.exec(trimmed);
    const h3 = /^###\s+(.+?)\s*#*$/.exec(trimmed);
    const note = NOTE.exec(trimmed);
    if (h2 && !trimmed.startsWith("###")) {
      section = { title: h2[1], lines: [], modules: [] };
      raw.push(section);
      current = null;
    } else if (h3) {
      current = { heading: h3[1], lines: [] };
      ensureSection().modules.push(current);
    } else if (note) {
      notes.push({ label: note[1].trim(), text: note[2].trim() });
    } else if (current) {
      current.lines.push(line);
    } else {
      ensureSection().lines.push(line);
    }
  }

  let lessonCount = 0;
  let moduleCount = 0;
  const sections: CurriculumSection[] = [];

  for (const s of raw) {
    const text = s.lines.join("\n").trim();
    const modules: CurriculumModule[] = s.modules.map((m, index) => {
      const numbered = NUMBERED_TITLE.exec(m.heading.trim());
      const lessons: string[] = [];
      const body: string[] = [];
      for (const line of m.lines) {
        const item = LIST_ITEM.exec(line);
        if (item) lessons.push(item[1].trim());
        else body.push(line);
      }
      return {
        number: numbered ? toNumber(numbered[1]) : index + 1,
        title: (numbered ? numbered[2] : m.heading).trim(),
        lessons,
        body: body.join("\n").trim(),
      };
    });

    if (modules.length) {
      moduleCount += modules.length;
      lessonCount += modules.reduce((sum, m) => sum + m.lessons.length, 0);
      sections.push({ title: s.title, kind: "modules", intro: text, modules, items: [], body: "" });
      continue;
    }
    if (!text && !s.title) continue;

    const contentLines = s.lines.map((l) => l.trim()).filter(Boolean);
    const listItems = contentLines.map((l) => LIST_ITEM.exec(l)?.[1]?.trim()).filter((x): x is string => Boolean(x));
    const onlyList = listItems.length > 0 && listItems.length === contentLines.length;
    const chips = contentLines.length === 1 ? contentLines[0].split(CHIP_SEPARATOR).filter(Boolean) : [];
    const looksLikeChips = chips.length >= 2 && chips.every((c) => c.length <= 40);

    if (onlyList) sections.push({ title: s.title, kind: "list", intro: "", modules: [], items: listItems, body: "" });
    else if (looksLikeChips) sections.push({ title: s.title, kind: "chips", intro: "", modules: [], items: chips.map((c) => c.trim()), body: "" });
    else sections.push({ title: s.title, kind: "text", intro: "", modules: [], items: [], body: text });
  }

  return { sections, notes, moduleCount, lessonCount };
}
