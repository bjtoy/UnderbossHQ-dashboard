import { Link } from "react-router-dom";
import PublicShell from "../components/PublicShell.jsx";

const DEMO_CONTENT = `[banner:crimson]

# Faction rules (sample)

This is a **demo guide** showing how styled UnderbossHQ content looks — banners, headings, and callouts.

[callout:gold]
Respect staff decisions. Disputes go to tickets, not public drama.
[/callout]

## Core rules

1. No harassment or hate speech
2. Keep recruitment in designated channels
3. Follow Discord Terms of Service

## Ranks

Members earn rank through activity and events. Admins run **Sync Roles** after promotions.

---

*This is a static preview. Sign in to create and post your own guides to Discord.*`;

export default function DemoGuide() {
  return (
    <PublicShell
      title="Demo guide"
      subtitle="Preview styled guide content without signing in."
    >
      <div className="card page-stack">
        <div className="guide-preview demo-guide-preview">{DEMO_CONTENT}</div>
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
