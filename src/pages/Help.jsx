import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import {
  HELP_SECTIONS,
  MANUAL_DOWNLOAD_URL,
} from "../content/userManual.js";

function renderParagraphs(paragraphs, keyPrefix) {
  if (!paragraphs?.length) return null;
  return paragraphs.map((text, index) => (
    <p key={`${keyPrefix}-p-${index}`} className="muted">
      {text}
    </p>
  ));
}

function renderList(items, ordered, keyPrefix) {
  if (!items?.length) return null;
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={`help-list${ordered ? " help-list-ordered" : ""}`}
    >
      {items.map((item, index) => (
        <li key={`${keyPrefix}-li-${index}`}>{item}</li>
      ))}
    </Tag>
  );
}

function renderTable(table, keyPrefix) {
  if (!table) return null;
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            {table.headers.map((header, index) => (
              <th key={`${keyPrefix}-th-${index}`}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={`${keyPrefix}-tr-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${keyPrefix}-td-${rowIndex}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HelpBlock({ section }) {
  return (
    <section id={section.id} className="help-section card page-stack">
      <h2 className="help-section-title">{section.title}</h2>

      {renderParagraphs(section.paragraphs, section.id)}
      {renderList(section.bullets, false, `${section.id}-bullets`)}
      {renderList(section.steps, true, `${section.id}-steps`)}
      {renderTable(section.table, section.id)}

      {section.note ? <p className="help-note muted">{section.note}</p> : null}

      {section.subsections?.map((sub, subIndex) => {
        const subKey = `${section.id}-sub-${subIndex}`;
        return (
          <div key={subKey} className="help-subsection page-stack">
            <h3>{sub.title}</h3>
            {renderParagraphs(sub.paragraphs, subKey)}
            {renderList(sub.bullets, false, `${subKey}-bullets`)}
            {renderList(sub.steps, true, `${subKey}-steps`)}
            {renderTable(sub.table, subKey)}
            {sub.note ? <p className="help-note muted">{sub.note}</p> : null}
          </div>
        );
      })}
    </section>
  );
}

export default function Help() {
  return (
    <div className="dashboard-page help-page">
      <PageHeader
        title="Help"
        subtitle="How to use UnderbossHQ — login, roles, content tools, moderation, and billing."
        actions={
          <a
            href={MANUAL_DOWNLOAD_URL}
            className="btn btn-outline-red btn-sm"
            download
          >
            Download Word manual
          </a>
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
          </p>
          <a href="#help-top" className="help-toc-link help-back-top">
            Back to top
          </a>
        </aside>

        <div id="help-top" className="help-sections page-stack">
          {HELP_SECTIONS.map((section) => (
            <HelpBlock key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
