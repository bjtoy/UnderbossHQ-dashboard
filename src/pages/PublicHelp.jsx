import { Link } from "react-router-dom";
import PublicShell from "../components/PublicShell.jsx";
import HelpSectionBlock from "../components/HelpSectionBlock.jsx";
import {
  PUBLIC_HELP_SECTIONS,
  MANUAL_DOWNLOAD_URL,
} from "../content/userManual.js";

export default function PublicHelp() {
  return (
    <PublicShell
      title="Help (public overview)"
      subtitle="No sign-in required. Sign in for the full in-app manual and your server tools."
    >
      <div className="public-help-actions action-row">
        <a
          href={MANUAL_DOWNLOAD_URL}
          className="btn btn-outline-red btn-sm"
          download
        >
          Download Word manual
        </a>
        <Link to="/pricing" className="btn btn-outline-gold btn-sm">
          View pricing
        </Link>
        <Link to="/login" className="btn btn-outline-red btn-sm">
          Sign in for full Help
        </Link>
      </div>

      <div className="help-sections page-stack">
        {PUBLIC_HELP_SECTIONS.map((section) => (
          <HelpSectionBlock key={section.id} section={section} />
        ))}
      </div>

      <p className="muted card page-stack">
        Premium tiers, billing, and moderation details are in{" "}
        <Link to="/pricing">Pricing</Link>. After sign-in, open{" "}
        <strong>Help</strong> in the sidebar for the complete guide including
        roles, moderation, and admin tools.
      </p>
    </PublicShell>
  );
}
