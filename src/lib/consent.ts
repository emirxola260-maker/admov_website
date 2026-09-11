/**
 * Analytics consent, stored per browser.
 *
 * Only Google Analytics depends on this. The admov-lang cookie is strictly
 * necessary and Vercel Web Analytics is cookieless, so neither needs consent.
 */
export const CONSENT_KEY = "admov-consent";
export type ConsentChoice = "granted" | "denied";

export function readConsent(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    // Storage blocked (private mode, strict settings): treat as undecided, which
    // keeps analytics off — the safe direction to fail in.
    return null;
  }
}

export function writeConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    /* choice still applies for this page view via gtag */
  }
}

/** Google Analytics cookie names present in a document.cookie string. */
export function gaCookieNames(cookieString: string): string[] {
  return cookieString
    .split(";")
    .map((part) => part.trim().split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_") || name === "_gid");
}

/**
 * Withdrawing consent has to remove what was already set, not just stop new
 * writes. GA scopes its cookies to the registrable domain, so each name is
 * expired on both the bare host and the dotted parent.
 */
export function clearGaCookies() {
  const host = location.hostname;
  const parent = host.split(".").slice(-2).join(".");
  for (const name of gaCookieNames(document.cookie)) {
    for (const domain of ["", `; domain=${host}`, `; domain=.${parent}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}
