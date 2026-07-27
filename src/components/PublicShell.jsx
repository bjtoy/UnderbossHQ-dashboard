import { Link, useLocation } from "react-router-dom";
import { useRoles } from "../context/RoleContext.jsx";
import { getPremiumAccessState } from "../utils/premiumAccess.js";
import BrandMark from "./BrandMark.jsx";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
  { to: "/help/public", label: "Help" },
  { to: "/demo", label: "Demo guide" },
];

export default function PublicShell({ children, title, subtitle }) {
  const location = useLocation();
  const { user, loading, guildId, dashboardAccess, billingProvider, billingConfigured } =
    useRoles();
  const loggedIn = !loading && Boolean(user);
  const premiumAccess = getPremiumAccessState({
    user,
    guildId,
    dashboardAccess,
    billingProvider,
    billingConfigured,
  });

  function navClass(path) {
    const active =
      path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(path);
    return `public-nav-link${active ? " public-nav-link-active" : ""}`;
  }

  return (
    <div className="public-site">
      <div className="public-site-bg" aria-hidden="true">
        <span className="public-glow public-glow-top" />
        <span className="public-glow public-glow-side" />
      </div>
      <header className="public-header">
        <div className="public-header-inner">
          <Link to="/" className="public-brand-link">
            <BrandMark size="nav" />
          </Link>
          <nav className="public-nav" aria-label="Public site">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} className={navClass(item.to)}>
                {item.label}
              </Link>
            ))}
          </nav>
          {loggedIn ? (
            <Link to="/member" className="btn btn-outline-red btn-sm public-login-btn">
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn btn-outline-red btn-sm public-login-btn">
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main className="public-main">
        {(title || subtitle) && (
          <div className="public-page-intro">
            {title ? <h1 className="public-page-title">{title}</h1> : null}
            {subtitle ? (
              <p className="public-page-subtitle muted">{subtitle}</p>
            ) : null}
          </div>
        )}
        {!title && location.pathname !== "/" && (
          <div className="public-page-brand-strip" aria-hidden="true">
            <span className="public-page-brand-rule" />
          </div>
        )}
        {children}
      </main>

      <footer className="public-footer">
        <p className="muted public-footer-links">
          <Link to="/">Home</Link>
          {" · "}
          <Link to="/pricing">Pricing</Link>
          {" · "}
          <Link to="/contact">Contact</Link>
          {" · "}
          <Link to="/terms">Terms</Link>
          {" · "}
          <Link to="/privacy">Privacy</Link>
          {" · "}
          <a href="/UnderbossHQ-User-Manual.docx" download>
            User manual
          </a>
          {loggedIn && premiumAccess.needsUpgrade ? (
            <>
              {" · "}
              <Link to="/premium">Subscribe</Link>
            </>
          ) : null}
        </p>
      </footer>
    </div>
  );
}
