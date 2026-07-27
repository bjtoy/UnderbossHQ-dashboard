/** All prices AUD. Server checkout live via Revolut; individual tiers listed for transparency. */

export const PRICING_CURRENCY = "AUD";

export const ACCESS_LEVELS = [
  {
    id: "public",
    title: "Public (no account)",
    price: "Free",
    period: "",
    description: "Browse without signing in — no password required.",
    features: [
      "Landing page, pricing, and contact details",
      "Public help overview and styled demo guide",
      "Terms, privacy, and user manual download",
      "See exactly what premium unlocks before you sign up",
    ],
  },
  {
    id: "registered",
    title: "Free account",
    price: "Free",
    period: "",
    description: "Sign in with Discord for real community value — not just bot basics.",
    features: [
      "Everything in Public",
      "Read published faction guides with full styled markup",
      "Member home — announcements, events, and server directory",
      "Full in-app Help and translator widget",
      "Personal profile and bookmarked guides",
    ],
  },
];

export const PREMIUM_PLANS = [
  {
    id: "individual-app",
    name: "Individual App",
    audience: "Individual",
    product: "App",
    priceMonthly: 9,
    priceAnnual: 90,
    highlight: false,
    bestFor: "Solo creators or staff who need dashboard tools for themselves.",
    includes: [
      "Create and edit rich faction guides",
      "Announcements and events (personal scope)",
      "Post styled guides to Discord when bot is connected",
    ],
    checkoutScope: "individual",
  },
  {
    id: "individual-bot",
    name: "Individual Bot",
    audience: "Individual",
    product: "Bot",
    priceMonthly: 5,
    priceAnnual: 50,
    highlight: false,
    bestFor: "Moderators who need premium slash commands on their account.",
    includes: [
      "Premium slash commands for you as staff",
      "Requires Discord bot in server",
      "Works alongside server bot premium",
    ],
    checkoutScope: "individual",
  },
  {
    id: "individual-bundle",
    name: "Individual Bundle",
    audience: "Individual",
    product: "App + Bot",
    priceMonthly: 12,
    priceAnnual: 120,
    saveVsSeparate: 2,
    highlight: true,
    bestFor: "Power users who want both dashboard and bot tools.",
    includes: [
      "All Individual App features",
      "All Individual Bot features",
      "Save $2/mo vs buying separately",
    ],
    checkoutScope: "individual",
  },
  {
    id: "server-app",
    name: "Server App",
    audience: "Server / org",
    product: "App",
    priceMonthly: 14,
    priceAnnual: 140,
    highlight: false,
    bestFor: "Unlock the full dashboard for everyone on your Discord server.",
    includes: [
      "Full dashboard for all members",
      "Guides, announcements, and events",
      "Moderation tools and case files",
      "Admin panel, users, settings, and logs",
    ],
    checkoutScope: "server",
    checkoutAvailable: true,
  },
  {
    id: "server-bot",
    name: "Server Bot",
    audience: "Server / org",
    product: "Bot",
    priceMonthly: 8,
    priceAnnual: 80,
    highlight: false,
    bestFor: "Premium bot commands for the whole guild.",
    includes: [
      "Full premium slash command set",
      "Mod actions via bot for all staff",
      "Announce and post rich guides from Discord",
    ],
    checkoutScope: "server",
  },
  {
    id: "server-bundle",
    name: "Server Bundle",
    audience: "Server / org",
    product: "App + Bot",
    priceMonthly: 20,
    priceAnnual: 200,
    saveVsSeparate: 2,
    highlight: true,
    bestFor: "Most Discord communities — full platform at the cap.",
    includes: [
      "All Server App features",
      "All Server Bot features",
      "Save $2/mo vs buying separately",
    ],
    checkoutScope: "server",
    checkoutAvailable: true,
  },
];

export const FEATURE_MATRIX = {
  headers: ["Feature", "Public", "Free account", "App premium", "Bot premium"],
  rows: [
    ["Pricing and legal pages", "Yes", "Yes", "Yes", "Yes"],
    ["Public help and demo guide", "Yes", "Yes", "Yes", "Yes"],
    ["Read published faction guides", "Demo only", "Yes", "Yes", "Yes"],
    ["Member home and server directory", "No", "Yes", "Yes", "Yes"],
    ["Translator widget", "No", "Yes", "Yes", "Yes"],
    ["Create / edit guides", "No", "No", "Yes", "No"],
    ["Post to Discord from dashboard", "No", "No", "Yes", "No"],
    ["Moderation and case files", "No", "No", "Server app", "No"],
    ["Admin tools", "No", "No", "Server app", "No"],
    ["Premium bot slash commands", "No", "No", "No", "Yes"],
  ],
};

export const FOUNDING_OFFER = {
  label: "Founding tester rate (after comp period)",
  individualBundleMonthly: 7,
  serverBundleMonthly: 16,
  note: "Limited slots for early adopters who provide feedback.",
};

export function formatAud(amount) {
  return `$${amount} ${PRICING_CURRENCY}`;
}

export function formatMonthly(plan) {
  return `${formatAud(plan.priceMonthly)}/mo`;
}

export function formatAnnual(plan) {
  return `${formatAud(plan.priceAnnual)}/yr`;
}
