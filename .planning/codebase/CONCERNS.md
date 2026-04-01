# Concerns & Technical Debt

**Analysis Date:** 2026-03-29

## Security Concerns

| Concern | Severity | Location | Recommendation |
|---------|----------|----------|----------------|
| No request body size limit on `/api/chat` | High | `src/ai_teacher/main.py:37-71` | The chat endpoint reads `request.json()` with no size limit. A malicious client can send an arbitrarily large JSON payload (e.g., thousands of messages or a massive `sourceText` field) causing memory exhaustion. Add a content-length check or use a Pydantic model with `max_length` constraints. |
| Full exception messages leaked to client | High | `src/ai_teacher/main.py:63-65` | The SSE error handler sends `str(e)` directly to the client. Anthropic SDK exceptions may contain API keys, internal URLs, or stack details. Wrap exceptions and return generic error messages to the client; log the full exception server-side. |
| Internal exception details on upload failure | Medium | `src/ai_teacher/main.py:96` | `raise HTTPException(status_code=500, detail=str(e))` exposes parser internals (pymupdf/docx errors) to the client. Return a generic "Failed to parse document" message instead. |
| No CORS configuration | Medium | `src/ai_teacher/main.py:20` | FastAPI app has no CORS middleware. Currently only safe because it serves its own frontend. If the API is ever exposed separately, any origin can call it. Add explicit CORS policy. |
| No rate limiting | Medium | `src/ai_teacher/main.py:36,74` | Neither `/api/chat` nor `/api/upload` has rate limiting. Any client can flood the server with requests, each of which triggers an Anthropic API call (incurring cost). Add middleware-level rate limiting. |
| No authentication or session management | Medium | `src/ai_teacher/main.py` (entire file) | The API is fully open. Anyone with network access can make unlimited Anthropic API calls at the operator's expense. Add at minimum an API key, session token, or basic auth. |
| Content-type header trusted without validation | Low | `src/ai_teacher/main.py:86-91` | `file.content_type` is set by the client and can be spoofed. A malicious file with a fake content-type could be passed to the parser. Validate using file magic bytes (e.g., `python-magic`) instead of trusting the client header. |
| No input sanitization on `topic` or `sourceText` | Low | `src/ai_teacher/main.py:40-41`, `src/ai_teacher/system_prompt.py:21-29` | User-supplied `topic` and `sourceText` are injected directly into the system prompt. While this is the intended design for an LLM app, there is no filtering of prompt injection attempts. Consider adding a safety layer or disclaimer. |
| `ANTHROPIC_API_KEY` handling is implicit | Low | `src/ai_teacher/main.py:21` | `Anthropic()` reads the API key from `ANTHROPIC_API_KEY` env var automatically. No `.env.example` file documents this requirement. If the env var is missing, the app crashes on first request, not on startup. Add a startup check. |

## Technical Debt

| Item | Impact | Effort to Fix | Priority |
|------|--------|---------------|----------|
| Old Next.js codebase not cleaned from git | Medium | Low | High |
| No Pydantic request/response models | Medium | Low | High |
| All frontend code is inline in HTML files | Medium | Medium | Medium |
| No structured logging | Medium | Low | Medium |
| Hardcoded model name and max_tokens | Low | Low | Medium |
| No health check endpoint | Low | Low | Medium |
| Single-file application with no separation | Low | Medium | Low |

### Details

**Old Next.js codebase not cleaned from git:** Git status shows 24 deleted files from the previous Next.js implementation (`next.config.ts`, `package.json`, `tsconfig.json`, all `src/app/**`, `src/components/**`, `src/hooks/**`, `src/lib/**`, `src/types/**`). These deletions are unstaged, meaning the working tree has removed them but they still exist in the last commit. This needs to be committed to clean up the repo.

**No Pydantic request/response models:** The `/api/chat` endpoint manually destructures `request.json()` at `src/ai_teacher/main.py:38-41` instead of using Pydantic models. This means no automatic validation, no OpenAPI schema generation, and no type safety. Define `ChatRequest` and `UploadResponse` models.

**All frontend code is inline in HTML files:** `static/chat.html` is 399 lines with ~300 lines of inline JavaScript. `static/index.html` has ~85 lines of inline JS. No separation of HTML/CSS/JS, no bundler, no minification. As the frontend grows, this becomes unmaintainable. Extract JS into separate files.

