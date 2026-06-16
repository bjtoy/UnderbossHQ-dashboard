import LegalPageLayout from "../components/LegalPageLayout.jsx";

export default function TermsOfService() {
  return (
    <LegalPageLayout title="Terms of Service">
      <section>
        <h2>1. Agreement</h2>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of
          UnderbossHQ, including the web dashboard, Discord bot integration, and
          related services (collectively, the &quot;Service&quot;). By signing
          in with Discord or adding the UnderbossHQ bot to a server, you agree
          to these Terms.
        </p>
        <p>
          UnderbossHQ is an independent third-party tool. It is not affiliated
          with, endorsed by, or sponsored by Discord Inc.
        </p>
      </section>

      <section>
        <h2>2. Eligibility</h2>
        <p>
          You must comply with Discord&apos;s Terms of Service and Community
          Guidelines. You must be at least 13 years old (or the minimum age
          required in your country) to use Discord and this Service.
        </p>
        <p>
          Server administrators are responsible for ensuring that moderators and
          members who use the dashboard have appropriate permissions.
        </p>
      </section>

      <section>
        <h2>3. The Service</h2>
        <p>UnderbossHQ provides Discord server management features such as:</p>
        <ul>
          <li>Member and moderator dashboards</li>
          <li>Guides, announcements, and event tools</li>
          <li>Moderation logging and case management</li>
          <li>Analytics, invite tracking, and optional AI-assisted drafting</li>
        </ul>
        <p>
          Features may change, be added, or be removed. Some features may
          require a paid premium subscription for a specific server.
        </p>
      </section>

      <section>
        <h2>4. Acceptable use</h2>
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>Violate Discord&apos;s policies or applicable law</li>
          <li>Harass, threaten, or abuse others</li>
          <li>Attempt unauthorized access to accounts, servers, or systems</li>
          <li>Upload malware, spam, or misleading content through the Service</li>
          <li>Reverse engineer or disrupt the Service</li>
        </ul>
        <p>
          We may suspend or revoke access for violations or to protect users and
          infrastructure.
        </p>
      </section>

      <section>
        <h2>5. Discord permissions</h2>
        <p>
          The bot and dashboard require Discord permissions to function (for
          example: reading server information, managing roles, posting messages,
          and executing moderation actions configured by your server). By
          installing or authorizing the app, you grant only the permissions you
          choose in Discord&apos;s authorization flow.
        </p>
      </section>

      <section>
        <h2>6. Premium and payments</h2>
        <p>
          Premium features may be offered per server. Pricing, billing, refunds,
          and cancellation terms will be shown at the time of purchase when
          self-serve billing is available. Until then, premium access may be
          granted manually by an administrator.
        </p>
      </section>

      <section>
        <h2>7. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
          WITHOUT WARRANTIES OF ANY KIND. We do not guarantee uninterrupted
          uptime, error-free operation, or that moderation or AI-generated
          content will be accurate or appropriate for every situation. Server
          staff remain responsible for final moderation and publishing
          decisions.
        </p>
      </section>

      <section>
        <h2>8. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, UnderbossHQ and its operators
          are not liable for indirect, incidental, special, consequential, or
          punitive damages, or for loss of data, profits, or goodwill arising
          from use of the Service.
        </p>
      </section>

      <section>
        <h2>9. Changes</h2>
        <p>
          We may update these Terms. Material changes will be reflected on this
          page with an updated date. Continued use after changes constitutes
          acceptance of the revised Terms.
        </p>
      </section>

      <section>
        <h2>10. Contact</h2>
        <p>
          Questions about these Terms: open an issue at{" "}
          <a
            href="https://github.com/bjtoy/UnderbossHQ"
            target="_blank"
            rel="noreferrer"
          >
            github.com/bjtoy/UnderbossHQ
          </a>{" "}
          or contact your server&apos;s UnderbossHQ administrator.
        </p>
      </section>
    </LegalPageLayout>
  );
}
