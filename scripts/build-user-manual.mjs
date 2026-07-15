/**
 * Builds dashboard/public/UnderbossHQ-User-Manual.docx from ../USER_MANUAL.md
 * Run: node scripts/build-user-manual.mjs
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const mdPath = path.join(root, "USER_MANUAL.md");
const outDir = path.resolve(__dirname, "../public");
const outPath = path.join(outDir, "UnderbossHQ-User-Manual.docx");
const rootOutPath = path.join(root, "UnderbossHQ-User-Manual.docx");

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
  const border = {
    style: BorderStyle.SINGLE,
    size: 8,
    color: "CCCCCC",
  };
  const borders = { top: border, bottom: border, left: border, right: border };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((cells, rowIndex) =>
      new TableRow({
        children: cells.map(
          (cell) =>
            new TableCell({
              borders,
              width: { size: Math.floor(100 / cells.length), type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cell,
                      bold: rowIndex === 0,
                    }),
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
          children: [
            new TextRun({ text: "• " }),
            ...parseInline(item),
          ],
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

async function main() {
  if (!fs.existsSync(mdPath)) {
    throw new Error(`Missing source: ${mdPath}`);
  }

  const md = fs.readFileSync(mdPath, "utf8");
  const doc = new Document({
    creator: "UnderbossHQ",
    title: "UnderbossHQ User Manual",
    description: "End-user guide for the UnderbossHQ Discord dashboard",
    sections: [
      {
        properties: {},
        children: markdownToChildren(md),
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, buffer);
  fs.writeFileSync(rootOutPath, buffer);
  console.log(`Wrote ${outPath}`);
  console.log(`Wrote ${rootOutPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
