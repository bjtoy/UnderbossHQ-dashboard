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
      "Write rich guides (banners, fonts, callouts), announcements, and events",
      "Post content from the dashboard straight into Discord channels",
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
        note: "If login fails, ask your server admin to confirm the bot is installed and OAuth is configured correctly. You can download the Word manual from the login page without signing in.",
      },
      {
        title: "Choose a server",
        steps: [
          "After login you land on Select Server.",
          "Pick the Discord server you want to manage.",
          "You need Manage Server (or equivalent staff access) on that server for most tools.",
        ],
        note: "Use Change Server in the sidebar anytime to switch. You can open Help or download the Word manual before picking a server.",
      },
      {
        title: "Premium access",
        paragraphs: [
          "Some servers require an active premium subscription to use most of the dashboard.",
          "Complimentary users can use the dashboard without paying. Paying unlocks the server for everyone on it.",
          "Help stays available even when the paywall is up.",
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
      "Access depends on your Discord permissions and UnderbossHQ roles. After role changes, an admin should run Admin → Sync Roles.",
      "If Discord posting fails with a permission error, you will see a toast message. Ask an admin to sync roles or update Discord role mappings.",
    ],
    table: {
      headers: ["Role", "Typical access"],
      rows: [
        ["Member", "Home, guides / announcements / events (read), Help, translator"],
        [
          "Enforcer",
          "Create and edit guides; publish / post guides to Discord",
        ],
        [
          "Moderator (Mod)",
          "Guide publish plus announcements, events, moderation, analytics, cases, user lookup",
        ],
        [
          "Admin",
          "Full server tools: admin dashboard, logs, webhooks, invites, users, settings",
        ],
        [
          "Platform owner",
          "Premium & Billing (grant/revoke subscriptions and complimentary users)",
        ],
      ],
    },
    subsections: [
      {
        title: "Guide permissions",
        table: {
          headers: ["Action", "Who"],
          rows: [
            ["Read / view guides", "Everyone with dashboard access"],
            ["Create / edit guides", "Admin, Mod, Moderator, Enforcer"],
            ["Delete guides", "Admin, Mod, Moderator (not Enforcer)"],
            [
              "Publish / post to Discord",
              "PUBLISH_GUIDE — Admin, Mod, Moderator, and Enforcer",
            ],
          ],
        },
      },
    ],
  },
  {
    id: "navigation",
    title: "Navigation basics",
    subsections: [
      {
        title: "Desktop",
        bullets: [
          "Left sidebar lists pages you can open (sections appear based on your roles).",
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
          "Help — this guide; works before picking a server and behind the premium paywall",
          "Translator — floating 🌐 when you are not blocked by the paywall",
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
        title: "Guides — reading",
        bullets: [
          "Browse faction guides for the selected server",
          "Open a guide to read the styled dashboard layout",
          "Use Copy for Discord when you need a plain-text version for paste",
        ],
      },
      {
        title: "Guides — create and post (staff)",
        steps: [
          "Go to Guides → Create Guide (or Edit).",
          "Enter a title and write content (new guides start with a sample Fancy / Caudex banner).",
          "Use the tabbed toolbar — Banner, Structure, Text, Callouts — and watch the live preview.",
          "Save the guide.",
          "With PUBLISH_GUIDE: pick a Discord channel in the editor and use Save & post / Post / Publish & post.",
          "Or use quick post on the Guides list: choose a channel, then Post to Discord on a card.",
        ],
        note: "Discord does not render full dashboard styling. The bot posts a Discord-friendly version; use Copy for Discord for hand-paste.",
      },
      {
        title: "Guide editor — formatting toolkit",
        paragraphs: [
          "Tab 1 Banner: styles (Standard, Fancy, Minimal, Gaming, Tactical, Plaque, Ribbon, Poster), fonts (Fancy / Sans-Title / Typewriter), colors and textures (Parchment, Carbon, Marble, Damask, and more).",
          "Tab 2 Structure: section variants (Plain, Bar, Pill, Divider) and headings (Large, Medium, Small).",
          "Tab 3 Text: Body, Lead, Quote, Note, Centered, plus color highlights.",
          "Tab 4 Callouts: Tip, Warning, and Important boxes.",
        ],
        note: "Keep fancy fonts for titles. Put the long rich version on the dashboard; keep Discord posts shorter.",
      },
      {
        title: "Announcements & Events",
        bullets: [
          "Announcements — staff (Admin / Mod / Moderator) can create, edit, delete, and post to Discord",
          "Events — staff can set title, description, location, and start/end times",
        ],
      },
      {
        title: "Translator",
        steps: [
          "Tap 🌐 (hidden while the premium paywall is blocking you).",
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
    paragraphs: [
      "Visible when you have Mod / Moderator access (Admin also sees these).",
    ],
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
          "Look up a Discord user by ID and run moderation actions (warn, promote, demote, kick) with a reason. Usernames are resolved when Discord profile data is available.",
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
        note: "Use Sync Roles after changing Discord role mappings so dashboard permissions (including guide publish) update.",
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
        note: "Save after changes. Guide and announcement post pickers use these channel defaults when possible.",
      },
    ],
  },
  {
    id: "billing",
    title: "Premium & Billing",
    paragraphs: [
      "Only platform owners see Premium & Billing in the sidebar.",
      "Server premium unlocks the dashboard for everyone on the selected server and unlocks premium Discord bot slash commands for that guild.",
      "Complimentary users get free dashboard access by Discord user ID (separate from guild bot premium).",
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
          "Checkout and billing flows still work when the rest of the dashboard is locked",
        ],
      },
    ],
  },
  {
    id: "bot",
    title: "Discord bot (quick reference)",
    paragraphs: [
      "Prefer the dashboard for long styled guides and announcements; use slash commands for quick in-Discord actions.",
      "Staff slash actions still require staff Discord permissions even when the guild has premium.",
    ],
    subsections: [
      {
        title: "Free commands (every guild)",
        table: {
          headers: ["Area", "Examples"],
          rows: [
            ["Utility", "/ping, /serverinfo, /help"],
            ["Moderation", "/warn, /mute, /kick"],
          ],
        },
      },
      {
        title: "Premium commands (guild must have premium)",
        table: {
          headers: ["Area", "Examples"],
          rows: [
            ["Content", "/announce, /guide, /guide-styled"],
            ["Staff", "/promote, /demote"],
            ["Roles / access", "/role, /channel-access"],
          ],
        },
      },
    ],
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
          "Missing Mod/Admin/Enforcer tools",
          "Check Discord roles; ask an admin to Sync Roles",
        ],
        [
          "Premium required screen",
          "Subscribe (owner/admin) or request complimentary access — Help stays available",
        ],
        [
          "Can’t see Post to Discord",
          "Confirm PUBLISH_GUIDE (Admin / Mod / Moderator / Enforcer after sync)",
        ],
        [
          "Guide won’t post",
          "Save first; pick a channel; confirm the bot can post there; read the toast error",
        ],
        [
          "Banner fonts look wrong",
          "Try another font group; keep fancy fonts for titles, not long paragraphs",
        ],
        [
          "Mobile menu hard to use",
          "Use the ☰ button; close by tapping outside the drawer",
        ],
        [
          "Translator not loading",
          "Confirm you are past the paywall; try again in a few seconds",
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
      "Download User Manual — Word file from the login page, Help page, Select Server, or the button above",
    ],
  },
];