**Hardcoded model name:** `claude-sonnet-4-20250514` is hardcoded at `src/ai_teacher/main.py:54`. Should be configurable via environment variable for easy upgrades.

**Hardcoded max_tokens:** `max_tokens=1024` at `src/ai_teacher/main.py:55` is relatively low for teaching responses. Should be configurable.

## Scalability Risks

### Current Bottlenecks

- **Single-process architecture:** The app runs as a single uvicorn process. Each streaming response holds an open connection and a thread for the Anthropic SDK's synchronous streaming (`client.messages.stream` at `src/ai_teacher/main.py:53`). Under load, this blocks the event loop since the synchronous generator in `generate()` (`src/ai_teacher/main.py:51-65`) runs in the main thread.
- **No connection pooling:** A new `Anthropic()` client is created once at module level (`src/ai_teacher/main.py:21`), which is fine, but the synchronous streaming API ties up a connection per request.
- **Full message history sent every request:** The client sends ALL previous messages on every `/api/chat` call (`static/chat.html:197-199`). For long conversations, this means increasingly large payloads and increasing Anthropic API token costs with no conversation pruning or summarization.
- **Source text sent on every request:** The `sourceText` (potentially a full document) is sent in every chat request body (`static/chat.html:204`). For a 10MB document, this means 10MB+ per message. This should be stored server-side.
- **No server-side state:** All conversation state lives in the browser (`static/chat.html:92-99`). Refreshing the page loses the entire conversation. Session storage is cleared immediately on chat page load (`static/chat.html:365`).

### What Breaks at 10x Scale

- Synchronous streaming blocks the async event loop; concurrent users will experience timeouts
- No worker pool configuration — need gunicorn with multiple uvicorn workers
- No caching of any kind — every interaction is a fresh API call
- File uploads are fully read into memory (`src/ai_teacher/main.py:79`) — 10 concurrent 10MB uploads = 100MB RAM
- No database means no conversation persistence, analytics, or user management

## Missing Infrastructure

### Monitoring & Observability
- **No logging framework:** No logging calls anywhere in the codebase. Errors in the SSE stream are silently caught and sent to the client. Server-side failures are invisible.
- **No error tracking:** No Sentry, no error aggregation, no alerting.
- **No request tracing:** No request IDs, no correlation between frontend errors and backend errors.
- **No metrics:** No request counts, response times, API costs, or error rates tracked.

### Deployment & Operations
- **No Dockerfile:** No containerization configuration.
- **No CI/CD:** No GitHub Actions, no test pipeline, no automated deployment.
- **No `Procfile`, `fly.toml`, `railway.json`, or any deployment config:** No defined deployment target.
- **No health check endpoint:** No `/health` or `/readiness` endpoint for load balancer probes.

### Testing
- **Zero tests:** No test files exist anywhere in the project. No test configuration in `pyproject.toml`. No test dependencies (pytest, httpx for testing FastAPI, etc.).
- **No test infrastructure:** No fixtures, no factories, no mocking patterns established.

### Documentation
- **README is a single line:** `README.md` contains only `# AI-teacher`. No setup instructions, no API docs, no architecture description.
- **No `.env.example`:** Required environment variables (`ANTHROPIC_API_KEY`) are undocumented.
- **No API documentation:** While FastAPI auto-generates OpenAPI docs, the lack of Pydantic models means the docs are incomplete.

### Configuration Management
- **No environment-based configuration:** Model name, max tokens, max file size, and allowed types are all hardcoded constants. No configuration file or env var overrides.
- **No startup validation:** The app doesn't check for required env vars on startup. Missing `ANTHROPIC_API_KEY` only fails on the first API call.

## Code Quality Issues

### Anti-patterns

- **Synchronous generator in async endpoint:** `src/ai_teacher/main.py:51-65` — The `generate()` function is a synchronous generator using `client.messages.stream()` (synchronous context manager). FastAPI/Starlette will run this in a threadpool, but it's better to use `AsyncAnthropic` with `async for` to avoid thread pool exhaustion.

- **File read before size check:** `src/ai_teacher/main.py:79-81` — The entire file is read into memory with `await file.read()` before the size check. A 1GB file will be fully loaded before being rejected. Use `file.size` or read in chunks with an early abort.

