const BANNER_STYLES = ["standard", "fancy", "minimal", "gaming", "tactical"];

const BANNER_FONTS = [
  { id: "goldrops", label: "Goldrops" },
  { id: "caudex", label: "Caudex" },
  { id: "cinzel", label: "Cinzel" },
  { id: "oswald", label: "Oswald" },
  { id: "bebas", label: "Bebas Neue" },
  { id: "serif", label: "Classic serif" },
  { id: "mono", label: "Terminal" },
];

const BANNER_BACKGROUNDS = [
  { id: "default", label: "Style default" },
  { id: "crimson", label: "Crimson" },
  { id: "gold", label: "Gold" },
  { id: "noir", label: "Noir" },
  { id: "velvet", label: "Velvet" },
  { id: "smoke", label: "Smoke" },
  { id: "ledger", label: "Ledger" },
  { id: "neon", label: "Neon" },
  { id: "ember", label: "Ember" },
];

const BANNER_FONT_IDS = new Set(BANNER_FONTS.map((f) => f.id));
const BANNER_BG_IDS = new Set(BANNER_BACKGROUNDS.map((b) => b.id));

const TEXT_COLORS = [
  { id: "red", label: "Red", className: "guide-color-red" },
  { id: "soft", label: "Soft red", className: "guide-color-soft" },
  { id: "gold", label: "Gold", className: "guide-color-gold" },
  { id: "green", label: "Green", className: "guide-color-green" },
  { id: "yellow", label: "Yellow", className: "guide-color-yellow" },
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

  return {
    font: fontMatch?.[1]?.toLowerCase() || null,
    background: bgMatch?.[1]?.toLowerCase() || null,
  };
}

function parseBannerDirective(directive = "") {
  const parts = directive.split("-").slice(1);
  let style = "standard";
  let font = "goldrops";
  let background = "default";

  for (const part of parts) {
    if (BANNER_STYLES.includes(part)) {
      style = part;
    } else if (BANNER_FONT_IDS.has(part)) {
      font = part;
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

function parseBlocks(content = "") {
  const body = normalizeContent(content);
  const blocks = [];
  const pattern = /:::(\w+[-\w]*)\n([\s\S]*?):::/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(body)) !== null) {
    if (match.index > lastIndex) {
      const text = body.slice(lastIndex, match.index).trim();
      if (text) blocks.push({ type: "text", text });
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
    } else if (directive === "section") {
      blocks.push({ type: "section", text: inner });
    } else {
      blocks.push({ type: "text", text: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < body.length) {
    const text = body.slice(lastIndex).trim();
    if (text) blocks.push({ type: "text", text });
  }

  if (blocks.length === 0 && body.trim()) {
    blocks.push({ type: "text", text: body.trim() });
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

function sectionSnippet(title = "Section Title") {
  return `:::section\n${title}\n:::`;
}

function stripMarkup(content = "") {
  return parseBlocks(content)
    .map((block) => {
      if (block.type === "banner") return block.title;
      if (block.type === "section") return block.text;
      return block.text || "";
    })
    .filter(Boolean)
    .join(" ")
    .trim();
}

export {
  BANNER_STYLES,
  BANNER_FONTS,
  BANNER_BACKGROUNDS,
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
  stripMarkup,
  normalizeContent,
};
