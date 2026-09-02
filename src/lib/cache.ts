import { revalidateTag } from "next/cache";

/**
 * Purge cached data immediately.
 *
 * `revalidateTag(tag, "max")` is stale-while-revalidate: the next request still
 * gets the old value while it refreshes in the background. After publishing a
 * post we redirect straight to its URL, so the cached "not found" would win.
 * `{ expire: 0 }` is the documented way to expire immediately from a route
 * handler (updateTag is Server-Action-only).
 */
export function purgeTags(...tags: string[]): void {
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
}
