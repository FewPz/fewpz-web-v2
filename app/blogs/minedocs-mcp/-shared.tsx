import type { Locale } from '@/lib/i18n'

export const REPO = 'https://github.com/FewPz/minedocs-mcp'

/* ── Diagrams that need no translation ───────────────────── */

export const ARCHITECTURE = `
flowchart LR
  client["AI Client"]:::blue -- "MCP / stdio" --> server
  subgraph server["MineDocs MCP"]
    direction TB
    tools["Tool Registration"]:::muted --> scraper["Scraper"]:::red
    scraper --> parser["Parser"]:::yellow
    parser --> formatter["Formatter"]:::green
  end
  server <-- "fetch HTML" --> jd["PaperMC Javadocs"]:::muted`

export const SERVER_TOOLS = `
flowchart LR
  server["server.ts"]:::blue --> t1["get_paper_class_info"]:::muted
  server --> t2["search_paper_classes"]:::muted
  server --> t3["get_method_details"]:::muted
  server --> t4["get_field_summary"]:::muted
  server --> t5["list_package_classes"]:::muted
  server --> t6["search_deprecated"]:::muted`

export const AGENT_ECOSYSTEM = `
flowchart TB
  agent["Coding Agent"]:::blue
  agent --> md["MineDocs MCP"]:::red
  agent --> git["Git MCP"]:::yellow
  agent --> fs["File System"]:::green
  agent -.-> build["Build / Test MCP"]:::muted
  agent -.-> runtime["Minecraft Runtime MCP"]:::muted
  md --> api["PaperMC API"]:::muted`

/* ── Code samples ─────────────────────────────────────────── */

export const PROJECT_TREE = `
src/
├── server.ts
├── tools/
│   ├── getPaperClassInfo.ts
│   ├── searchPaperClasses.ts
│   ├── getMethodDetails.ts
│   ├── getFieldSummary.ts
│   ├── listPackageClasses.ts
│   └── searchDeprecated.ts
└── lib/
    ├── scraper.ts
    ├── parser.ts
    ├── formatter.ts
    └── ...`

export const FORMATTED_OUTPUT = `
# org.bukkit.entity.Player

## Signature

\`\`\`java
public interface Player
\`\`\`

## Description

...

## Method Summary

* \`void sendMessage(...)\`
* \`boolean teleport(...)\``

export const CURSOR_CONFIG = `
{
  "mcpServers": {
    "minedocs": {
      "command": "node",
      "args": [
        "/absolute/path/to/minedocs-mcp/dist/server.js"
      ]
    }
  }
}`

export const GOOD_PROMPT = `
Create a PaperMC plugin using the current API.

Before writing code:
1. Search PaperMC for the relevant classes.
2. Check the method signatures you plan to use.
3. Check whether those APIs are deprecated.
4. Only then generate the implementation.

The plugin should:
- listen for player block break events
- send a message to the player
- use modern Paper APIs where possible`

/** Diagrams with labels in each language */
export const DIAGRAMS: Record<Locale, Record<'OVERVIEW' | 'CLASS_PIPELINE' | 'AGENT_WORKFLOW' | 'FUTURE_LOOP', string>> = {
  th: {
    OVERVIEW: `
flowchart LR
  dev["Developer"]:::muted --> ai["AI Assistant<br/><small>Claude · Cursor · Codex</small>"]:::blue
  ai -- "MCP" --> md["MineDocs MCP"]:::red
  md --> jd["PaperMC Javadocs"]:::yellow
  jd -. "ข้อมูล API ของจริง" .-> ai`,
    CLASS_PIPELINE: `
flowchart LR
  a["fetchClassPage()"]:::red -- "HTML" --> b["parseClassPage()"]:::yellow
  b -- "ข้อมูลที่แกะแล้ว" --> c["formatAsMarkdown()"]:::green
  c -- "Markdown" --> ai["AI"]:::blue`,
    AGENT_WORKFLOW: `
flowchart LR
  req["โจทย์ที่เราบอก"]:::muted --> think["AI คิดว่า<br/>ต้องใช้อะไรบ้าง"]:::blue
  think --> docs
  subgraph docs["AI ไปเปิด MineDocs เอง"]
    direction TB
    s1["ค้น Class ที่เกี่ยวข้อง"]:::red --> s2["เช็ก Method / Parameter"]:::yellow
    s2 --> s3["เช็กว่า Deprecated ไหม"]:::green
  end
  docs --> code["เขียนโค้ด"]:::blue
  code --> review["เรารีวิว"]:::muted`,
    FUTURE_LOOP: `
flowchart TB
  plan["AI วางแผนจากโจทย์"]:::blue --> docs["ค้น PaperMC API"]:::red
  docs --> code["เขียน Plugin"]:::green
  code --> build["Build + Test"]:::yellow
  build -- "ผ่าน" --> done["ส่งให้เรารีวิว"]:::green
  build -- "มี Error" --> fix["แก้โค้ด"]:::red
  fix --> build`,
  },
  en: {
    OVERVIEW: `
flowchart LR
  dev["Developer"]:::muted --> ai["AI Assistant<br/><small>Claude · Cursor · Codex</small>"]:::blue
  ai -- "MCP" --> md["MineDocs MCP"]:::red
  md --> jd["PaperMC Javadocs"]:::yellow
  jd -. "the real API docs" .-> ai`,
    CLASS_PIPELINE: `
flowchart LR
  a["fetchClassPage()"]:::red -- "HTML" --> b["parseClassPage()"]:::yellow
  b -- "parsed data" --> c["formatAsMarkdown()"]:::green
  c -- "Markdown" --> ai["AI"]:::blue`,
    AGENT_WORKFLOW: `
flowchart LR
  req["What we ask for"]:::muted --> think["AI works out<br/>what it needs"]:::blue
  think --> docs
  subgraph docs["AI opens MineDocs on its own"]
    direction TB
    s1["Find the right classes"]:::red --> s2["Check methods / params"]:::yellow
    s2 --> s3["Check for deprecations"]:::green
  end
  docs --> code["Writes the code"]:::blue
  code --> review["We review it"]:::muted`,
    FUTURE_LOOP: `
flowchart TB
  plan["AI plans from the request"]:::blue --> docs["Looks up PaperMC APIs"]:::red
  docs --> code["Writes the plugin"]:::green
  code --> build["Build + Test"]:::yellow
  build -- "passes" --> done["Hands it to us to review"]:::green
  build -- "errors" --> fix["Fixes the code"]:::red
  fix --> build`,
  },
}

/** Bold inline text */
export const b = (text: string) => <strong className="text-foreground">{text}</strong>
