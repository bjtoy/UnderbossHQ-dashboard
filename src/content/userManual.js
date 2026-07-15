export const MANUAL_DOWNLOAD_URL = "/UnderbossHQ-User-Manual.docx";

export const HELP_SECTIONS = [
  {
    id: "overview",
    title: "What UnderbossHQ does",
    paragraphs: [
      "UnderbossHQ connects your Discord server to a web dashboard so staff can manage content, moderation, and server tools in one place.",
      "The Discord bot and the dashboard share the same data for your selected server.",
    ],
    bullets: [
      "View member profile stats and server activity",
      "Publish guides, announcements, and events",
      "Moderate members (warn, promote, demote, kick, case files)",
      "Track invites and server growth",
      "Configure bot channels and sync roles",
      "Subscribe for premium access (or receive complimentary access)",
    ],
  },
  {
    id: "getting-started",
    title: "Getting started",
    subsections: [
      {
        title: "Sign in",
        steps: [
          "Open the dashboard URL.",
          "Click Login with Discord.",
          "Authorize UnderbossHQ when Discord asks for permission.",
          "You will return to the dashboard automatically.",
        ],
        note: "If login fails, ask your server admin to confirm the bot is installed and OAuth is configured correctly.",
      },
      {
        title: "Choose a server",
        steps: [
          "After login you land on Select Server.",
          "Pick the Discord server you want to manage.",
          "You must have Manage Server (or equivalent staff access) on that server for most tools.",
        ],
        note: "Use Change Server in the sidebar anytime to switch. You can open Help before picking a server.",
      },
      {
        title: "Premium access",
        paragraphs: [
          "Some servers require an active premium subscription to use the dashboard.",
          "Complimentary users can use the dashboard without paying. Paying unlocks the server for everyone on it.",
        ],
        table: {
          headers: ["Situation", "What to do"],
          rows: [
            [
              "You see Premium required",
              "Ask a server owner/admin to subscribe, or ask the platform operator for complimentary access",
            ],
            [
              "You manage the server",
              "Use Subscribe with Stripe on the paywall (if enabled)",
            ],
            [
              "You are a platform operator",
              "Use Premium & Billing to grant server premium or complimentary users",
            ],
          ],
        },
      },
    ],
  },
  {
    id: "roles",
    title: "Who can do what",
    paragraphs: [
      "Access depends on your Discord permissions and UnderbossHQ roles.",
      "If you expect staff tools but only see Member links, confirm your Discord roles sync correctly (Admin → Sync Roles).",
    ],
    table: {
      headers: ["Role", "Typical access"],
      rows: [
        ["Member", "Home, guides, announcements, events (read); translator"],
        [
          "Moderator",
          "Everything members have, plus moderation tools, analytics, case history, user lookup",
        ],
        [
          "Admin",
          "Everything moderators have, plus admin dashboard, logs, webhooks, invites, users, settings",
        ],
        [
          "Platform owner",
          "Premium & Billing (grant/revoke subscriptions and free users)",
        ],
      ],
    },
  },
  {
    id: "navigation",
    title: "Navigation basics",
    subsections: [
      {
        title: "Desktop",
        bullets: [
          "Left sidebar lists pages you can open.",
          "Top bar shows UnderbossHQ, the current page name, your username, and the selected server.",
        ],
      },
      {
        title: "Mobile",
        bullets: [
          "Tap the menu button (☰) to open navigation.",
          "Tap outside the drawer or choose a link to close it.",
          "Tables scroll sideways when they are wider than the screen.",
          "Prefer portrait mode for reading guides.",
        ],
      },
      {
        title: "Always available",
        bullets: [
          "Change Server — pick a different Discord server",
          "Log out — end your session",
          "Translator — floating button (🌐) for quick text translation (when access allows)",
          "Help — this guide (also available before purchasing premium)",
        ],
      },
    ],
  },
  {
    id: "member",
    title: "Member features",
    subsections: [
      {
        title: "Home",
        bullets: [
          "Your profile for the selected server (server name, rank, warnings)",
          "Quick stats (members, guides, new members)",
          "Upcoming events and recent announcements",
        ],
      },
      {
        title: "Guides",
        paragraphs: [
          "Browse faction guides published for your server. Open a guide to read it. Staff with editor permission can create, edit, publish, and post guides to Discord.",
        ],
        steps: [
          "Go to Guides → Create Guide (or Edit on an existing guide).",
          "Enter a title and content.",
          "Use the toolbar for banners, colored text, callouts, and sections.",
          "Preview on the right as you type.",
          "Save, then optionally choose a Discord channel and Post to Discord / Publish.",
        ],
      },
      {
        title: "Announcements",
        paragraphs: [
          "View server announcements. Staff can create, edit, delete, and post them to a Discord channel.",
        ],
      },
      {
        title: "Events",
        paragraphs: [
          "View upcoming and past events. Staff can create events with title, description, location, and start/end times.",
        ],
      },
      {
        title: "Translator",
        steps: [
          "Tap 🌐.",
          "Choose languages (or leave source as Auto-detect).",
          "Type or paste text — translation updates after a short pause.",
          "Copy or clear as needed.",
        ],
      },
    ],
  },
  {
    id: "moderator",
    title: "Moderator tools",
    paragraphs: ["Visible when you have Mod / Moderator access."],
    subsections: [
      {
        title: "Moderation Tools",
        paragraphs: [
          "Overview of live moderation stats (active cases, warnings, actions).",
        ],
      },
      {
        title: "Active Cases / Case History",
        bullets: [
          "Active Cases — members currently under review",
          "Case History — past case records",
          "Open a case for details and actions (warn notes, promote, demote, kick, depending on permissions)",
        ],
      },
      {
        title: "User Lookup",
        paragraphs: [
          "Look up a Discord user by ID and run moderation actions (warn, promote, demote, kick) with a reason.",
        ],
        note: "Always include a clear reason for moderation actions — it is logged for audit.",
      },
      {
        title: "Analytics",
        paragraphs: [
          "Server growth and activity overview: content counts, moderation totals, joins, top inviters, and recent joins.",
        ],
      },
    ],
  },
  {
    id: "admin",
    title: "Admin tools",
    paragraphs: ["Visible when you have Admin access."],
    subsections: [
      {
        title: "Admin Dashboard",
        bullets: [
          "Bot online/offline and latency",
          "Guild member count and premium status (for operators)",
          "Reload Bot Config and Sync Roles",
        ],
        note: "Use Sync Roles after changing Discord role mappings so dashboard permissions update.",
      },
      {
        title: "System Logs",
        paragraphs: ["Operational / system log view for troubleshooting."],
      },
      {
        title: "Webhooks",
        paragraphs: [
          "Create outbound webhooks for server events (name, URL, enabled flag, event types). Test or disable as needed.",
        ],
      },
      {
        title: "Invites",
        paragraphs: [
          "Invite tracking — see who invited whom and review join history.",
        ],
      },
      {
        title: "Users",
        paragraphs: [
          "Manage synced dashboard user profiles (search, rename, add/delete profile records). Profiles are normally created by Discord sync; manual adds are rare.",
        ],
      },
      {
        title: "Settings",
        bullets: [
          "Command prefix",
          "Welcome / log / guides / rules / announcements channels",
          "Auto-role",
        ],
        note: "Save after changes so the bot and dashboard use the new channels.",
      },
    ],
  },
  {
    id: "billing",
    title: "Premium & Billing",
    paragraphs: [
      "Only platform owners see Premium & Billing in the sidebar.",
      "Server premium unlocks the dashboard for everyone on the selected server.",
      "Complimentary users get free dashboard access by Discord user ID.",
    ],
    subsections: [
      {
        title: "Server premium",
        bullets: [
          "Grant days of premium for the currently selected server (manual), or use Stripe when configured",
          "Revoke server premium if needed",
          "Paying unlocks the dashboard for everyone on that server",
        ],
      },
      {
        title: "Complimentary users",
        bullets: [
          "Add a Discord user ID to grant free dashboard access to a person (any server)",
          "Optional label/note for your records",
          "Remove access when finished",
          "Env-listed complimentary IDs must be removed from server environment variables",
        ],
      },
      {
        title: "Stripe (when configured)",
        bullets: [
          "Server owners/admins can Subscribe with Stripe from the paywall",
          "Operators can open the Stripe customer portal from Premium & Billing when a Stripe subscription exists",
        ],
      },
    ],
  },
  {
    id: "bot",
    title: "Discord bot (quick reference)",
    paragraphs: [
      "The bot runs with the backend when a bot token is configured. Prefer the dashboard for long guides and announcements; use slash commands for quick in-Discord actions.",
      "Exact commands depend on what is registered for your bot.",
    ],
    table: {
      headers: ["Area", "Examples"],
      rows: [
        ["Utility", "/ping, /serverinfo, /help"],
        ["Moderation", "/warn, /kick, /mute, /promote, /demote"],
        ["Roles", "/role assign, /role remove, /role list"],
        ["Content", "/guide create, /guide post, /guide list, announce helpers"],
      ],
    },
  },
  {
    id: "troubleshooting",
    title: "Tips & troubleshooting",
    table: {
      headers: ["Problem", "Try this"],
      rows: [
        [
          "Stuck on login",
          "Hard-refresh; confirm Discord OAuth redirect matches the API URL",
        ],
        ["Wrong server tools", "Use Change Server and re-select"],
        [
          "Missing Mod/Admin menu",
          "Check Discord permissions; ask an admin to Sync Roles",
        ],
        [
          "Premium required screen",
          "Subscribe (owner/admin) or request complimentary access — Help stays available behind the paywall",
        ],
        [
          "Guide won’t post",
          "Save first; pick a Discord channel; confirm bot can post there",
        ],
        [
          "Mobile menu hard to use",
          "Use the ☰ button; close by tapping outside the drawer",
        ],
        [
          "Translator not loading",
          "Confirm you have dashboard access; try again in a few seconds",
        ],
      ],
    },
    subsections: [
      {
        title: "Mobile tips",
        bullets: [
          "Prefer portrait mode for reading guides",
          "Use the hamburger menu instead of scrolling a long nav list",
          "For tables (invites, analytics), swipe horizontally",
        ],
      },
      {
        title: "Safety",
        bullets: [
          "Never share Discord tokens, Stripe keys, or session cookies",
          "Only grant complimentary access to people you trust",
          "Log moderation reasons clearly",
        ],
      },
    ],
  },
  {
    id: "legal",
    title: "Legal & support",
    paragraphs: [
      "For deployment and developer setup, see QUICKSTART.md, DEPLOYMENT_GUIDE.md, and LAUNCH_CHECKLIST.md in the repository.",
    ],
    bullets: [
      "Terms of Service — /terms in the dashboard",
      "Privacy Policy — /privacy in the dashboard",
      "Help — this in-app guide at /help",
      "Download User Manual — Word file from the login page or the button at the top of this page",
    ],
  },
];
