const BANNER_STYLES = ["standard", "fancy", "minimal", "gaming", "tactical"];

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
      const style = directive.split("-")[1] || "standard";
      const lines = inner.split("\n");
      blocks.push({
        type: "banner",
        style: BANNER_STYLES.includes(style) ? style : "standard",
        title: lines[0] || "",
        subtitle: lines.slice(1).join("\n").trim(),
      });
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

function bannerSnippet(style = "fancy", title = "Guide Title") {
  return `:::banner-${style}\n${title}\n:::`;
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
  TEXT_COLORS,
  CALLOUT_TYPES,
  parseBlocks,
  insertSnippet,
  wrapSelection,
  bannerSnippet,
  colorSnippet,
  calloutSnippet,
  sectionSnippet,
  stripMarkup,
  normalizeContent,
};
