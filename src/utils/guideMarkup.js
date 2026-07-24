const BANNER_STYLES = [
  { id: "standard", label: "Standard" },
  { id: "fancy", label: "Fancy" },
  { id: "minimal", label: "Minimal" },
  { id: "gaming", label: "Gaming" },
  { id: "tactical", label: "Tactical" },
  { id: "plaque", label: "Plaque" },
  { id: "ribbon", label: "Ribbon" },
  { id: "poster", label: "Poster" },
];

const BANNER_STYLE_IDS = BANNER_STYLES.map((s) => s.id);

const SECTION_STYLES = [
  { id: "plain", label: "Plain" },
  { id: "bar", label: "Bar" },
  { id: "pill", label: "Pill" },
  { id: "divider", label: "Divider" },
];

const HEADING_STYLES = [
  { id: "lg", label: "Large" },
  { id: "md", label: "Medium" },
  { id: "sm", label: "Small" },
];

const TEXT_STYLES = [
  { id: "body", label: "Body" },
  { id: "lead", label: "Lead" },
  { id: "quote", label: "Quote" },
  { id: "note", label: "Note" },
  { id: "center", label: "Centered" },
];

const BANNER_FONTS = [
  // Fancy / display
  { id: "goldrops", label: "Goldrops", group: "fancy" },
  { id: "caudex", label: "Caudex", group: "fancy" },
  { id: "cormorant", label: "Cormorant", group: "fancy" },
  { id: "playfair", label: "Playfair Display", group: "fancy" },
  { id: "spectral", label: "Spectral", group: "fancy" },
  { id: "marcellus", label: "Marcellus", group: "fancy" },
  { id: "abril", label: "Abril Fatface", group: "fancy" },
  { id: "italiana", label: "Italiana", group: "fancy" },
  { id: "forum", label: "Forum", group: "fancy" },
  { id: "ebgaramond", label: "EB Garamond", group: "fancy" },
  { id: "baskerville", label: "Libre Baskerville", group: "fancy" },
  { id: "poiret", label: "Poiret One", group: "fancy" },
  { id: "greatvibes", label: "Great Vibes", group: "fancy" },
  { id: "tangerine", label: "Tangerine", group: "fancy" },
  { id: "unifraktur", label: "Unifraktur", group: "fancy" },
  // Clean titles
  { id: "oswald", label: "Oswald", group: "sans" },
  { id: "bebas", label: "Bebas Neue", group: "sans" },
  { id: "raleway", label: "Raleway", group: "sans" },
  { id: "orbitron", label: "Orbitron", group: "sans" },
  { id: "serif", label: "Classic serif", group: "sans" },
  // Typewriter / TT / terminal
  { id: "mono", label: "Terminal", group: "tt" },
  { id: "spacemono", label: "Space Mono", group: "tt" },
  { id: "plexmono", label: "IBM Plex Mono", group: "tt" },
  { id: "specialelite", label: "Special Elite", group: "tt" },
  { id: "sharetech", label: "Share Tech Mono", group: "tt" },
  { id: "vt323", label: "VT323", group: "tt" },
  { id: "inconsolata", label: "Inconsolata", group: "tt" },
  { id: "anonymous", label: "Anonymous Pro", group: "tt" },
  { id: "courierprime", label: "Courier Prime", group: "tt" },
];

const BANNER_FONT_GROUPS = [
  { id: "fancy", label: "Fancy" },
  { id: "sans", label: "Sans / Title" },
  { id: "tt", label: "Typewriter / TT" },
];

const BANNER_BACKGROUNDS = [
  { id: "default", label: "Style default", group: "solid" },
  { id: "crimson", label: "Crimson", group: "solid" },
  { id: "gold", label: "Gold", group: "solid" },
  { id: "noir", label: "Noir", group: "solid" },
  { id: "velvet", label: "Velvet", group: "solid" },
  { id: "smoke", label: "Smoke", group: "solid" },
  { id: "ledger", label: "Ledger", group: "solid" },
  { id: "neon", label: "Neon", group: "solid" },
  { id: "ember", label: "Ember", group: "solid" },
  { id: "sapphire", label: "Sapphire", group: "solid" },
  { id: "forest", label: "Forest", group: "solid" },
  { id: "plum", label: "Plum", group: "solid" },
  { id: "ice", label: "Ice", group: "solid" },
  { id: "parchment", label: "Parchment", group: "texture" },
  { id: "carbon", label: "Carbon fiber", group: "texture" },
  { id: "marble", label: "Marble", group: "texture" },
  { id: "damask", label: "Damask", group: "texture" },
  { id: "grid", label: "Tactical grid", group: "texture" },
  { id: "herringbone", label: "Herringbone", group: "texture" },
  { id: "brut", label: "Brushed metal", group: "texture" },
];

const BANNER_BG_GROUPS = [
  { id: "solid", label: "Colors" },
  { id: "texture", label: "Textures" },
];

