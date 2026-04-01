# Codebase Structure

**Analysis Date:** 2026-03-29

## Directory Layout

```
AI-teacher/
├── src/
│   └── ai_teacher/           # Python backend package
│       ├── __init__.py        # Empty package marker
│       ├── main.py            # FastAPI app, routes, entry point
│       ├── parsers.py         # Document text extraction (PDF, DOCX, TXT)
│       └── system_prompt.py   # Claude system prompt builder
├── static/                    # Frontend HTML files (served by FastAPI)
│   ├── index.html             # Landing page: topic input + document upload
│   └── chat.html              # Chat interface: streaming messages, voice, TTS
├── .planning/
│   └── codebase/              # Architecture/planning docs (this file)
├── pyproject.toml             # Project metadata, dependencies, build config
├── uv.lock                    # Dependency lockfile (uv package manager)
├── .gitignore                 # Git ignore rules
├── README.md                  # Project readme
└── .venv/                     # Python virtual environment (not committed)
```

## Directory Purposes

**`src/ai_teacher/`:**
- Purpose: All backend Python code
- Contains: FastAPI app, document parsers, prompt engineering
- Key files: `main.py` (entry point), `parsers.py`, `system_prompt.py`

**`static/`:**
- Purpose: Browser-facing HTML pages with inline CSS (Tailwind CDN) and inline JavaScript
- Contains: Two standalone HTML files, no build step, no JS bundling
- Key files: `index.html` (landing), `chat.html` (chat UI)

## Key File Locations

**Entry Points:**
- `src/ai_teacher/main.py`: FastAPI application object (`app`). Run with `uvicorn ai_teacher.main:app` or `fastapi dev src/ai_teacher/main.py`

**Configuration:**
- `pyproject.toml`: Dependencies, Python version requirement (>=3.11), build system (hatchling), package layout
- `.gitignore`: Ignores `.venv/`, `uv.lock`, `.env`, `__pycache__/`, etc.

**Core Logic:**
- `src/ai_teacher/main.py`: HTTP route handlers for `GET /`, `GET /chat`, `POST /api/chat`, `POST /api/upload`. Static file mounting.
- `src/ai_teacher/system_prompt.py`: `build_system_prompt(topic, source_text)` -- constructs the Socratic teacher system prompt
- `src/ai_teacher/parsers.py`: `parse_document(content, mime_type)` -- dispatches to PDF/DOCX/TXT extraction

**Frontend:**
- `static/index.html`: Landing page with topic textarea, file drag-and-drop upload, "Start Learning" button. Stores session data in `sessionStorage`.
- `static/chat.html`: Chat page with message rendering, SSE stream consumption, voice recognition (Web Speech API), text-to-speech (SpeechSynthesis API), stop/abort controls.

**Testing:**
- No test files exist. No test framework is configured.

## Module Responsibilities

| Module | Purpose | Key Exports |
|--------|---------|-------------|
| `src/ai_teacher/main.py` | FastAPI app, all HTTP routes, Anthropic client | `app` (FastAPI instance) |
| `src/ai_teacher/parsers.py` | Extract text from PDF, DOCX, TXT files | `parse_document(content, mime_type)` |
| `src/ai_teacher/system_prompt.py` | Build Claude system prompt with topic/source injection | `build_system_prompt(topic, source_text)` |
| `src/ai_teacher/__init__.py` | Package marker | (empty) |

## File Dependency Graph

```
main.py
├── imports from: parsers.py (parse_document)
├── imports from: system_prompt.py (build_system_prompt)
├── imports from: anthropic (Anthropic client)
├── imports from: fastapi (FastAPI, File, HTTPException, etc.)
└── serves: static/ directory

parsers.py
├── imports from: fitz (pymupdf) -- PDF parsing
└── imports from: docx (python-docx) -- DOCX parsing

system_prompt.py
└── (no internal imports -- pure function)
```

## Naming Conventions

**Files:**
- Python modules: `snake_case.py` (e.g., `system_prompt.py`, `parsers.py`)
- HTML files: `lowercase.html` (e.g., `index.html`, `chat.html`)

**Directories:**
- Python packages: `snake_case` (e.g., `ai_teacher`)
- Top-level dirs: `lowercase` (e.g., `static`, `src`)

## Where to Add New Code

**New API endpoint:**
- Add route handler to `src/ai_teacher/main.py`
- If it needs a new utility, create a new module in `src/ai_teacher/` and import it

**New document format parser:**
- Add a new `case` branch in `src/ai_teacher/parsers.py` `parse_document()` match statement
- Add the MIME type to `ALLOWED_TYPES` in `src/ai_teacher/main.py`
- Add any new parsing library to `pyproject.toml` dependencies

**New frontend page:**
- Create a new `.html` file in `static/`
- Add a `GET` route in `src/ai_teacher/main.py` to serve it via `FileResponse`

**New Python module:**
- Place in `src/ai_teacher/` following `snake_case.py` naming
- Import from `main.py` using relative imports (e.g., `from .new_module import func`)

**Shared utilities:**
- Create `src/ai_teacher/utils.py` (does not exist yet)

**Tests:**
- No test infrastructure exists. When adding tests, create a `tests/` directory at project root and configure a test runner in `pyproject.toml`.

## Special Directories

**`.venv/`:**
- Purpose: Python virtual environment with installed dependencies
- Generated: Yes (by `uv` or `python -m venv`)
- Committed: No (in `.gitignore`)

**`static/`:**
- Purpose: Served directly by FastAPI's `StaticFiles` middleware at `/static`
- Generated: No (hand-written HTML)
- Committed: Yes

**`.planning/`:**
- Purpose: Architecture and planning documentation
- Generated: Yes (by GSD mapping tools)
- Committed: Yes

---

*Structure analysis: 2026-03-29*
