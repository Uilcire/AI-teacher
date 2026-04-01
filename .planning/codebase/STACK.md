# Technology Stack

**Analysis Date:** 2026-03-29

## Languages

**Primary:**
- Python >=3.11 (currently running 3.12 based on `__pycache__` bytecode) - Backend API and all server-side logic

**Secondary:**
- HTML/CSS/JavaScript (vanilla) - Frontend UI in `static/index.html` and `static/chat.html`
- Tailwind CSS (CDN) - Styling via `https://cdn.tailwindcss.com` loaded in HTML files

## Runtime

**Environment:**
- CPython 3.12 (compiled bytecode in `src/ai_teacher/__pycache__/`)
- Requires >=3.11 (uses `match` statements and `str | None` union syntax)

**Package Manager:**
- uv (inferred from `uv.lock` in `.gitignore`)
- Lockfile: absent from repo (listed in `.gitignore`)

## Frameworks

**Core:**
- FastAPI >=0.115.0 - Web framework and API server (`src/ai_teacher/main.py`)
- Uvicorn >=0.34.0 - ASGI server (production runner)

**Testing:**
- Not detected - no test framework configured or test files present

**Build/Dev:**
- Hatchling - PEP 517 build backend (`pyproject.toml` `[build-system]`)
- Hatch - Build tool for wheel targets (`[tool.hatch.build.targets.wheel]`)

## Key Dependencies

**Critical:**
- `anthropic` >=0.42.0 - Claude AI API client; powers all AI chat responses (`src/ai_teacher/main.py`)
- `fastapi[standard]` >=0.115.0 - Full web framework including standard extras (Jinja2, python-multipart, etc.)

**Document Parsing:**
- `pymupdf` >=1.25.0 - PDF text extraction via `fitz` module (`src/ai_teacher/parsers.py`)
- `python-docx` >=1.1.0 - DOCX text extraction via `docx.Document` (`src/ai_teacher/parsers.py`)

**Infrastructure:**
- `python-multipart` >=0.0.18 - File upload handling for FastAPI's `UploadFile`
- `uvicorn` >=0.34.0 - ASGI server for running the FastAPI app

## Configuration

**Environment:**
- `ANTHROPIC_API_KEY` - Required by the `anthropic` SDK (auto-read from environment by `Anthropic()` client in `src/ai_teacher/main.py`)
- `.env` file listed in `.gitignore` - likely used for local development secrets

**Build:**
- `pyproject.toml` - Single project configuration file (PEP 621 metadata + Hatchling build config)
- No `setup.py`, `setup.cfg`, or `requirements.txt` - pure `pyproject.toml` project

**Application Constants (hardcoded in `src/ai_teacher/main.py`):**
- `MAX_FILE_SIZE` = 10MB (10 * 1024 * 1024)
- `ALLOWED_TYPES` = `application/pdf`, DOCX mime type, `text/plain`
- Model: `claude-sonnet-4-20250514` (hardcoded in streaming call)
- `max_tokens` = 1024

## Frontend Stack

**Approach:** Server-rendered static HTML with vanilla JavaScript (no build step, no bundler)

**CDN Dependencies:**
- Tailwind CSS via `https://cdn.tailwindcss.com` (development CDN, not production-optimized)

**Browser APIs Used:**
- `fetch` with `ReadableStream` for SSE streaming
- `SpeechRecognition` / `webkitSpeechRecognition` for voice input
- `SpeechSynthesis` for text-to-speech output
- `sessionStorage` for passing session data between pages
- `crypto.randomUUID()` for message IDs
- `AbortController` for cancelling in-flight requests

## Platform Requirements

**Development:**
- Python >=3.11
- uv package manager (recommended, based on `.gitignore`)
- `ANTHROPIC_API_KEY` environment variable

**Production:**
- Python >=3.11 with uvicorn
- No containerization config detected (no `Dockerfile`, `docker-compose.yml`)
- No CI/CD pipeline detected
- Run command: `uvicorn ai_teacher.main:app` (standard FastAPI pattern)

---

*Stack analysis: 2026-03-29*
