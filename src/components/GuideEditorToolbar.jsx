import {
  BANNER_STYLES,
  TEXT_COLORS,
  CALLOUT_TYPES,
  insertSnippet,
  wrapSelection,
  bannerSnippet,
  colorSnippet,
  calloutSnippet,
  sectionSnippet,
} from "../utils/guideMarkup.js";

export default function GuideEditorToolbar({ content, onChange, textareaRef }) {
  function applySnippet(snippet) {
    onChange(insertSnippet(content, snippet));
  }

  function applyWrap(before, after) {
    const el = textareaRef.current;
    if (!el) {
      applySnippet(`${before}text here${after}`);
      return;
    }

    const { value, selectionStart, selectionEnd } = wrapSelection(
      content,
      el.selectionStart,
      el.selectionEnd,
      before,
      after
    );

    onChange(value);

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selectionStart, selectionEnd);
    });
  }

  return (
    <div className="guide-editor-toolbar page-stack">
      <div className="guide-toolbar-group">
        <span className="guide-toolbar-label">Banners</span>
        <div className="action-row">
          {BANNER_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              className="btn btn-outline-gold btn-sm"
              onClick={() => applySnippet(bannerSnippet(style))}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div className="guide-toolbar-group">
        <span className="guide-toolbar-label">Colored text</span>
        <div className="action-row">
          {TEXT_COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              className={`btn btn-sm guide-color-btn ${color.className}`}
              onClick={() => {
                const el = textareaRef.current;
                if (el && el.selectionStart !== el.selectionEnd) {
                  applyWrap(`:::color-${color.id}\n`, "\n:::");
                } else {
                  applySnippet(colorSnippet(color.id));
                }
              }}
            >
              {color.label}
            </button>
          ))}
        </div>
      </div>

      <div className="guide-toolbar-group">
        <span className="guide-toolbar-label">Callouts</span>
        <div className="action-row">
          {CALLOUT_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              className="btn btn-outline-gold btn-sm"
              onClick={() => applySnippet(calloutSnippet(type.id))}
            >
              {type.label}
            </button>
          ))}
          <button
            type="button"
            className="btn btn-outline-gold btn-sm"
            onClick={() => applySnippet(sectionSnippet())}
          >
            Section
          </button>
        </div>
      </div>

      <p className="muted guide-toolbar-help">
        Select text in the editor and use colored text buttons, or insert blocks with
        the toolbar. Syntax:{" "}
        <code>:::banner-fancy{"\n"}Title{"\n"}:::</code> and{" "}
        <code>:::color-red{"\n"}Text{"\n"}:::</code>
      </p>
    </div>
  );
}
