# Coding Conventions

**Analysis Date:** 2026-03-29

## Style & Formatting

**Code Style:**
- Python follows PEP 8 conventions throughout
- No explicit formatter (black, ruff, autopep8) is configured in `pyproject.toml` or via standalone config files
- Line length appears to be kept under ~100 characters but no enforced limit is configured

**Formatting Tools:**
- None detected. No `.flake8`, `.pylintrc`, `ruff.toml`, `setup.cfg`, or `[tool.ruff]`/`[tool.black]` sections in `pyproject.toml`
- No pre-commit hooks (`.pre-commit-config.yaml` absent)

**Import Ordering:**
- Standard library imports first, then third-party, then relative imports
- Example from `src/ai_teacher/main.py`:
```python
import json
from pathlib import Path

from anthropic import Anthropic
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

from .parsers import parse_document
from .system_prompt import build_system_prompt
```
- Use this three-group ordering: stdlib, third-party packages, local relative imports
- Separate each group with a blank line

## Naming Conventions

**Files:**
- Python modules use `snake_case.py`: `main.py`, `system_prompt.py`, `parsers.py`
- HTML files use `snake_case.html` (though current names are single words): `index.html`, `chat.html`

**Functions:**
- Use `snake_case` for all functions: `build_system_prompt()`, `parse_document()`, `upload_file()`
- Async route handlers use short descriptive names: `index()`, `chat()`, `upload()`, `chat_page()`

**Variables:**
- Use `snake_case` for local variables and parameters: `source_text`, `content_type`, `mime_type`
- Use `UPPER_SNAKE_CASE` for module-level constants: `MAX_FILE_SIZE`, `ALLOWED_TYPES`, `STATIC_DIR`

**Types/Classes:**
- No custom classes are defined in this codebase (uses FastAPI/Pydantic built-ins)
- Follow `PascalCase` for any new classes

## Patterns in Use

**Application Structure:**
- Single FastAPI app instance created at module level in `src/ai_teacher/main.py`
- Route handlers are async functions decorated directly on the `app` instance
- No router/blueprint separation (all routes in `main.py`)
- Business logic extracted into separate modules (`parsers.py`, `system_prompt.py`)

**Module Organization:**
- Each module has a single clear responsibility:
  - `main.py`: FastAPI app, routes, streaming, file upload
  - `parsers.py`: Document parsing (PDF, DOCX, TXT)
  - `system_prompt.py`: AI prompt construction
- Relative imports within the package: `from .parsers import parse_document`

**Error Handling:**
- FastAPI `HTTPException` for all client-facing errors with appropriate status codes:
  - `400` for validation errors (missing messages, bad file type, file too large)
  - `422` for unprocessable content (empty extracted text)
  - `500` for internal errors (parsing failures)
- Exception chaining with `raise ... from e` pattern in `src/ai_teacher/main.py` line 96
- Streaming errors sent as SSE JSON events: `{"type": "error", "error": "..."}`
- `parsers.py` raises `ValueError` for unsupported types (caught by caller)

**Streaming Pattern:**
- Server-Sent Events (SSE) via FastAPI `StreamingResponse`
- Generator function `generate()` yields `data: {json}\n\n` formatted events
- Three event types: `delta` (text chunk), `done` (completion), `error` (failure)
- Anthropic SDK streaming via `client.messages.stream()` context manager

**Constants Pattern:**
- Module-level constants defined at top of file, after imports
- Used for configuration values: file size limits, allowed MIME types, paths
- Example from `src/ai_teacher/main.py`:
```python
STATIC_DIR = Path(__file__).resolve().parent.parent.parent / "static"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
}
```

**Match/Case Pattern:**
- Python 3.10+ structural pattern matching for dispatch in `src/ai_teacher/parsers.py`:
```python
match mime_type:
    case "application/pdf":
        ...
    case _:
        raise ValueError(...)
```

**Logging:**
- No logging framework is used. No `import logging` anywhere in the codebase
- Errors are communicated via HTTP responses or SSE events only

**Type Hints:**
- Used consistently on function signatures in Python code
- Parameter types: `content: bytes`, `mime_type: str`
- Return types: `-> str`
- Union types use `|` syntax (Python 3.10+): `topic: str | None = None`
- FastAPI dependency injection types: `file: UploadFile = File(...)`

## Frontend Conventions

**HTML Structure:**
- Two-page app: landing page (`static/index.html`) and chat page (`static/chat.html`)
- All HTML, CSS, and JavaScript in single self-contained HTML files (no build step)
- Semantic HTML5 with `<main>`, `<header>`, `<form>` elements

**CSS Approach:**
- Tailwind CSS via CDN (`https://cdn.tailwindcss.com`) -- no local install or config
- Utility-first classes directly on elements
- Custom CSS only for animations (bounce-dot keyframes in `static/chat.html`)
- No CSS files, no CSS modules, no preprocessors

**JavaScript Patterns:**
- Vanilla JS, no framework (no React, Vue, etc.)
- Inline `<script>` blocks at bottom of `<body>`
- DOM references cached at top via `document.getElementById()`:
```javascript
const messagesEl = document.getElementById('messages');
const chatInput = document.getElementById('chat-input');
```
- State managed as module-scoped variables: `let messages = []`, `let isStreaming = false`
- Event listeners attached via `addEventListener()` (no inline `onclick`)
- Async/await for fetch calls
- `sessionStorage` for cross-page data transfer (topic + document text)
- Feature detection pattern for optional browser APIs:
```javascript
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    voiceBtn.classList.remove('hidden');
}
```
- SSE parsing done manually via `ReadableStream` reader (not `EventSource`)
- ID generation via `crypto.randomUUID()`

**JavaScript Naming:**
- `camelCase` for variables and functions: `sendMessage`, `renderMessages`, `updateUI`
- `UPPER_SNAKE_CASE` for constants: `TTS_OFF`, `TTS_ON`
- DOM element variables suffixed with descriptive names: `messagesEl`, `chatInput`, `sendBtn`
- Section comments using `// -- Section --` format

---

*Convention analysis: 2026-03-29*
