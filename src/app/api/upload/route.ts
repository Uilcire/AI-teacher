import { NextRequest } from "next/server";
import { parseDocument } from "@/lib/parsers";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        { error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const text = await parseDocument(buffer, file.type);

    if (!text.trim()) {
      return Response.json(
        { error: "Could not extract text from the file. It may be a scanned document." },
        { status: 422 }
      );
    }

    return Response.json({ text, filename: file.name });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process file";
    return Response.json({ error: message }, { status: 500 });
  }
}
