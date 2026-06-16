import LegalPageLayout from "../components/LegalPageLayout.jsx";

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <section>
        <h2>1. Overview</h2>
        <p>
          This Privacy Policy explains how UnderbossHQ (&quot;we&quot;,
          &quot;us&quot;) collects, uses, and shares information when you use
          our Discord bot and web dashboard (the &quot;Service&quot;).
        </p>
        <p>
          UnderbossHQ is not affiliated with Discord Inc. Discord&apos;s own
          privacy policy applies to your use of Discord separately.
        </p>
      </section>

      <section>
        <h2>2. Information we collect</h2>
        <h3>From Discord (when you sign in or use the bot)</h3>
        <ul>
          <li>Discord user ID, username, and avatar</li>
          <li>Server (guild) IDs and names you access or manage</li>
          <li>Roles and permissions used to authorize dashboard features</li>
          <li>
            Messages or content only where required for features you enable
            (for example, posting announcements or guides you create)
          </li>
        </ul>

        <h3>Data you create in the Service</h3>
        <ul>
          <li>Guides, announcements, events, and settings</li>
          <li>Moderation cases, warnings, kicks, and related notes</li>
          <li>Invite tracking and analytics derived from server activity</li>
          <li>Optional AI prompt inputs and generated drafts</li>
        </ul>

        <h3>Technical data</h3>
        <ul>
          <li>Session identifiers and authentication cookies</li>
          <li>IP address and request logs for security and rate limiting</li>
          <li>Error logs to diagnose outages and bugs</li>
        </ul>
      </section>

      <section>
        <h2>3. How we use information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Authenticate you and enforce role-based access</li>
          <li>Provide dashboard, bot, and moderation features</li>
          <li>Operate premium status and billing when enabled</li>
          <li>Improve reliability, security, and support</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>
          We do not sell your personal information. We do not use Discord data
          to train third-party AI models unless you explicitly submit content
          to an AI feature and that feature is enabled for your server.
        </p>
      </section>

      <section>
        <h2>4. Third-party services</h2>
        <p>We may rely on service providers such as:</p>
        <ul>
          <li>
            <strong>Discord</strong> — authentication, bot API, and server
            data
          </li>
          <li>
            <strong>Hosting providers</strong> — application and database hosting
            (for example Render, Vercel, PostgreSQL)
          </li>
          <li>
            <strong>OpenAI or compatible APIs</strong> — optional AI drafting
            when configured and premium is active
          </li>
          <li>
            <strong>Stripe</strong> — payment processing when self-serve billing
            is enabled
          </li>
        </ul>
        <p>
          These providers process data according to their own policies and our
          instructions needed to run the Service.
        </p>
      </section>

      <section>
        <h2>5. Data retention</h2>
        <p>
          We retain data for as long as needed to provide the Service, meet
          legal requirements, and resolve disputes. Server administrators may
          request deletion of server-specific data by contacting the operator
          of their deployment.
        </p>
        <p>
          Session data expires according to backend session settings. Moderation
          and content records may persist until deleted by authorized staff or
          removed during server offboarding.
        </p>
      </section>

      <section>
        <h2>6. Your choices</h2>
        <ul>
          <li>
            You can revoke the app&apos;s access in Discord under User Settings
            → Authorized Apps.
          </li>
          <li>
            Server owners can remove the bot from their server at any time.
          </li>
          <li>
            You may request access, correction, or deletion of your data by
            contacting your server administrator or the project contact below.
          </li>
        </ul>
      </section>

      <section>
        <h2>7. Security</h2>
        <p>
          We use industry-standard measures such as HTTPS, secure session
          storage, environment-based secrets, and role checks. No method of
          transmission or storage is 100% secure.
        </p>
      </section>

      <section>
        <h2>8. Children</h2>
        <p>
          The Service is not directed at children under 13. We do not knowingly
          collect personal information from children under 13. If you believe a
          child has provided us data, contact us so we can delete it.
        </p>
      </section>

      <section>
        <h2>9. International users</h2>
        <p>
          Data may be processed in countries where our hosting providers operate.
          By using the Service, you consent to this processing as permitted by
          applicable law.
        </p>
      </section>

      <section>
        <h2>10. Changes</h2>
        <p>
          We may update this Privacy Policy. The &quot;Last updated&quot; date
          at the top will change when we do. Continued use after updates means
          you accept the revised policy.
        </p>
      </section>

      <section>
        <h2>11. Contact</h2>
        <p>
          Privacy questions: open an issue at{" "}
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
