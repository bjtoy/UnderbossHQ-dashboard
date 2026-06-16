import { useState } from "react";
import {
  BANNER_STYLES,
  BANNER_FONTS,
  BANNER_BACKGROUNDS,
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
  const [bannerFont, setBannerFont] = useState("goldrops");
  const [bannerBackground, setBannerBackground] = useState("default");

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

  function insertBanner(style) {
    applySnippet(
      bannerSnippet(style, "Guide Title", {
        font: bannerFont,
        background: bannerBackground,
      })
    );
  }

  return (
    <div className="guide-editor-toolbar page-stack">
      <div className="guide-toolbar-group">
        <span className="guide-toolbar-label">Banner style</span>
        <div className="action-row">
          {BANNER_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              className="btn btn-outline-red btn-sm"
              onClick={() => insertBanner(style)}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid-2">
        <div className="guide-toolbar-group">
          <label className="guide-toolbar-label" htmlFor="banner-font-select">
            Banner font
          </label>
          <select
            id="banner-font-select"
            className="field-input"
            value={bannerFont}
            onChange={(e) => setBannerFont(e.target.value)}
          >
            {BANNER_FONTS.map((font) => (
              <option key={font.id} value={font.id}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        <div className="guide-toolbar-group">
          <label className="guide-toolbar-label" htmlFor="banner-bg-select">
            Banner background
          </label>
          <select
            id="banner-bg-select"
            className="field-input"
            value={bannerBackground}
            onChange={(e) => setBannerBackground(e.target.value)}
          >
            {BANNER_BACKGROUNDS.map((bg) => (
              <option key={bg.id} value={bg.id}>
                {bg.label}
              </option>
            ))}
          </select>
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
              className="btn btn-outline-red btn-sm"
              onClick={() => applySnippet(calloutSnippet(type.id))}
            >
              {type.label}
            </button>
          ))}
          <button
            type="button"
            className="btn btn-outline-red btn-sm"
            onClick={() => applySnippet(sectionSnippet())}
          >
            Section
          </button>
        </div>
      </div>

      <p className="muted guide-toolbar-help">
        Banners support custom fonts and backgrounds. Example:{" "}
        <code>
          {`:::banner-fancy\nfont=cinzel bg=gold\nTitle\nSubtitle\n:::`}
        </code>
      </p>
    </div>
  );
}
