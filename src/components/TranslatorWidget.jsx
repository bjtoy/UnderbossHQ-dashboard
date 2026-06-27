import { useEffect, useRef, useState } from "react";
import { api } from "../api/api.js";

const TARGET_STORAGE_KEY = "underbosshq_translator_target";
const SOURCE_STORAGE_KEY = "underbosshq_translator_source";
const OPEN_STORAGE_KEY = "underbosshq_translator_open";

export default function TranslatorWidget() {
  const [open, setOpen] = useState(
    () => localStorage.getItem(OPEN_STORAGE_KEY) === "true"
  );
  const [languages, setLanguages] = useState([]);
  const [sourceLang, setSourceLang] = useState(
    () => localStorage.getItem(SOURCE_STORAGE_KEY) || "auto"
  );
  const [targetLang, setTargetLang] = useState(
    () => localStorage.getItem(TARGET_STORAGE_KEY) || "es"
  );
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [detectedLang, setDetectedLang] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [maxLength, setMaxLength] = useState(500);
  const [loadingLangs, setLoadingLangs] = useState(true);

  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    api.translate
      .languages()
      .then((data) => {
        if (cancelled) return;
        if (data?.languages) setLanguages(data.languages);
        if (data?.maxLength) setMaxLength(data.maxLength);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load languages");
      })
      .finally(() => {
        if (!cancelled) setLoadingLangs(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(SOURCE_STORAGE_KEY, sourceLang);
  }, [sourceLang]);

  useEffect(() => {
    localStorage.setItem(TARGET_STORAGE_KEY, targetLang);
  }, [targetLang]);

  useEffect(() => {
    localStorage.setItem(OPEN_STORAGE_KEY, String(open));
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = text.trim();
    if (!trimmed) {
      setResult("");
      setDetectedLang(null);
      setError(null);
      setTranslating(false);
      return;
    }

    setTranslating(true);
    const requestId = ++requestIdRef.current;

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await api.translate.translate({
          text: trimmed,
          sourceLang,
          targetLang,
        });

        if (requestId !== requestIdRef.current) return;

        if (!data?.success) {
          throw new Error(data?.error || "Translation failed");
        }

        setResult(data.translatedText);
        setDetectedLang(data.detectedSourceLang || data.sourceLang || null);
        setError(null);
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        setError(err.message || "Translation failed");
        setResult("");
      } finally {
        if (requestId === requestIdRef.current) {
          setTranslating(false);
        }
      }
    }, 700);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text, sourceLang, targetLang]);

  function swapLanguages() {
    if (sourceLang === "auto") return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (result) {
      setText(result);
    }
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          className="translator-fab"
          onClick={() => setOpen(true)}
          aria-label="Open translator"
          title="Translator"
        >
          <span aria-hidden="true">🌐</span>
        </button>
      )}

      {open && (
        <section
          className="translator-widget"
          role="dialog"
          aria-label="Translator"
        >
          <header className="translator-widget-header">
            <span className="translator-widget-title">🌐 Translator</span>
            <button
              type="button"
              className="translator-widget-close"
              onClick={() => setOpen(false)}
              aria-label="Close translator"
            >
              ×
            </button>
          </header>

          <div className="translator-widget-body">
            <div className="translator-widget-controls">
              <select
                className="field-select"
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                disabled={loadingLangs}
                aria-label="Translate from"
              >
                <option value="auto">Auto-detect</option>
                {languages.map((lang) => (
                  <option key={`source-${lang.code}`} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="btn translator-widget-swap"
                onClick={swapLanguages}
                disabled={sourceLang === "auto"}
                title={
                  sourceLang === "auto"
                    ? "Pick a source language to swap"
                    : "Swap languages"
                }
                aria-label="Swap languages"
              >
                ⇄
              </button>

              <select
                className="field-select"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                disabled={loadingLangs}
                aria-label="Translate to"
              >
                {languages.map((lang) => (
                  <option key={`target-${lang.code}`} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              className="field-textarea translator-widget-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste text…"
              maxLength={maxLength}
              rows={4}
            />
            <p className="translator-meta">
              {text.length}/{maxLength}
            </p>

            <div className="translator-widget-output">
              {error ? (
                <p className="translator-widget-error">{error}</p>
              ) : translating ? (
                <p className="translator-meta">Translating…</p>
              ) : result ? (
                <>
                  <p className="translator-widget-result">{result}</p>
                  {detectedLang && (
                    <p className="translator-meta">
                      Detected: {detectedLang.toUpperCase()}
                    </p>
                  )}
                </>
              ) : (
                <p className="translator-meta">Translation appears here…</p>
              )}
            </div>

            {result && (
              <div className="translator-widget-actions">
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => navigator.clipboard?.writeText(result)}
                >
                  Copy
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => {
                    setText("");
                    setResult("");
                    setDetectedLang(null);
                    setError(null);
                  }}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
