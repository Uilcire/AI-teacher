import { NextRequest } from "next/server";
import anthropic from "@/lib/anthropic";
import { buildSystemPrompt } from "@/lib/systemPrompt";
import type { ChatRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { messages, sourceText, topic } =
      (await request.json()) as ChatRequest;

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const systemPrompt = buildSystemPrompt(topic, sourceText);

    const anthropicMessages = messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        stream.on("text", (text) => {
          const data = JSON.stringify({ type: "delta", text });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        });

        stream.on("end", () => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
          );
          controller.close();
        });

        stream.on("error", (error) => {
          const data = JSON.stringify({
            type: "error",
            error: error.message || "Stream error",
          });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          controller.close();
        });
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
