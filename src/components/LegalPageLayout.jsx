import { Link } from "react-router-dom";
import BrandMark from "./BrandMark.jsx";

export default function LegalPageLayout({ title, children }) {
  return (
    <div className="legal-page">
      <div className="legal-shell">
        <header className="legal-header">
          <Link to="/login" className="legal-brand-link">
            <BrandMark size="lg" />
          </Link>
          <h1>{title}</h1>
          <p className="legal-meta muted">
            UnderbossHQ · Last updated June 13, 2026
          </p>
        </header>

        <article className="legal-content card">{children}</article>

        <footer className="legal-footer">
          <Link to="/terms">Terms of Service</Link>
          <span aria-hidden="true">·</span>
          <Link to="/privacy">Privacy Policy</Link>
          <span aria-hidden="true">·</span>
          <Link to="/login">Back to login</Link>
        </footer>
      </div>
    </div>
  );
}
