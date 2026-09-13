import type { Metadata } from "next";
import { DEFAULT_LANG } from "@/i18n/config";
import { getCourseLangs, getPublishedCourses } from "@/lib/data/apps";
import { courseLangs } from "@/lib/apps/types";
import { coursesIndexMetadata } from "@/lib/apps/metadata";
import { CoursesPage } from "@/components/courses/CoursesPage";

export async function generateMetadata(): Promise<Metadata> {
  return coursesIndexMetadata(DEFAULT_LANG);
}

export default async function Page() {
  const [courses, availableIn] = await Promise.all([getPublishedCourses(), getCourseLangs()]);
  return <CoursesPage courses={courses.filter((c) => courseLangs(c).includes(DEFAULT_LANG))} availableIn={availableIn} />;
}