- **No resource cleanup in parsers:** `src/ai_teacher/parsers.py:10-11` — The `fitz.open()` document is closed manually but not in a `try/finally` or context manager. If `get_text()` throws, the file handle leaks. Use `with fitz.open(...) as doc:`.

- **Naive text encoding assumption:** `src/ai_teacher/parsers.py:18` — `content.decode("utf-8")` will crash on files with other encodings (latin-1, UTF-16, etc.). Add encoding detection with `chardet` or use `errors='replace'`.

- **Frontend re-renders all messages on every delta:** `static/chat.html:116-164` — `renderMessages()` removes and recreates ALL message DOM elements on every streaming delta (could be 50+ times per second). This causes layout thrashing. Only update the last message's content instead.

### Missing Patterns

- **No dependency injection:** The `Anthropic` client is a module-level global (`src/ai_teacher/main.py:21`). This makes testing impossible without monkeypatching. Use FastAPI dependency injection.
- **No middleware:** No request logging, no error handling middleware, no timing middleware.
- **No type hints on route handlers:** While Python type hints are used in `system_prompt.py` and `parsers.py`, the route handlers at `src/ai_teacher/main.py:37,75` lack proper request type annotations (using `Request` directly instead of Pydantic).

### Dead Code / Unused

- **24 old Next.js/TypeScript files in git:** Still tracked in git HEAD. Should be committed as deleted. Files: `next.config.ts`, `package.json`, `package-lock.json`, `postcss.config.mjs`, `tsconfig.json`, all files under `src/app/`, `src/components/`, `src/hooks/`, `src/lib/`, `src/types/`.
- **`__pycache__` not in `.gitignore`:** While `.gitignore` includes `__pycache__/`, the cached `.pyc` files exist locally — verify they're not accidentally committed.

## Recommendations

Ordered by priority (impact + effort balance):

1. **Commit the Next.js cleanup** (Priority: Immediate) — Stage all deleted Next.js files and commit. The repo is in an inconsistent state with deleted-but-tracked files.

2. **Add Pydantic request/response models** (Priority: High) — Define `ChatRequest`, `ChatMessage`, `UploadResponse` models in a new `src/ai_teacher/models.py`. Provides validation, OpenAPI docs, and type safety.

3. **Sanitize error messages** (Priority: High) — Never return `str(e)` to the client. Log full exceptions server-side, return generic messages to clients. Affects `src/ai_teacher/main.py:64` and `src/ai_teacher/main.py:96`.

4. **Switch to `AsyncAnthropic`** (Priority: High) — Replace `Anthropic()` with `AsyncAnthropic()` and use `async with client.messages.stream(...)` to avoid blocking the event loop. Affects `src/ai_teacher/main.py:21,53-58`.

5. **Add structured logging** (Priority: High) — Add Python `logging` or `structlog`. Log all requests, errors, and Anthropic API calls. This is the #1 operational gap.

6. **Add basic tests** (Priority: High) — Add `pytest` and `httpx` to dev dependencies. Write tests for `parsers.py` (pure functions, easy to test) and the API endpoints. Start with `tests/test_parsers.py` and `tests/test_api.py`.

7. **Add rate limiting and basic auth** (Priority: Medium) — At minimum, add a shared secret or API key to prevent unauthorized Anthropic API usage. Use `slowapi` or custom middleware for rate limiting.

8. **Make configuration externalized** (Priority: Medium) — Create a `src/ai_teacher/config.py` using Pydantic `BaseSettings` to load model name, max_tokens, max file size, and allowed types from env vars with sensible defaults.

9. **Fix file upload memory issue** (Priority: Medium) — Check file size before reading the full content at `src/ai_teacher/main.py:79`. Use chunked reading with size tracking.

10. **Add resource cleanup in parsers** (Priority: Medium) — Use context managers in `src/ai_teacher/parsers.py:10-11` for `fitz.open()`.

11. **Optimize frontend rendering** (Priority: Low) — In `static/chat.html:116-164`, only update the last message element during streaming instead of rebuilding the entire DOM.

12. **Store source text server-side** (Priority: Low) — Instead of sending the full document text with every chat request, store it in a server-side session or cache and reference by ID.

13. **Add Dockerfile and deployment config** (Priority: Low) — Containerize the app for reproducible deployment.

14. **Add `.env.example` and README** (Priority: Low) — Document `ANTHROPIC_API_KEY` requirement and setup steps.

---

*Concerns audit: 2026-03-29*
