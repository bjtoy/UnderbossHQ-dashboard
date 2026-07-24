import PublicShell from "./PublicShell.jsx";
import { BUSINESS } from "../content/business.js";

export default function LegalPageLayout({ title, children }) {
  return (
    <PublicShell
      title={title}
      subtitle={`${BUSINESS.name} · Last updated June 13, 2026 · No login required`}
    >
      <article className="legal-content card public-legal-content">
        {children}
      </article>
    </PublicShell>
  );
}
