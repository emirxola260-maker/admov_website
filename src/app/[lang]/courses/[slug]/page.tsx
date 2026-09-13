import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedCourse } from "@/lib/data/apps";
import { courseLangs } from "@/lib/apps/types";
import { courseMetadata } from "@/lib/apps/metadata";
import { resolveLang } from "@/lib/routes/lang";
import { CourseDetail } from "@/components/courses/CourseDetail";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  return courseMetadata(slug, resolveLang(lang));
}

export default async function Page({ params }: Props) {
  const { lang: raw, slug } = await params;
  const lang = resolveLang(raw);
  const course = await getPublishedCourse(slug);
  if (!course || !courseLangs(course).includes(lang)) notFound();
  return <CourseDetail course={course} />;
}
