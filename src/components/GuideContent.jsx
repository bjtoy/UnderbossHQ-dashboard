import { parseBlocks, TEXT_COLORS } from "../utils/guideMarkup.js";

function colorClass(colorId) {
  return TEXT_COLORS.find((c) => c.id === colorId)?.className || "guide-color-red";
}

function renderParagraphs(text) {
  return text.split(/\n{2,}/).map((paragraph, index) => (
    <p key={index}>{paragraph.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 ? <br /> : null}
      </span>
    ))}</p>
  ));
}

function GuideBanner({ style, title, subtitle }) {
  return (
    <div className={`guide-banner guide-banner-${style}`}>
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
              title={block.title}
              subtitle={block.subtitle}
            />
          );
        }

        if (block.type === "color") {
          return (
            <p key={index} className={`guide-color-block ${colorClass(block.color)}`}>
              {block.text.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 ? <br /> : null}
                </span>
              ))}
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
          return (
            <h3 key={index} className="guide-section-title">
              {block.text}
            </h3>
          );
        }

        return (
          <div key={index} className="guide-text-block">
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
