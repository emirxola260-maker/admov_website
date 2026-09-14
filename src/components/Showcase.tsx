"use client";

import { useState } from "react";
import { ArrowUpRight, MoveHorizontal } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { showcaseCopy } from "@/i18n/showcase";
import { AdmovMark } from "./ui/Logo";
import styles from "./showcase.module.css";

const examples = [
  { before: "/fashion-before.webp", after: "/fashion-after.webp" },
  { before: "/product-before.webp", after: "/work-jaeje.webp" },
  { before: "/ecommerce-before.webp", after: "/ecommerce-after.webp" },
];

export function Showcase() {
  const { lang } = useLanguage();
  const t = showcaseCopy[lang as keyof typeof showcaseCopy] ?? showcaseCopy.en;
  const [selected, setSelected] = useState(0);
  const [divider, setDivider] = useState(50);
  const item = examples[selected];
  const story = t.examples[selected];

  return (
    <section id="playground" className={styles.section} aria-labelledby="playground-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}><AdmovMark />{t.label}</p>
            <h2 id="playground-title">{t.title}</h2>
          </div>
          <p className={styles.intro}>{t.intro}</p>
        </header>

        <div className={styles.lab}>
          <div className={styles.sidebar}>
            <p className={styles.stepLabel}><span>01</span>{t.choose}</p>
            <div className={styles.choices} role="group" aria-label={t.choose}>
              {examples.map((example, index) => (
                <button key={example.after} type="button" aria-pressed={selected === index}
                  aria-controls="playground-viewer" onClick={() => { setSelected(index); setDivider(50); }}>
                  <img src={example.after} alt="" width="72" height="80" loading="lazy" />
                  <span>{t.examples[index].name}</span>
                  <span className={styles.choiceNumber} aria-hidden="true">0{index + 1}</span>
                </button>
              ))}
            </div>
            <div className={styles.story} aria-live="polite" aria-atomic="true">
              <h3>{story.title}</h3>
              <dl>
                <div><dt>{t.brief}</dt><dd>{story.brief}</dd></div>
                <div><dt>{t.changes}</dt><dd>{story.changes}</dd></div>
              </dl>
            </div>
            <a href="#contact" className={styles.contact}>{t.cta}<ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>

          <div id="playground-viewer" className={styles.viewer}>
            <div className={styles.toolbar}>
              <span className={styles.stepLabel}><span>02</span>{t.compare}</span>
              <div className={styles.modes} role="group" aria-label={t.compare}>
                {[{ label: t.before, value: 100 }, { label: t.compare, value: 50 }, { label: t.after, value: 0 }].map(mode => (
                  <button type="button" key={mode.value} aria-pressed={mode.value === 50 ? divider > 0 && divider < 100 : divider === mode.value} onClick={() => setDivider(mode.value)}>{mode.label}</button>
                ))}
              </div>
            </div>
            <div className={styles.stage}>
              <img key={item.after} className={styles.photo} src={item.after} alt={`${story.name} — ${t.after}`} width="900" height="1200" loading="lazy" draggable={false} />
              <div className={styles.beforeImage} style={{ clipPath: `inset(0 ${100 - divider}% 0 0)` }}>
                <img key={item.before} className={styles.photo} src={item.before} alt={`${story.name} — ${t.before}`} width="900" height="1200" loading="lazy" draggable={false} />
              </div>
              {divider > 10 && <span className={`${styles.imageLabel} ${styles.beforeLabel}`}>{t.before}</span>}
              {divider < 90 && <span className={`${styles.imageLabel} ${styles.afterLabel}`}>{t.after}</span>}
              <div className={styles.divider} style={{ left: `${divider}%` }} aria-hidden="true"><span><MoveHorizontal size={20} /></span></div>
              <input className={styles.range} type="range" min="0" max="100" value={divider}
                onChange={event => setDivider(Number(event.target.value))} aria-label={t.slider}
                aria-valuetext={`${t.before} ${divider}% · ${t.after} ${100 - divider}%`} aria-describedby="playground-hint" />
            </div>
            <p id="playground-hint" className={styles.hint}><MoveHorizontal size={16} aria-hidden="true" />{t.drag}</p>
          </div>
        </div>
        <p className={styles.note}><AdmovMark outline />{t.note}</p>
      </div>
    </section>
  );
}
