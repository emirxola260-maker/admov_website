/**
 * Badge value that marks a product as not launched yet. It is stored as plain
 * text in `products.badges`, so it can be added or removed from the badges
 * field in /admin like any other badge; the cards recognise it
 * case-insensitively and render it localised and highlighted.
 */
export const COMING_SOON_BADGE = "Coming soon";

export const isComingSoonBadge = (badge: string) => badge.trim().toLowerCase() === "coming soon";
