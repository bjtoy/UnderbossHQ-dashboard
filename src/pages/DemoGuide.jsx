import { Link } from "react-router-dom";
import GuideContent from "../components/GuideContent.jsx";
import PublicShell from "../components/PublicShell.jsx";
import { DEMO_GUIDE_CONTENT } from "../content/demoGuide.js";

export default function DemoGuide() {
  return (
    <PublicShell
      title="Demo guide"
      subtitle="Real faction guide markup — banners, sections, callouts, and colors — exactly as members see it in Discord."
    >
      <div className="card page-stack public-section">
        <GuideContent content={DEMO_GUIDE_CONTENT} />
        <p className="muted">
          Excerpt from a live UnderbossHQ guide template. Sign in to create, edit,
          and post your own guides to Discord channels.
        </p>
        <div className="action-row">
          <Link to="/pricing" className="btn btn-outline-gold btn-sm">
            See premium plans
          </Link>
          <Link to="/login" className="btn btn-outline-red btn-sm">
            Sign in to create guides
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
