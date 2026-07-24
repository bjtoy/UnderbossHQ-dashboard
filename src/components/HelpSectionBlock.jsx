export function renderParagraphs(paragraphs, keyPrefix) {
  if (!paragraphs?.length) return null;
  return paragraphs.map((text, index) => (
    <p key={`${keyPrefix}-p-${index}`} className="muted">
      {text}
    </p>
  ));
}

export function renderList(items, ordered, keyPrefix) {
  if (!items?.length) return null;
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`help-list${ordered ? " help-list-ordered" : ""}`}>
      {items.map((item, index) => (
        <li key={`${keyPrefix}-li-${index}`}>{item}</li>
      ))}
    </Tag>
  );
}

export function renderTable(table, keyPrefix) {
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

export default function HelpSectionBlock({ section }) {
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
