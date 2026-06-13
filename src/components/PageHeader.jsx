import BrandMark from "./BrandMark.jsx";

export default function PageHeader({ title, subtitle, actions, brand = false }) {
  return (
    <header className="page-header">
      <div className="page-header-text">
        {brand ? (
          <>
            <BrandMark size="header" subtitle={title} />
            {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
          </>
        ) : (
          <>
            <h1 className="page-title">{title}</h1>
            {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
          </>
        )}
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </header>
  );
}