const BANNER_FONT_IDS = new Set(BANNER_FONTS.map((f) => f.id));
const BANNER_BG_IDS = new Set(BANNER_BACKGROUNDS.map((b) => b.id));
const SECTION_STYLE_IDS = new Set(SECTION_STYLES.map((s) => s.id));
const HEADING_STYLE_IDS = new Set(HEADING_STYLES.map((s) => s.id));
const TEXT_STYLE_IDS = new Set(TEXT_STYLES.map((s) => s.id));

// Legacy: older guides used font=cinzel — map to Caudex
BANNER_FONT_IDS.add("cinzel");

const TEXT_COLORS = [
  { id: "red", label: "Red", className: "guide-color-red" },
  { id: "soft", label: "Soft red", className: "guide-color-soft" },
  { id: "crimson", label: "Crimson", className: "guide-color-crimson" },
  { id: "gold", label: "Gold", className: "guide-color-gold" },
  { id: "amber", label: "Amber", className: "guide-color-amber" },
  { id: "yellow", label: "Yellow", className: "guide-color-yellow" },
  { id: "green", label: "Green", className: "guide-color-green" },
  { id: "teal", label: "Teal", className: "guide-color-teal" },
  { id: "blue", label: "Blue", className: "guide-color-blue" },
  { id: "violet", label: "Violet", className: "guide-color-violet" },
  { id: "pink", label: "Pink", className: "guide-color-pink" },
  { id: "ivory", label: "Ivory", className: "guide-color-ivory" },
  { id: "muted", label: "Muted", className: "guide-color-muted" },
];

const CALLOUT_TYPES = [
  { id: "tip", label: "Tip", prefix: "✅ Tip" },
  { id: "warning", label: "Warning", prefix: "⚠️ Warning" },
  { id: "important", label: "Important", prefix: "❗ Important" },
];

function normalizeContent(content = "") {
  if (!content || typeof content !== "string") return "";

  const trimmed = content.trim();
  if (!trimmed.startsWith("{")) return content;

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed?.v === 1 && typeof parsed.body === "string") {
      return parsed.body;
    }
  } catch {
    // legacy plain text
  }

  return content;
}

function isBannerMetaLine(line = "") {
  return /\b(?:font|bg|background)=/i.test(line.trim());
}

function parseBannerMetaLine(line = "") {
  const fontMatch = line.match(/\bfont=([\w-]+)/i);
  const bgMatch = line.match(/\b(?:bg|background)=([\w-]+)/i);

  let font = fontMatch?.[1]?.toLowerCase() || null;
  if (font === "cinzel") font = "caudex";

  return {
    font,
    background: bgMatch?.[1]?.toLowerCase() || null,
  };
}

function parseBannerDirective(directive = "") {
  const parts = directive.split("-").slice(1);
  let style = "standard";
  let font = "goldrops";
  let background = "default";

  for (const part of parts) {
    if (BANNER_STYLE_IDS.includes(part)) {
      style = part;
    } else if (BANNER_FONT_IDS.has(part)) {
      font = part === "cinzel" ? "caudex" : part;
    } else if (BANNER_BG_IDS.has(part)) {
      background = part;
    }
  }

  return { style, font, background };
}

function parseBannerBlock(directive, inner) {
  const fromDirective = parseBannerDirective(directive);
  let lines = inner.split("\n");
  let font = fromDirective.font;
  let background = fromDirective.background;

  if (lines.length > 0 && isBannerMetaLine(lines[0])) {
    const meta = parseBannerMetaLine(lines[0]);
    if (meta.font && BANNER_FONT_IDS.has(meta.font)) font = meta.font;
    if (meta.background && BANNER_BG_IDS.has(meta.background)) {
      background = meta.background;
    }
    lines = lines.slice(1);
  }

  const title = (lines[0] || "").trim();
  const subtitle = lines.slice(1).join("\n").trim();

  return {
    type: "banner",
    style: fromDirective.style,
    font,
    background,
    title,
    subtitle,
  };
}

function parseVariantDirective(directive, prefix, allowedIds, fallback) {
  if (directive === prefix) return fallback;
  if (!directive.startsWith(`${prefix}-`)) return null;
  const variant = directive.slice(prefix.length + 1);
  return allowedIds.has(variant) ? variant : fallback;
}

