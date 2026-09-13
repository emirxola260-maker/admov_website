"use client";

import * as React from "react";
import type { Language } from "@/i18n/config";

/**
 * Languages in which at least one published course has a curriculum.
 *
 * Computed on the server in the root layout from the same cached query the
 * course pages use, so the nav and footer only link to /courses in a language
 * where there is something to see.
 */
const CourseLangsContext = React.createContext<Language[]>([]);

export function CourseLangsProvider({ value, children }: { value: Language[]; children: React.ReactNode }) {
  return <CourseLangsContext.Provider value={value}>{children}</CourseLangsContext.Provider>;
}

export const useCourseLangs = () => React.useContext(CourseLangsContext);
