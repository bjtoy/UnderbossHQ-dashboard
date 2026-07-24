/**
 * Builds financial plan Word + PowerPoint from ../UBHQ-admin/UNDERBOSSHQ_FINANCIALS.md
 * Outputs to L:\UBHQ-admin\ (sibling of repo; not deployed with the dashboard).
 * Run: npm run build:financials  (from dashboard/)
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
const mdPath = path.join(adminDir, "UNDERBOSSHQ_FINANCIALS.md");
const docxOut = path.join(adminDir, "UnderbossHQ-Financial-Plan.docx");
const pptxOut = path.join(adminDir, "UnderbossHQ-Financial-Plan.pptx");

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
    title: "UnderbossHQ Financial Plan",
    description:
      "Outgoing costs, income timelines, and product upgrade schedule — AUD — 22 July 2026",
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
  slide.addText("UnderbossHQ · Financial plan · 22 Jul 2026 · AUD", {
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
  pres.title = "UnderbossHQ Financial Plan";
  pres.layout = "LAYOUT_16x9";

  const s1 = pres.addSlide();
  slideTitle(
    s1,
    "UnderbossHQ Financial Plan",
    "Costs · Income · Timelines · Product upgrades\n22 July 2026 · All figures in AUD"
  );

  slideSection(pres, "Executive summary", [
    "Launch price target: $29 AUD/month per server",
    "Founding comp: $0 for 90 days → optional $19 AUD/mo locked",
    "Break-even (hosting): ~2 paying servers",
    "Target Jul 2027: 50–100 servers → $1,450–2,900 AUD/mo gross",
    "Move off Render free before paid marketing",
  ]);

  slideTable(
    pres,
    "Monthly outgoing — recommended production (AUD)",
    ["Item", "Est. cost/mo"],
    [
      ["Backend + bot (always-on)", "$15–25"],
      ["PostgreSQL (Neon / paid)", "$0–15"],
      ["Vercel dashboard", "$0–30"],
      ["Domain (annual ÷12)", "~$2"],
      ["Monitoring", "$0–15"],
      ["Total fixed (typical)", "$28–42"],
    ]
  );

  slideTable(
    pres,
    "Integrations you pay for (or fee on use)",
    ["Service", "Integration / cost"],
    [
      ["Discord Developer", "$0 — OAuth + bot token"],
      ["Revolut Business", "Checkout — ~1–2% per sale"],
      ["Stripe (optional)", "2.9% + ~$0.30 AUD per charge"],
      ["OpenAI (optional)", "$5–50/mo if AI revived"],
      ["WhatsApp (future)", "Meta Business API — TBD"],
    ]
  );

  slideSection(pres, "Outgoing cost timeline", [
    "Jul 2026: Migrate to always-on host — $15–40/mo starts",
    "Aug 2026: Custom domain ~$20/yr + DNS + Revolut live",
    "Sep–Oct 2026: Stable stack $28–55/mo; comps only",
    "Nov 2026+: Optional ads $50–200/mo cap",
    "Year 1 fixed (no ads): ~$370–820 AUD total",
  ]);

  slideTable(
    pres,
    "Pricing tiers (AUD)",
    ["Tier", "Price"],
    [
      ["Founding comp", "$0 — 90 days"],
      ["Founding paid", "$19/mo per server"],
      ["Standard launch", "$29/mo per server"],
      ["Annual (optional)", "$290/yr per server"],
    ]
  );

  slideTable(
    pres,
    "Revenue scenarios @ $29 AUD/mo (gross)",
    ["Paying servers", "Monthly / Annual"],
    [
      ["5 servers", "$145 / $1,740"],
      ["10 servers", "$290 / $3,480"],
      ["20 servers", "$580 / $6,960"],
      ["40 servers", "$1,160 / $13,920"],
    ]
  );

  slideSection(pres, "Income timeline", [
    "Jul–Aug 2026: $0 — founding comps + stability work",
    "Sep 2026: First paid — $40–100/mo (2–5 servers)",
    "Oct 2026: Launch push — $100–290/mo (3–10 servers)",
    "Jan 2027: Target — $580–870/mo (20–30 servers)",
    "Jul 2027: Scale — $1,450+/mo (50+ servers)",
  ]);

  slideTable(
    pres,
    "Product & marketing timeline",
    ["Period", "Focus"],
    [
      ["Jul–Aug 2026", "Host migration, domain, Revolut AUD, demo video"],
      ["Sep–Oct 2026", "Founding paid, bot directories, case studies"],
      ["Nov–Jan 2027", "Public $29/mo, SEO, light ads, referrals"],
      ["2027 H1", "B2B packages, template marketplace, split API/bot"],
      ["2027 H2+", "Email login, WhatsApp adapter, paid API"],
    ]
  );

  slideSection(pres, "Decisions to record today", [
    "Backend host choice",
    "Database provider",
    "Launch + founding price (AUD)",
    "Comp end date",
    "Monthly ad budget cap (AUD)",
    "Revolut-only vs keep Stripe",
    "Paying-server target by Jan 2027",
  ]);

  const sEnd = pres.addSlide();
  slideTitle(
    sEnd,
    "Monthly budget worksheet",
    "See Word doc Section 11 — fill fixed, variable, and income lines each month"
  );

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
