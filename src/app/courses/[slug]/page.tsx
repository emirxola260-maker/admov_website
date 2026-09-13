import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LANG } from "@/i18n/config";
import { getPublishedCourse } from "@/lib/data/apps";
import { courseLangs } from "@/lib/apps/types";
import { courseMetadata } from "@/lib/apps/metadata";
import { CourseDetail } from "@/components/courses/CourseDetail";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return courseMetadata((await params).slug, DEFAULT_LANG);
}

export default async function Page({ params }: Props) {
  const course = await getPublishedCourse((await params).slug);
  // No curriculum in this language means an empty page — 404 instead.
  if (!course || !courseLangs(course).includes(DEFAULT_LANG)) notFound();
  return <CourseDetail course={course} />;
}
