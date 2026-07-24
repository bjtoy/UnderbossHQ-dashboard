/**
 * Builds staff meeting Word + PowerPoint from ../UBHQ-admin/STAFF_MEETING_BRIEFING.md
 * Outputs to L:\UBHQ-admin\ (sibling of repo; not deployed with the dashboard).
 * Run: npm run build:staff-briefing  (from dashboard/)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ExternalHyperlink,
} from "docx";
import pptxgen from "pptxgenjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const adminDir =
  process.env.UBHQ_ADMIN_DIR?.trim() ||
  path.resolve(root, "..", "UBHQ-admin");
const mdPath = path.join(adminDir, "STAFF_MEETING_BRIEFING.md");
const docxOut = path.join(adminDir, "UnderbossHQ-Staff-Meeting-Briefing.docx");
const pptxOut = path.join(adminDir, "UnderbossHQ-Staff-Meeting-Briefing.pptx");

function parseInline(text) {
  const runs = [];
  const re = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(`([^`]+)`)|([^*`\[]+)/g;
  let match;
  while ((match = re.exec(text)) !== null) {
    if (match[1]) {
      runs.push(
        new ExternalHyperlink({
          children: [
            new TextRun({ text: match[2], color: "8B0018", underline: {} }),
          ],
          link: match[3],
        })
      );
    } else if (match[4]) {
      runs.push(new TextRun({ text: match[5], bold: true }));
    } else if (match[6]) {
      runs.push(new TextRun({ text: match[7], font: "Consolas" }));
    } else if (match[8]) {
      runs.push(new TextRun({ text: match[8] }));
    }
  }
  return runs.length ? runs : [new TextRun({ text })];
}

function para(text, options = {}) {
  return new Paragraph({
    spacing: { after: 160 },
    ...options,
    children: parseInline(text),
  });
}

function heading(text, level) {
  return new Paragraph({
    heading: level,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, bold: true })],
  });
}

function makeTable(rows) {
  const border = { style: BorderStyle.SINGLE, size: 8, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((cells, rowIndex) =>
      new TableRow({
        children: cells.map(
          (cell) =>
            new TableCell({
              borders,
              width: {
                size: Math.floor(100 / cells.length),
                type: WidthType.PERCENTAGE,
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: cell, bold: rowIndex === 0 }),
                  ],
                }),
              ],
            })
        ),
      })
    ),
  });
}

function markdownToChildren(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const children = [];
  let i = 0;
  let listBuffer = [];

  function flushList() {
    if (!listBuffer.length) return;
    for (const item of listBuffer) {
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          indent: { left: 360 },
          children: [new TextRun({ text: "• " }), ...parseInline(item)],
        })
      );
    }
    listBuffer = [];
  }

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "---") {
      flushList();
      i += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      flushList();
      children.push(
        new Paragraph({
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: line.slice(2).trim(), bold: true })],
        })
      );
      i += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      children.push(heading(line.slice(3).trim(), HeadingLevel.HEADING_1));
      i += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      flushList();
      children.push(heading(line.slice(4).trim(), HeadingLevel.HEADING_2));
      i += 1;
      continue;
    }

    if (line.trim().startsWith("|") && line.includes("|")) {
      flushList();
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i += 1;
      }
      const rows = tableLines
        .filter((row) => !/^\|\s*-+/.test(row.trim()))
        .map((row) =>
          row
            .split("|")
            .slice(1, -1)
            .map((cell) => cell.trim().replace(/\*\*/g, ""))
        );
      if (rows.length) children.push(makeTable(rows));
      children.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      listBuffer.push(bullet[1]);
      i += 1;
      continue;
    }

    const numbered = line.match(/^\d+\.\s+(.+)$/);
    if (numbered) {
      flushList();
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          indent: { left: 360 },
          children: [
            new TextRun({ text: `${line.match(/^\d+/)[0]}. ` }),
            ...parseInline(numbered[1]),
          ],
        })
      );
      i += 1;
      continue;
    }

    if (!line.trim()) {
      flushList();
      i += 1;
      continue;
    }

    flushList();
    if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
      children.push(
        new Paragraph({
          spacing: { before: 200, after: 80 },
          children: [
            new TextRun({ text: line.replace(/^\*|\*$/g, ""), italics: true }),
          ],
        })
      );
    } else {
      children.push(para(line.trim()));
    }
    i += 1;
  }

  flushList();
  return children;
}

