import { ARTICLES } from "@/lib/journal";
import { SITE_URL } from "@/lib/schema";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const sorted = [...ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1));

  const items = sorted
    .map((a) => {
      const url = `${SITE_URL}/journal/${a.slug}`;
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(a.dek)}</description>
      <category>${escapeXml(a.category)}</category>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>CIRRUS Journal</title>
    <link>${SITE_URL}/journal</link>
    <description>General health, respiratory, and sleep-therapy information from CIRRUS. Not medical advice.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
