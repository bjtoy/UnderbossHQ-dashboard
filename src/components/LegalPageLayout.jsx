import { Link } from "react-router-dom";
import BrandMark from "./BrandMark.jsx";
import { BUSINESS } from "../content/business.js";

export default function LegalPageLayout({ title, children }) {
  return (
    <div className="legal-page">
      <div className="legal-shell">
        <header className="legal-header">
          <Link to="/" className="legal-brand-link">
            <BrandMark size="lg" />
          </Link>
          <h1>{title}</h1>
          <p className="legal-meta muted">
            {BUSINESS.name} · Last updated June 13, 2026 · No login required
          </p>
        </header>

        <article className="legal-content card">{children}</article>

        <footer className="legal-footer">
          <Link to="/">Home</Link>
          <span aria-hidden="true">·</span>
          <Link to="/pricing">Pricing</Link>
          <span aria-hidden="true">·</span>
          <Link to="/contact">Contact</Link>
          <span aria-hidden="true">·</span>
          <Link to="/terms">Terms of Service</Link>
          <span aria-hidden="true">·</span>
          <Link to="/privacy">Privacy Policy</Link>
        </footer>
      </div>
    </div>
  );
}
