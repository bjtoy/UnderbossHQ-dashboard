import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import HelpSectionBlock from "../components/HelpSectionBlock.jsx";
import {
  HELP_SECTIONS,
  MANUAL_DOWNLOAD_URL,
} from "../content/userManual.js";

export default function Help() {
  return (
    <div className="dashboard-page help-page">
      <PageHeader
        title="Help"
        subtitle="How to use UnderbossHQ — login, roles, content tools, moderation, and billing."
        actions={
          <>
            <Link to="/pricing" className="btn btn-outline-gold btn-sm">
              Pricing
            </Link>
            <a
              href={MANUAL_DOWNLOAD_URL}
              className="btn btn-outline-red btn-sm"
              download
            >
              Download Word manual
            </a>
          </>
        }
      />

      <div className="page-body help-layout">
        <aside className="card help-toc page-stack">
          <h3>On this page</h3>
          <nav className="help-toc-list" aria-label="Help sections">
            {HELP_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="help-toc-link"
              >
                {section.title}
              </a>
            ))}
          </nav>
          <p className="muted help-legal-line">
            Also see{" "}
            <Link to="/terms">Terms of Service</Link>
            {" · "}
            <Link to="/privacy">Privacy Policy</Link>
            {" · "}
            <Link to="/help/public">Public help</Link>
          </p>
          <a href="#help-top" className="help-toc-link help-back-top">
            Back to top
          </a>
        </aside>

        <div id="help-top" className="help-sections page-stack">
          {HELP_SECTIONS.map((section) => (
            <HelpSectionBlock key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
