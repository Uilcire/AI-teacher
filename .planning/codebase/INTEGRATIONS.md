# External Integrations

**Analysis Date:** 2026-03-29

## APIs & External Services

| Service | Purpose | Auth Method | Config Location |
|---------|---------|-------------|-----------------|
| Anthropic Claude API | AI chat responses (streaming) | API key via env var | `src/ai_teacher/main.py` line 21 |
| Tailwind CSS CDN | Frontend styling | None (public CDN) | `static/index.html`, `static/chat.html` |

### Anthropic Claude API

**Client initialization:** `src/ai_teacher/main.py` line 21
```python
client = Anthropic()  # reads ANTHROPIC_API_KEY from environment automatically
```

**Model used:** `claude-sonnet-4-20250514` (hardcoded at `src/ai_teacher/main.py` line 54)

**Usage pattern:** Streaming messages API via `client.messages.stream()`
- System prompt dynamically built from topic and source material (`src/ai_teacher/system_prompt.py`)
- Responses streamed as Server-Sent Events (SSE) back to the browser
- `max_tokens` set to 1024 per response

**Rate limiting:** Not implemented - raw API calls with no retry logic or rate limit handling

**Error handling:** Exceptions caught in the generator function and sent as SSE error events to the client (`src/ai_teacher/main.py` lines 63-65)

## Browser APIs (Client-Side)

| API | Purpose | Feature Detection | Location |
|-----|---------|-------------------|----------|
| Web Speech Recognition | Voice input from microphone | `SpeechRecognition` or `webkitSpeechRecognition` in `window` | `static/chat.html` lines 276-318 |
| Web Speech Synthesis | Text-to-speech for AI responses | `speechSynthesis` in `window` | `static/chat.html` lines 320-356 |
| Fetch + ReadableStream | SSE streaming from `/api/chat` | Always available (modern browsers) | `static/chat.html` lines 195-256 |

## Data Storage

**Databases:**
- None - no database integration detected

**File Storage:**
- Local filesystem only - static files served from `static/` directory
- Uploaded documents are processed in-memory and not persisted (`src/ai_teacher/main.py` lines 74-104)

**Caching:**
- None - no caching layer

**Session State:**
- Browser `sessionStorage` used to pass topic/sourceText between landing page and chat page
- No server-side session management
- All conversation history maintained in browser JavaScript memory only (lost on page refresh)

## Authentication & Identity

**Auth Provider:**
- None - no user authentication. The application is completely open.

## Monitoring & Observability

**Error Tracking:**
- None - errors are returned to the client as SSE events or HTTP error responses

**Logs:**
- Default FastAPI/uvicorn stdout logging only
- No structured logging framework

## CI/CD & Deployment

**Hosting:**
- Not configured - no deployment configuration files detected

**CI Pipeline:**
- None - no `.github/workflows/`, `Jenkinsfile`, or similar CI config

## Environment Variables

| Variable | Required | Purpose | Used By |
|----------|----------|---------|---------|
| `ANTHROPIC_API_KEY` | Yes | Authenticates with Anthropic Claude API | `anthropic.Anthropic()` client in `src/ai_teacher/main.py` |

**Secrets location:**
- `.env` file (gitignored) for local development
- No secrets manager or vault integration

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Data Flow

### Chat Request Flow

1. User enters topic/uploads document on landing page (`static/index.html`)
2. Session data (topic + extracted text) stored in `sessionStorage`, browser navigates to `/chat`
3. Chat page (`static/chat.html`) reads session, sends initial message to `/api/chat`
4. FastAPI endpoint (`src/ai_teacher/main.py` `/api/chat`) receives JSON body with `messages`, `sourceText`, `topic`
5. System prompt built dynamically from topic and source text (`src/ai_teacher/system_prompt.py`)
6. Anthropic streaming API called with full message history
7. Response streamed back as SSE (`text/event-stream`) with `{"type": "delta", "text": "..."}` chunks
8. Browser renders streamed text incrementally, optionally speaks it via TTS

### Document Upload Flow

1. User drops/selects a file (PDF, DOCX, or TXT, max 10MB) on landing page
2. File POSTed as multipart form data to `/api/upload`
3. `parse_document()` in `src/ai_teacher/parsers.py` extracts text based on MIME type:
   - PDF: `pymupdf` (`fitz.open()`) extracts text page by page
   - DOCX: `python-docx` (`Document()`) extracts paragraph text
   - TXT: Direct UTF-8 decode
4. Extracted text returned as JSON `{"text": "...", "filename": "..."}`
5. Text stored in browser memory and included in subsequent chat API calls as `sourceText`

---

*Integration audit: 2026-03-29*
