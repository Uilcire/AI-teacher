import json
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

from anthropic import Anthropic
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

from .parsers import parse_document
from .system_prompt import build_system_prompt

STATIC_DIR = Path(__file__).resolve().parent.parent.parent / "static"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
}

app = FastAPI()
client = Anthropic()

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/", response_class=HTMLResponse)
async def index():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/chat", response_class=HTMLResponse)
async def chat_page():
    return FileResponse(STATIC_DIR / "chat.html")


@app.post("/api/chat")
async def chat(request: Request):
    body = await request.json()
    messages = body.get("messages", [])
    source_text = body.get("sourceText")
    topic = body.get("topic")

    if not messages:
        raise HTTPException(status_code=400, detail="Messages are required")

    system_prompt = build_system_prompt(topic, source_text)
    anthropic_messages = [
        {"role": m["role"], "content": m["content"]} for m in messages
    ]

    def generate():
        try:
            with client.messages.stream(
                model="claude-sonnet-4-20250514",
                max_tokens=1024,
                system=system_prompt,
                messages=anthropic_messages,
            ) as stream:
                for text in stream.text_stream:
                    data = json.dumps({"type": "delta", "text": text})
                    yield f"data: {data}\n\n"
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
        except Exception as e:
            data = json.dumps({"type": "error", "error": str(e)})
            yield f"data: {data}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )


@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    content = await file.read()

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400, detail="File too large. Maximum size is 10MB."
        )

    content_type = file.content_type or ""
    if content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload a PDF, DOCX, or TXT file.",
        )

    try:
        text = parse_document(content, content_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

    if not text.strip():
        raise HTTPException(
            status_code=422,
            detail="Could not extract text from the file. It may be a scanned document.",
        )

    return {"text": text, "filename": file.filename}
