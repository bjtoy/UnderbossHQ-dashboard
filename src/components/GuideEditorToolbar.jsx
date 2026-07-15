import { useState } from "react";
import {
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
  insertSnippet,
  wrapSelection,
  bannerSnippet,
  colorSnippet,
  calloutSnippet,
  sectionSnippet,
  headingSnippet,
  textSnippet,
} from "../utils/guideMarkup.js";

const TOOLBAR_TABS = [
  { id: "banner", label: "1. Banner" },
  { id: "structure", label: "2. Structure" },
  { id: "text", label: "3. Text" },
  { id: "callouts", label: "4. Callouts" },
];

export default function GuideEditorToolbar({ content, onChange, textareaRef }) {
  const [tab, setTab] = useState("banner");
  const [bannerFont, setBannerFont] = useState("caudex");
  const [bannerBackground, setBannerBackground] = useState("default");
  const [bannerStyle, setBannerStyle] = useState("fancy");

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

  function insertBanner() {
    applySnippet(
      bannerSnippet(bannerStyle, "Guide Title", {
        font: bannerFont,
        background: bannerBackground,
      })
    );
  }

  function insertStyledText(variant) {
    const el = textareaRef.current;
    if (el && el.selectionStart !== el.selectionEnd) {
      const directive = variant === "body" ? "text" : `text-${variant}`;
      applyWrap(`:::${directive}\n`, "\n:::");
      return;
    }
    applySnippet(textSnippet("Paragraph text", variant));
  }

  return (
    <div className="guide-editor-toolbar">
      <div className="guide-toolbar-tabs" role="tablist" aria-label="Guide formatting">
        {TOOLBAR_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`guide-toolbar-tab${tab === item.id ? " is-active" : ""}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "banner" && (
        <div className="guide-toolbar-panel page-stack" role="tabpanel">
          <p className="muted guide-toolbar-help">
            Pick a style, font, and texture, then insert a banner at the cursor.
          </p>

          <div className="guide-toolbar-group">
            <span className="guide-toolbar-label">Style</span>
            <div className="action-row">
              {BANNER_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  className={`btn btn-sm ${
                    bannerStyle === style.id
                      ? "btn-outline-gold active"
                      : "btn-outline-red"
                  }`}
                  onClick={() => setBannerStyle(style.id)}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div className="dashboard-grid dashboard-grid-2">
            <div className="guide-toolbar-group">
              <label className="guide-toolbar-label" htmlFor="banner-font-select">
                Font
              </label>
              <select
                id="banner-font-select"
                className="field-input"
                value={bannerFont}
                onChange={(e) => setBannerFont(e.target.value)}
              >
                {BANNER_FONT_GROUPS.map((group) => (
                  <optgroup key={group.id} label={group.label}>
                    {BANNER_FONTS.filter((font) => font.group === group.id).map(
                      (font) => (
                        <option key={font.id} value={font.id}>
                          {font.label}
                        </option>
                      )
                    )}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="guide-toolbar-group">
              <label className="guide-toolbar-label" htmlFor="banner-bg-select">
                Color / texture
              </label>
              <select
                id="banner-bg-select"
                className="field-input"
                value={bannerBackground}
                onChange={(e) => setBannerBackground(e.target.value)}
              >
                {BANNER_BG_GROUPS.map((group) => (
                  <optgroup key={group.id} label={group.label}>
                    {BANNER_BACKGROUNDS.filter((bg) => bg.group === group.id).map(
                      (bg) => (
                        <option key={bg.id} value={bg.id}>
                          {bg.label}
                        </option>
                      )
                    )}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline-gold"
            onClick={insertBanner}
          >
            Insert banner
          </button>
        </div>
      )}

      {tab === "structure" && (
        <div className="guide-toolbar-panel page-stack" role="tabpanel">
          <p className="muted guide-toolbar-help">
            Add section titles and headings to organize the guide.
          </p>

          <div className="guide-toolbar-group">
            <span className="guide-toolbar-label">Section</span>
            <div className="action-row">
              {SECTION_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  className="btn btn-outline-red btn-sm"
                  onClick={() =>
                    applySnippet(sectionSnippet("Section Title", style.id))
                  }
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div className="guide-toolbar-group">
            <span className="guide-toolbar-label">Heading</span>
            <div className="action-row">
              {HEADING_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  className="btn btn-outline-red btn-sm"
                  onClick={() =>
                    applySnippet(headingSnippet("Heading", style.id))
                  }
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "text" && (
        <div className="guide-toolbar-panel page-stack" role="tabpanel">
          <p className="muted guide-toolbar-help">
            Insert a paragraph style, or select text first to wrap it.
          </p>

          <div className="guide-toolbar-group">
            <span className="guide-toolbar-label">Paragraph style</span>
            <div className="action-row">
              {TEXT_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  className="btn btn-outline-red btn-sm"
                  onClick={() => insertStyledText(style.id)}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div className="guide-toolbar-group">
            <span className="guide-toolbar-label">Color highlight</span>
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
        </div>
      )}

      {tab === "callouts" && (
        <div className="guide-toolbar-panel page-stack" role="tabpanel">
          <p className="muted guide-toolbar-help">
            Callouts draw attention to tips, warnings, and key rules.
          </p>
          <div className="action-row">
            {CALLOUT_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                className="btn btn-outline-red btn-sm"
                onClick={() => applySnippet(calloutSnippet(type.id))}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
