import io

import fitz  # pymupdf
from docx import Document


def parse_document(content: bytes, mime_type: str) -> str:
    match mime_type:
        case "application/pdf":
            doc = fitz.open(stream=content, filetype="pdf")
            text = "\n".join(page.get_text() for page in doc)
            doc.close()
            return text
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            doc = Document(io.BytesIO(content))
            return "\n".join(p.text for p in doc.paragraphs)
        case "text/plain":
            return content.decode("utf-8")
        case _:
            raise ValueError(f"Unsupported file type: {mime_type}")
