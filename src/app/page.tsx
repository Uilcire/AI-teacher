"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopicInput from "@/components/TopicInput";
import DocumentUpload from "@/components/DocumentUpload";

export default function Home() {
  const router = useRouter();
  const [topicText, setTopicText] = useState("");
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);

  const canStart = topicText.trim() || documentText;

  const handleStart = () => {
    if (!canStart) return;

    sessionStorage.setItem(
      "ai-teacher-session",
      JSON.stringify({
        topic: topicText.trim() || undefined,
        sourceText: documentText || undefined,
        documentName: documentName || undefined,
      })
    );

    router.push("/chat");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            AI Teacher
          </h1>
          <p className="text-lg text-gray-600">
            Enter a topic or upload a document, and your AI teacher will guide
            you through an interactive learning conversation.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <TopicInput value={topicText} onChange={setTopicText} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-gray-500">
                and / or
              </span>
            </div>
          </div>

          <DocumentUpload
            onTextExtracted={(text, filename) => {
              setDocumentText(text);
              setDocumentName(filename);
            }}
          />

          <button
            onClick={handleStart}
            disabled={!canStart}
            className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Start Learning
          </button>
        </div>
      </div>
    </main>
  );
}
