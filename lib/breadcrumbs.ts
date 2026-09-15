/** Breadcrumb trail builders — keep the visible trail and the BreadcrumbList
 *  schema derived from the same data so they can never drift apart. */

export type Crumb = { name: string; url: string };

// Second-level product sections whose listing pages roll up under a hub.
const SECTION_PARENTS: { prefix: string; parent: Crumb }[] = [
  { prefix: "/oxygen/", parent: { name: "Oxygen", url: "/oxygen" } },
  { prefix: "/sleep/", parent: { name: "Sleep", url: "/sleep" } },
];

/** Crumbs for a product LISTING page (e.g. /oxygen/portable):
 *  Home / Oxygen / Portable Oxygen Concentrators. */
export function listingCrumbs(base: string, title: string): Crumb[] {
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }];
  const section = SECTION_PARENTS.find((s) => base.startsWith(s.prefix));
  if (section) crumbs.push(section.parent);
  crumbs.push({ name: title, url: base });
  return crumbs;
}
