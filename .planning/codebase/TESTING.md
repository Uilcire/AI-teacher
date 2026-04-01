# Testing Patterns

**Analysis Date:** 2026-03-29

## Test Infrastructure

**Runner:** Not configured
**Framework:** Not configured
**Coverage Tool:** Not configured

There is no test infrastructure in this project. No test framework (pytest, unittest), no test runner configuration, no coverage tooling, and no CI/CD pipeline.

**Missing entirely:**
- No `tests/` directory
- No `*test*.py` or `*spec*.py` files anywhere in the project
- No `pytest`, `unittest`, `nose`, or any test dependency in `pyproject.toml`
- No `pytest.ini`, `conftest.py`, `tox.ini`, `setup.cfg`, or `[tool.pytest]` configuration
- No CI/CD config files (`.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`)

## Test Coverage

**Current state: Zero test coverage.**

All modules are untested:
- `src/ai_teacher/main.py` - 4 route handlers, 0 tests
- `src/ai_teacher/parsers.py` - 1 function with 4 branches, 0 tests
- `src/ai_teacher/system_prompt.py` - 1 function with 3 branches, 0 tests
- `static/index.html` - Frontend JS untested
- `static/chat.html` - Frontend JS untested (SSE streaming, voice, TTS)

## Recommended Test Setup

When adding tests to this project, use the following setup.

**Install test dependencies:**

Add to `pyproject.toml`:
```toml
[project.optional-dependencies]
dev = [
    "pytest>=8.0",
    "pytest-asyncio>=0.23",
    "httpx>=0.27",  # For FastAPI TestClient async support
    "coverage>=7.0",
]
```

**Configuration in `pyproject.toml`:**
```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
asyncio_mode = "auto"

[tool.coverage.run]
source = ["src/ai_teacher"]
```

**Run Commands:**
```bash
pytest                       # Run all tests
pytest -v                    # Verbose output
pytest --cov=src/ai_teacher  # With coverage
pytest -x                    # Stop on first failure
```

## Recommended Test File Organization

**Location:** Separate `tests/` directory at project root (not co-located)

**Structure:**
```
tests/
├── conftest.py           # Shared fixtures (app client, mock Anthropic)
├── test_main.py          # Route handler tests
├── test_parsers.py       # Document parsing tests
└── test_system_prompt.py # Prompt construction tests
```

**Naming:**
- Test files: `test_{module}.py`
- Test functions: `test_{description}` using snake_case
- Fixtures: descriptive snake_case names

## Recommended Test Patterns

**FastAPI Route Testing:**
```python
import pytest
from httpx import ASGITransport, AsyncClient
from ai_teacher.main import app

@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac

async def test_index_returns_html(client):
    response = await client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
```

**Mocking the Anthropic Client:**
The `client` variable in `src/ai_teacher/main.py` is module-level. Mock it with `unittest.mock.patch`:
```python
from unittest.mock import patch, MagicMock

def test_chat_streams_response(client):
    mock_stream = MagicMock()
    mock_stream.__enter__ = MagicMock(return_value=mock_stream)
    mock_stream.__exit__ = MagicMock(return_value=False)
    mock_stream.text_stream = iter(["Hello", " world"])

    with patch("ai_teacher.main.client") as mock_client:
        mock_client.messages.stream.return_value = mock_stream
        # ... test streaming response
```

**Parser Unit Tests (pure functions, easy to test):**
```python
from ai_teacher.parsers import parse_document

def test_parse_plain_text():
    content = b"Hello, world!"
    result = parse_document(content, "text/plain")
    assert result == "Hello, world!"

def test_parse_unsupported_type_raises():
    with pytest.raises(ValueError, match="Unsupported file type"):
        parse_document(b"data", "image/png")
```

**System Prompt Tests (pure function, easy to test):**
```python
from ai_teacher.system_prompt import build_system_prompt

def test_base_prompt_without_topic_or_source():
    result = build_system_prompt()
    assert "Socratic teacher" in result
    assert "source_material" not in result

def test_prompt_includes_topic():
    result = build_system_prompt(topic="Quantum mechanics")
    assert "Quantum mechanics" in result

def test_prompt_includes_source_text():
    result = build_system_prompt(source_text="Some document content")
    assert "<source_material>" in result
    assert "Some document content" in result
```

## Priority Test Areas

**High priority (pure functions, easy wins):**
1. `src/ai_teacher/parsers.py` - `parse_document()` with all 4 match branches
2. `src/ai_teacher/system_prompt.py` - `build_system_prompt()` with all input combinations

**Medium priority (requires mocking):**
3. `src/ai_teacher/main.py` - `/api/upload` endpoint (file validation, size limits, type checks)
4. `src/ai_teacher/main.py` - `/api/chat` endpoint (SSE streaming, error handling)

**Low priority (simple route handlers):**
5. `src/ai_teacher/main.py` - `GET /` and `GET /chat` (just serve static files)

## Frontend Testing

No frontend test tooling exists. The frontend is vanilla JS embedded in HTML files, making it difficult to unit test without extraction. If frontend testing is needed:

- Extract JS logic into separate `.js` files in `static/`
- Use Playwright or Puppeteer for E2E testing of the full flow
- The chat SSE streaming flow and file upload flow are the highest-risk frontend paths

---

*Testing analysis: 2026-03-29*