function parseBlocks(content = "") {
  const body = normalizeContent(content);
  const blocks = [];
  const pattern = /:::(\w+[-\w]*)\n([\s\S]*?):::/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(body)) !== null) {
    if (match.index > lastIndex) {
      const text = body.slice(lastIndex, match.index).trim();
      if (text) blocks.push({ type: "text", variant: "body", text });
    }

    const directive = match[1].trim();
    const inner = match[2].trim();

    if (directive.startsWith("banner")) {
      blocks.push(parseBannerBlock(directive, inner));
    } else if (directive.startsWith("color")) {
      const color = directive.split("-")[1] || "red";
      blocks.push({ type: "color", color, text: inner });
    } else if (["tip", "warning", "important"].includes(directive)) {
      blocks.push({ type: "callout", variant: directive, text: inner });
    } else if (directive === "section" || directive.startsWith("section-")) {
      const variant =
        parseVariantDirective(directive, "section", SECTION_STYLE_IDS, "plain") ||
        "plain";
      blocks.push({ type: "section", variant, text: inner });
    } else if (directive === "heading" || directive.startsWith("heading-")) {
      const variant =
        parseVariantDirective(directive, "heading", HEADING_STYLE_IDS, "lg") ||
        "lg";
      blocks.push({ type: "heading", variant, text: inner });
    } else if (directive === "text" || directive.startsWith("text-")) {
      const variant =
        parseVariantDirective(directive, "text", TEXT_STYLE_IDS, "body") ||
        "body";
      blocks.push({ type: "styledText", variant, text: inner });
    } else {
      blocks.push({ type: "text", variant: "body", text: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < body.length) {
    const text = body.slice(lastIndex).trim();
    if (text) blocks.push({ type: "text", variant: "body", text });
  }

  if (blocks.length === 0 && body.trim()) {
    blocks.push({ type: "text", variant: "body", text: body.trim() });
  }

  return blocks;
}

function insertSnippet(content, snippet) {
  const next = content.trimEnd();
  return next ? `${next}\n\n${snippet}\n` : `${snippet}\n`;
}

function wrapSelection(content, selectionStart, selectionEnd, before, after) {
  const selected = content.slice(selectionStart, selectionEnd) || "text here";
  const wrapped = `${before}${selected}${after}`;
  return {
    value: content.slice(0, selectionStart) + wrapped + content.slice(selectionEnd),
    selectionStart: selectionStart + before.length,
    selectionEnd: selectionStart + before.length + selected.length,
  };
}

function bannerSnippet(
  style = "fancy",
  title = "Guide Title",
  { font = "goldrops", background = "default" } = {}
) {
  const metaParts = [];
  if (font && font !== "goldrops") metaParts.push(`font=${font}`);
  if (background && background !== "default") {
    metaParts.push(`bg=${background}`);
  }

  if (metaParts.length === 0) {
    return `:::banner-${style}\n${title}\n:::`;
  }

  return `:::banner-${style}\n${metaParts.join(" ")}\n${title}\n:::`;
}

function colorSnippet(color = "red", text = "Colored text") {
  return `:::color-${color}\n${text}\n:::`;
}

function calloutSnippet(type = "tip", text = "Your message here") {
  return `:::${type}\n${text}\n:::`;
}

function sectionSnippet(title = "Section Title", variant = "plain") {
  const directive = variant && variant !== "plain" ? `section-${variant}` : "section";
  return `:::${directive}\n${title}\n:::`;
}

function headingSnippet(text = "Heading", variant = "lg") {
  const directive = variant && variant !== "lg" ? `heading-${variant}` : "heading";
  return `:::${directive}\n${text}\n:::`;
}

function textSnippet(text = "Paragraph text", variant = "body") {
  const directive = variant && variant !== "body" ? `text-${variant}` : "text";
  return `:::${directive}\n${text}\n:::`;
}

function stripMarkup(content = "") {
  return parseBlocks(content)
    .map((block) => {
      if (block.type === "banner") return block.title;
      if (block.type === "section" || block.type === "heading") return block.text;
      return block.text || "";
    })
    .filter(Boolean)
    .join(" ")
    .trim();
}

const CALLOUT_LABELS = {
  tip: "✅ Tip",
  warning: "⚠️ Warning",
  important: "❗ Important",
};

function blockToDiscordText(block) {
  switch (block.type) {
    case "banner": {
      const lines = [`# ${block.title}`];
      if (block.subtitle) lines.push(block.subtitle);
      return lines.join("\n");
    }
    case "section":
      return `## ${block.text}`;
    case "heading":
      return block.variant === "sm" ? `### ${block.text}` : `## ${block.text}`;
    case "callout":
      return `${CALLOUT_LABELS[block.variant] || "Note"}\n${block.text}`;
    case "color":
      return `**${block.text}**`;
    default:
      return block.text || "";
  }
}

function formatGuideForDiscordPaste(title = "", content = "") {
  const body = parseBlocks(content)
    .map((block) => blockToDiscordText(block))
    .filter(Boolean)
    .join("\n\n")
    .trim();

  if (!title?.trim()) return body;
  if (!body) return title.trim();
  return `${title.trim()}\n\n${body}`;
}

export {
  BANNER_STYLES,
  BANNER_FONTS,
  BANNER_FONT_GROUPS,
  BANNER_BACKGROUNDS,
  BANNER_BG_GROUPS,
  SECTION_STYLES,
  HEADING_STYLES,
  TEXT_STYLES,
  TEXT_COLORS,
  CALLOUT_TYPES,
  parseBlocks,
  parseBannerBlock,
  insertSnippet,
  wrapSelection,
  bannerSnippet,
  colorSnippet,
  calloutSnippet,
  sectionSnippet,
  headingSnippet,
  textSnippet,
  stripMarkup,
  formatGuideForDiscordPaste,
  normalizeContent,
};
