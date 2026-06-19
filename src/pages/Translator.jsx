import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import PageHeader from "../components/PageHeader.jsx";
import Loader from "../components/Loader.jsx";
import ErrorCard from "../components/ErrorCard.jsx";

const TARGET_STORAGE_KEY = "underbosshq_translator_target";
const SOURCE_STORAGE_KEY = "underbosshq_translator_source";

export default function Translator() {
  const [languages, setLanguages] = useState([]);
  const [sourceLang, setSourceLang] = useState(
    localStorage.getItem(SOURCE_STORAGE_KEY) || "auto"
  );
  const [targetLang, setTargetLang] = useState(
    localStorage.getItem(TARGET_STORAGE_KEY) || "es"
  );
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [detectedLang, setDetectedLang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [maxLength, setMaxLength] = useState(500);

  useEffect(() => {
    api.translate
      .languages()
      .then((data) => {
        if (data?.languages) setLanguages(data.languages);
        if (data?.maxLength) setMaxLength(data.maxLength);
      })
      .catch((err) => {
        setError(err.message || "Could not load languages");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem(SOURCE_STORAGE_KEY, sourceLang);
  }, [sourceLang]);

  useEffect(() => {
    localStorage.setItem(TARGET_STORAGE_KEY, targetLang);
  }, [targetLang]);

  function swapLanguages() {
    if (sourceLang === "auto") return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (result) {
      setText(result);
      setResult("");
      setDetectedLang(null);
    }
  }

  async function handleTranslate(event) {
    event.preventDefault();
    setError(null);
    setTranslating(true);
    setDetectedLang(null);

    try {
      const data = await api.translate.translate({
        text,
        sourceLang,
        targetLang,
      });

      if (!data?.success) {
        throw new Error(data?.error || "Translation failed");
      }

      setResult(data.translatedText);
      setDetectedLang(data.detectedSourceLang || data.sourceLang || null);
    } catch (err) {
      setError(err.message || "Translation failed");
      setResult("");
    } finally {
      setTranslating(false);
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="translator-page">
      <PageHeader
        title="Translator"
        subtitle="Translate text for your faction — same tool family as the Discord bot."
      />

      {error ? <ErrorCard message={error} /> : null}

      <form className="card translator-card" onSubmit={handleTranslate}>
        <div className="translator-controls">
          <div className="field-group">
            <label className="field-label" htmlFor="source-lang">
              From
            </label>
            <select
              id="source-lang"
              className="field-select"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
            >
              <option value="auto">Auto-detect</option>
              {languages.map((lang) => (
                <option key={`source-${lang.code}`} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="btn btn-outline-red translator-swap-btn"
            onClick={swapLanguages}
            disabled={sourceLang === "auto"}
            title={
              sourceLang === "auto"
                ? "Pick a source language to swap"
                : "Swap languages"
            }
          >
            ⇄
          </button>

          <div className="field-group">
            <label className="field-label" htmlFor="target-lang">
              To
            </label>
            <select
              id="target-lang"
              className="field-select"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={`target-${lang.code}`} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="translator-panels">
          <div className="field-group">
            <label className="field-label" htmlFor="translator-input">
              Text
            </label>
            <textarea
              id="translator-input"
              className="field-textarea translator-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to translate…"
              maxLength={maxLength}
              rows={8}
              required
            />
            <p className="translator-meta">
              {text.length}/{maxLength} characters
            </p>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="translator-output">
              Translation
            </label>
            <textarea
              id="translator-output"
              className="field-textarea translator-textarea translator-output"
              value={result}
              readOnly
              placeholder="Translation appears here…"
              rows={8}
            />
            {detectedLang ? (
              <p className="translator-meta">
                Detected source: {detectedLang.toUpperCase()}
              </p>
            ) : null}
          </div>
        </div>

        <div className="action-row translator-actions">
          <button
            type="submit"
            className="btn btn-outline-red"
            disabled={translating || !text.trim()}
          >
            {translating ? "Translating…" : "Translate"}
          </button>
          <button
            type="button"
            className="btn"
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
      </form>
    </div>
  );
}
