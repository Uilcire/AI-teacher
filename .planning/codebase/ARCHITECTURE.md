# Architecture

**Analysis Date:** 2026-03-29

## Pattern Overview

**Overall:** Server-rendered multi-page application with a JSON/SSE API backend

**Key Characteristics:**
- Two-page frontend (landing + chat) served as static HTML files
- Stateless HTTP API with Server-Sent Events (SSE) for streaming responses
- No database -- all session state lives in the browser (`sessionStorage` and in-memory JS variables)
- Direct integration with Anthropic Claude API via the official Python SDK
- Document parsing pipeline for PDF, DOCX, and TXT ingestion

## Layers

**HTTP/API Layer:**
- Purpose: Receives client requests, validates input, returns responses
- Location: `src/ai_teacher/main.py`
- Contains: FastAPI app instance, route handlers (`/`, `/chat`, `/api/chat`, `/api/upload`), static file mounting
- Depends on: `parsers`, `system_prompt`, `anthropic` SDK
- Used by: Browser frontend via `fetch()`

**Prompt Engineering Layer:**
- Purpose: Constructs the Claude system prompt based on topic and source material
- Location: `src/ai_teacher/system_prompt.py`
- Contains: `build_system_prompt()` function
- Depends on: Nothing (pure function)
- Used by: `main.py` chat handler

**Document Parsing Layer:**
- Purpose: Extracts plain text from uploaded documents
- Location: `src/ai_teacher/parsers.py`
- Contains: `parse_document()` function with format-specific handlers
- Depends on: `pymupdf` (fitz), `python-docx`
- Used by: `main.py` upload handler

**Frontend Layer:**
- Purpose: Landing page (topic entry + document upload) and chat interface
- Location: `static/index.html`, `static/chat.html`
- Contains: HTML, Tailwind CSS (via CDN), inline JavaScript
- Depends on: Backend API (`/api/chat`, `/api/upload`)
- Used by: End users via browser

## Data Flow

**Chat Request Flow:**

1. User types a message in `static/chat.html` and submits the form
2. JavaScript sends `POST /api/chat` with JSON body: `{ messages, sourceText, topic }`
3. `main.py:chat()` extracts messages, calls `build_system_prompt(topic, source_text)` to build the system prompt
4. Opens a streaming connection to Anthropic Claude API (`claude-sonnet-4-20250514`, max 1024 tokens)
5. Yields SSE events back to the client: `{"type": "delta", "text": "..."}` for each chunk
6. Client JavaScript reads the stream via `ReadableStream`, appending text to the assistant message bubble in real time
7. Final `{"type": "done"}` event signals stream completion
8. If TTS auto-speak is enabled, the completed response is passed to `SpeechSynthesis` API

**Document Upload Flow:**

1. User drops/selects a file on `static/index.html`
2. JavaScript sends `POST /api/upload` with `multipart/form-data`
3. `main.py:upload()` validates file size (10MB max) and MIME type
4. Calls `parsers.parse_document(content, content_type)` to extract text
5. Returns `{ text, filename }` as JSON
6. Client stores extracted text in a JS variable (`documentText`)
7. On "Start Learning", topic + documentText are written to `sessionStorage` and browser navigates to `/chat`

**Session Initialization Flow:**

1. `static/index.html` stores `{ topic, sourceText, documentName }` in `sessionStorage` on "Start Learning" click
2. Browser navigates to `/chat`
3. `static/chat.html` `init()` reads and immediately removes the `sessionStorage` item
4. Constructs an automatic first message (e.g., "I'd like to learn about: {topic}")
5. Calls `sendMessage()` to kick off the conversation

**State Management:**
- **Server side:** Fully stateless. No sessions, no database, no in-memory state between requests. The full conversation history is sent with every `/api/chat` request.
- **Client side:** `messages` array in JS memory holds the current conversation. `sourceText` and `topic` persist in JS variables for the lifetime of the chat page. `sessionStorage` is used only as a one-shot transfer mechanism between the two pages.

## Key Abstractions

**SSE Streaming Pattern:**
- Purpose: Delivers Claude's response incrementally to avoid long waits
- Examples: `src/ai_teacher/main.py` lines 51-65 (generator function), `static/chat.html` lines 213-239 (stream reader)
- Pattern: Python generator yields SSE-formatted strings; client reads via `ReadableStream` API and parses `data:` lines

**System Prompt Builder:**
- Purpose: Composes a Socratic teaching persona prompt with optional topic and source material injection
- Examples: `src/ai_teacher/system_prompt.py`
- Pattern: String concatenation with conditional sections. Source material is wrapped in `<source_material>` XML tags.

**Document Parser Dispatch:**
- Purpose: Routes document parsing to the correct handler based on MIME type
- Examples: `src/ai_teacher/parsers.py`
- Pattern: Python `match/case` on MIME type string. Each case uses the appropriate library (pymupdf for PDF, python-docx for DOCX, decode for TXT).

## Entry Points

**Web Server:**
- Location: `src/ai_teacher/main.py` (`app = FastAPI()`)
- Triggers: `uvicorn ai_teacher.main:app` (or `fastapi dev src/ai_teacher/main.py`)
- Responsibilities: Serves static files, handles API requests, proxies to Claude API

**Landing Page:**
- Location: `static/index.html`
- Triggers: `GET /`
- Responsibilities: Topic input, document upload, session bootstrapping

**Chat Page:**
- Location: `static/chat.html`
- Triggers: `GET /chat`
- Responsibilities: Chat UI, message streaming, voice input/output

## Error Handling

**Strategy:** Errors surface to the user via UI banners; no retry logic.

**Patterns:**
- API routes raise `HTTPException` with descriptive messages for validation failures (400), parsing failures (500), and empty-content documents (422)
- The SSE stream catches exceptions during Claude API calls and yields an `{"type": "error", "error": "..."}` event instead of crashing
- Client-side `sendMessage()` catches fetch/stream errors, displays them in the `#error-banner` element, and removes the empty assistant message placeholder
- `AbortController` allows the user to cancel an in-flight streaming response via the "Stop" button

## Cross-Cutting Concerns

**Logging:** None. No logging framework is configured. Errors in the SSE stream are serialized to the client but not logged server-side.

**Validation:**
- File upload: size limit (10MB), MIME type allowlist, non-empty text check
- Chat: requires non-empty `messages` array
- No request body schema validation (uses raw `request.json()` instead of Pydantic models)

**Authentication:** None. The application has no auth layer. Anyone with access to the server can use it.

**CORS:** Not configured. The app serves its own frontend, so same-origin requests work by default.

---

*Architecture analysis: 2026-03-29*
