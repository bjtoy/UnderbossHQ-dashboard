import { parseBlocks, TEXT_COLORS } from "../utils/guideMarkup.js";

function colorClass(colorId) {
  return TEXT_COLORS.find((c) => c.id === colorId)?.className || "guide-color-red";
}

function renderInlineText(text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function renderParagraphs(text) {
  return text.split(/\n{2,}/).map((paragraph, index) => (
    <p key={index}>
      {paragraph.split("\n").map((line, i, arr) => (
        <span key={i}>
          {renderInlineText(line)}
          {i < arr.length - 1 ? <br /> : null}
        </span>
      ))}
    </p>
  ));
}

function renderLines(text) {
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>
      {renderInlineText(line)}
      {i < arr.length - 1 ? <br /> : null}
    </span>
  ));
}

function GuideBanner({ style, font, background, title, subtitle }) {
  const fontClass = font ? `guide-banner-font-${font}` : "";
  const bgClass = background ? `guide-banner-bg-${background}` : "guide-banner-bg-default";

  return (
    <div
      className={`guide-banner guide-banner-${style} ${fontClass} ${bgClass}`.trim()}
    >
      <div className="guide-banner-title">{title}</div>
      {subtitle ? <div className="guide-banner-subtitle">{subtitle}</div> : null}
    </div>
  );
}

export default function GuideContent({ content, className = "" }) {
  const blocks = parseBlocks(content);

  if (blocks.length === 0) {
    return <div className={`guide-content ${className}`.trim()} />;
  }

  return (
    <div className={`guide-content ${className}`.trim()}>
      {blocks.map((block, index) => {
        if (block.type === "banner") {
          return (
            <GuideBanner
              key={index}
              style={block.style}
              font={block.font}
              background={block.background}
              title={block.title}
              subtitle={block.subtitle}
            />
          );
        }

        if (block.type === "color") {
          return (
            <p key={index} className={`guide-color-block ${colorClass(block.color)}`}>
              {renderLines(block.text)}
            </p>
          );
        }

        if (block.type === "callout") {
          return (
            <div key={index} className={`guide-callout guide-callout-${block.variant}`}>
              <span className="guide-callout-label">
                {block.variant === "tip" && "✅ Tip"}
                {block.variant === "warning" && "⚠️ Warning"}
                {block.variant === "important" && "❗ Important"}
              </span>
              <div className="guide-callout-body">{renderParagraphs(block.text)}</div>
            </div>
          );
        }

        if (block.type === "section") {
          const variant = block.variant || "plain";
          return (
            <h3
              key={index}
              className={`guide-section-title guide-section-${variant}`}
            >
              {renderInlineText(block.text)}
            </h3>
          );
        }

        if (block.type === "heading") {
          const variant = block.variant || "lg";
          const Tag = variant === "sm" ? "h4" : variant === "md" ? "h3" : "h2";
          return (
            <Tag
              key={index}
              className={`guide-heading guide-heading-${variant}`}
            >
              {renderInlineText(block.text)}
            </Tag>
          );
        }

        if (block.type === "styledText") {
          const variant = block.variant || "body";
          return (
            <div
              key={index}
              className={`guide-text-block guide-text-${variant}`}
            >
              {renderParagraphs(block.text)}
            </div>
          );
        }

        return (
          <div key={index} className="guide-text-block guide-text-body">
            {renderParagraphs(block.text)}
          </div>
        );
      })}
    </div>
  );
}

export function GuideContentPreview({ content, maxLength = 180 }) {
  const plain = parseBlocks(content)
    .map((b) => b.text || b.title || "")
    .join(" ")
    .trim();

  if (!plain) return null;

  const preview = plain.length > maxLength ? `${plain.slice(0, maxLength)}…` : plain;
  return <span>{preview}</span>;
}
