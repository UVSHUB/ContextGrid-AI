# ContextGrid AI 🧭

> **ContextGrid AI is like a GPS navigation system for software projects**—it maps out how all files in a codebase connect to each other and warns developers in real-time before a code change in one place secretly breaks something somewhere else.

---

## 🚗 The Everyday Analogy

Imagine you are planning roadworks on a busy street:

- **Without GPS / Traffic Mapping**: You block off a street for repairs without checking where traffic flows. Suddenly, three miles away, a major highway gets jammed because all the redirected cars are hitting a bottleneck you didn't anticipate.
- **With ContextGrid AI**: Before you dig up the street, a smart system flags a warning: *"If you close this lane, it will jam the highway off-ramp in 5 minutes. Redirect traffic through Route 4 instead."*

In software, **ContextGrid AI does the exact same thing for lines of code.**

---

## 🚨 The Real-World Problem We Are Solving

Today, millions of programmers use AI coding tools (like ChatGPT, GitHub Copilot, or Cursor) to generate code super fast. While these AI tools write single functions quickly, they are short-sighted:

1. **AI is Blind to the Bigger Picture**: An AI tool usually reads only the single file the developer is working on. It doesn't know how that file connects to the rest of the company's software.
2. **Silent Breakages**: A developer might use AI to rename a variable in a backend file. Everything looks fine locally, but that change secretly breaks the mobile app and the database login screen.
3. **Exhausting Code Reviews**: Senior engineers have to spend hours reviewing messy code changes, trying to manually trace whether a junior developer's AI-generated code broke another team's work.

---

## 📊 Complete Feature & Advanced Capabilities Matrix

| Feature / Capability | Core MVP | Advanced / Enterprise | Status | Value & Technical Depth |
| :--- | :---: | :---: | :---: | :--- |
| **Tree-sitter AST Parser** | ✅ | ✅ | ✅ **Live** | Multi-language symbol extraction (functions, imports, exports, calls) |
| **Neo4j Graph Mapping** | ✅ | ✅ | ✅ **Live** | Directed graph dependency paths with in-memory resilient fallback |
| **Sub-50ms IDE Guardrails** | ✅ | ✅ | ✅ **Live** | Real-time inline squiggles & diagnostic hovers in VS Code |
| **System Impact Score Engine** | ✅ | ✅ | ✅ **Live** | Mathematical blast-radius formula $S = \min(100, \sum \frac{N_i \cdot w}{i})$ |
| **Google Gemini AI Agent** | ✅ | ✅ | ✅ **Live** | Natural language 2-sentence impact warnings via `gemini-2.0-flash` |
| **React Flow 2D Web Portal** | ✅ | ✅ | ✅ **Live** | Interactive visual node canvas, risk hotspots, simulator & inspector |
| **Autonomous Self-Healing Patching** | ❌ | ✅ | ✅ **Live** | Gemini 2.0 Flash 1-click refactoring across dependent files (`patchAgent.ts`) |
| **AI Duplication Interceptor** | ❌ | ✅ | ✅ **Live** | Intercepts duplicate function creation before code bloat (`duplicationInterceptor.ts`) |
| **Blast-Radius CI/CD Optimizer** | ❌ | ✅ | ✅ **Live** | Cuts CI test times by up to 90% by running only affected test suites (`ciOptimizer.ts`) |
| **GitHub Visual PR Impact Digest** | ❌ | ✅ | ✅ **Live** | GitHub Action bot posting visual dependency maps in PR comments (`prBot.ts`) |
| **Architecture Drift Sentinel** | ❌ | ✅ | ✅ **Live** | Cypher & pattern rule engine enforcing architectural boundaries (`sentinel.ts`) |

---

## 💡 How ContextGrid AI Works (Step-by-Step)

```
[ Developer Types Code or Accepts AI Suggestion ]
                         │
                         ▼
       [ ContextGrid Scans the Connections ]
                         │
                         ▼
 [ Instant Friendly Warning Appears Inside the Editor ]
 "Warning: Changing this user setting will break the Login Page!"
```

- **Live System Mapping**: When a team connects a project to ContextGrid AI, it automatically creates a dynamic visual map showing how every file, function, and database query depends on one another using **Tree-sitter AST parsing** and **Neo4j graph storage**.
- **Real-Time Guardrails**: As a developer writes code (or asks an AI assistant to generate code), ContextGrid AI sits silently in the background streaming diffs over WebSockets.
- **Instant Early Warnings (Google Gemini API)**: If a change risks breaking another part of the system, ContextGrid AI pops up an immediate, friendly alert directly in the developer's code editor with a 2-sentence architectural risk summary before they save or commit.
- **Visual Portal**: Project leads get a clean visual flow chart powered by **Next.js 14 & React Flow** showing exactly which parts of the application were touched.

---

## 🏗️ Technical Monorepo Architecture

```
contextgrid-ai/
├── .github/workflows/          # GitHub Action automated PR impact audit workflow
├── apps/
│   ├── vscode-extension/      # VS Code Extension (TS + WebSockets + Auto-Fix Commands)
│   └── web-dashboard/         # Next.js 14 + Tailwind CSS + Self-Healing Patch Modal & Sentinel
└── services/
    ├── parser-engine/         # Python FastAPI + Tree-sitter AST & Neo4j Ingestion
    └── impact-server/         # Express + WebSockets + Gemini 2.0 Flash + Sentinel & Auto-Fix
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Node.js v18+
- Python 3.10+
- Docker (Optional: for local Neo4j container `docker run -d -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/password neo4j:latest`)
- `GEMINI_API_KEY` in `services/impact-server/.env`

### 2. Start Services

**Start Python Parser Engine:**
```bash
cd services/parser-engine
python3 -m uvicorn main:app --reload --port 8000
```

**Start Impact Control Server:**
```bash
cd services/impact-server
npm run dev
```

**Start Next.js Visual Map Dashboard:**
```bash
cd apps/web-dashboard
npm run dev
```
Open `http://localhost:3000` in your browser.