async function buildDocx(md) {
  const doc = new Document({
    creator: "UnderbossHQ",
    title: "UnderbossHQ Staff Meeting Briefing",
    description:
      "Internal staff briefing — product, hosting, growth, and communications — 22 July 2026",
    sections: [{ properties: {}, children: markdownToChildren(md) }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.mkdirSync(adminDir, { recursive: true });
  fs.writeFileSync(docxOut, buffer);
  console.log(`Wrote ${docxOut}`);
}

function slideTitle(slide, title, subtitle) {
  slide.background = { color: "11060A" };
  slide.addText(title, {
    x: 0.5,
    y: 1.2,
    w: 9,
    h: 1.2,
    fontSize: 32,
    bold: true,
    color: "D4A830",
    align: "center",
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5,
      y: 2.5,
      w: 9,
      h: 0.8,
      fontSize: 16,
      color: "F0E8DC",
      align: "center",
    });
  }
}

function slideSection(pres, title, bullets) {
  const slide = pres.addSlide();
  slide.background = { color: "11060A" };
  slide.addText(title, {
    x: 0.5,
    y: 0.35,
    w: 9,
    h: 0.7,
    fontSize: 24,
    bold: true,
    color: "D4A830",
  });
  slide.addText(bullets.join("\n"), {
    x: 0.55,
    y: 1.15,
    w: 8.9,
    h: 4.5,
    fontSize: 14,
    color: "F0E8DC",
    valign: "top",
    bullet: true,
    lineSpacingMultiple: 1.15,
  });
  slide.addText("UnderbossHQ · Staff briefing · 22 Jul 2026", {
    x: 0.5,
    y: 5.35,
    w: 9,
    h: 0.3,
    fontSize: 9,
    color: "9A8894",
    align: "center",
  });
}

function slideTable(pres, title, headers, rows) {
  const slide = pres.addSlide();
  slide.background = { color: "11060A" };
  slide.addText(title, {
    x: 0.5,
    y: 0.35,
    w: 9,
    h: 0.7,
    fontSize: 22,
    bold: true,
    color: "D4A830",
  });

  const tableRows = [
    headers.map((h) => ({
      text: h,
      options: {
        bold: true,
        color: "D4A830",
        fill: { color: "1C0C14" },
      },
    })),
    ...rows.map((row) =>
      row.map((cell) => ({ text: cell, options: { color: "F0E8DC" } }))
    ),
  ];

  slide.addTable(tableRows, {
    x: 0.4,
    y: 1.1,
    w: 9.2,
    colW: [2.8, 6.4],
    border: { type: "solid", color: "8B0018", pt: 1 },
    fontSize: 11,
  });
}

async function buildPptx() {
  const pres = new pptxgen();
  pres.author = "UnderbossHQ";
  pres.title = "UnderbossHQ Staff Meeting Briefing";
  pres.layout = "LAYOUT_16x9";

  const s1 = pres.addSlide();
  slideTitle(
    s1,
    "UnderbossHQ Staff Briefing",
    "Product · Hosting · Growth · Communications\n22 July 2026 · All pricing in AUD"
  );

  slideSection(pres, "Meeting agenda (60–90 min)", [
    "Product architecture recap",
    "Dashboard work completed today",
    "Render instability & migration options",
    "Custom domain setup",
    "Pricing, comps, and go-to-market",
    "Communication scripts",
    "Future: non-Discord & WhatsApp",
    "Action items & owners",
  ]);

  slideSection(pres, "Architecture — 4 parts, 2 deploys", [
    "Dashboard (React) → Vercel today",
    "Backend API (Express) → Render today",
    "Discord bot → same process as API (DISCORD_TOKEN)",
    "PostgreSQL → Render Postgres (free tier in blueprint)",
    "Key risk: API restart or spin-down kills the bot",
  ]);

  slideSection(pres, "Completed today — member search", [
    "Step 1: Admin runs Sync Roles to import members",
    "Step 2: Moderator opens User Lookup",
    "Step 3: Type Discord name → pick from autocomplete",
    "Step 4: Run warn / promote / kick or open case file",
    "User Management also filters live by Discord name",
  ]);

  slideSection(pres, "Completed today — login UX", [
    "User Manual: own section, gold link, separate from legal links",
    "Brand header (UnderbossHQ) enlarged on login page",
    "Buttons reduced globally — smaller font and padding",
    "Mobile buttons ~34px min-height (was 44px)",
  ]);

  slideSection(pres, "Why Render feels unstable", [
    "Free tier sleeps after ~15 min → bot disconnects",
    "Cold starts: 30–60+ sec before API and bot return",
    "Deploy/crash restarts API and bot together",
    "Free Postgres can expire or add latency",
    "render.yaml currently specifies plan: free — not for production bot",
  ]);

  slideTable(
    pres,
    "Hosting options (approx. AUD/month)",
    ["Option", "Notes / cost"],
    [
      ["Render paid", "~$22–35 AUD — quick fix, always-on"],
      ["Railway", "~$15–40 AUD — easy migration"],
      ["Fly.io (Sydney)", "~$10–25 AUD — good AU latency"],
      ["VPS + Docker", "~$8–20 AUD — best stability per dollar"],
      ["Split API + bot", "Two services — most reliable long-term"],
    ]
  );

  slideSection(pres, "Migration checklist (10 steps)", [
    "1. Provision new host + Postgres (Neon recommended)",
    "2. Copy all backend env vars from Render",
    "3. Set DISCORD_CALLBACK_URL on new API URL",
    "4. Update Discord OAuth redirect URI",
    "5. Update VITE_API_URL → rebuild dashboard",
    "6. Set FRONTEND_URL on backend (exact match)",
    "7. Deploy → verify /api/health",
    "8. npm run deploy-commands",
    "9. Confirm Bot Status Online + /ping",
    "10. DNS cutover; keep Render 48h rollback",
  ]);

  slideSection(pres, "Custom domain (recommended)", [
    "app.yourdomain.com → dashboard (Vercel)",
    "api.yourdomain.com → backend + bot",
    "Update FRONTEND_URL, DISCORD_CALLBACK_URL, VITE_API_URL",
    "Update Revolut/Stripe webhook URLs on api subdomain",
    "SSL auto-provisions after DNS validates",
  ]);

  slideSection(pres, "Go-to-market & pricing (AUD)", [
    "Buyer: server owner / head admin — not random members",
    "Launch target: $25–35 AUD/month per server",
    "Viability example: 40 servers × $30 ≈ $1,200 AUD/mo",
    "Track: login → guild → paywall → paid conversion",
    "Before ads: custom domain, always-on bot, clear price, trial/demo",
  ]);

  slideTable(
    pres,
    "Complimentary access — the deal",
    ["We give", "They give"],
    [
      ["Free dashboard access (by Discord User ID)", "Discord User ID + server name"],
      ["Direct operator support", "20–30 min real use in 7 days"],
      ["Optional server premium for whole guild", "Written feedback in 14 days"],
      ["Founding rate after comp (optional)", "Bug reports; optional testimonial"],
    ]
  );

  slideSection(pres, "Future direction (not built yet)", [
    "Phase 1: Email login + roles stored in DB",
    "Phase 2: Standalone orgs without Discord",
    "Phase 3: Discord as optional connector",
    "Phase 4: WhatsApp Business API adapter",
    "WhatsApp ≠ Discord parity — set expectations on moderation",
  ]);

  slideSection(pres, "Action items — assign today", [
    "☐ Migrate backend off Render free (or upgrade paid)",
    "☐ Move DB to Neon / paid Postgres",
    "☐ Register custom domain + DNS",
    "☐ Update OAuth + rebuild dashboard",
    "☐ Send comp invites to founding testers",
    "☐ Post official server member announcement",
    "☐ Record 90-second demo video",
    "☐ Set Revolut premium amount in AUD",
    "☐ Run LAUNCH_CHECKLIST.md smoke test",
  ]);

  const sEnd = pres.addSlide();
  slideTitle(sEnd, "Questions & decisions", "Record in minutes: host choice · domain · AUD price · comp dates");

  fs.mkdirSync(adminDir, { recursive: true });
  await pres.writeFile({ fileName: pptxOut });
  console.log(`Wrote ${pptxOut}`);
}

async function main() {
  if (!fs.existsSync(mdPath)) {
    throw new Error(`Missing source: ${mdPath}`);
  }

  const md = fs.readFileSync(mdPath, "utf8");
  await buildDocx(md);
  await buildPptx();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
