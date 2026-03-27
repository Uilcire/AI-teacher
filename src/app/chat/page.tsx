"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";

export default function ChatPage() {
  const router = useRouter();
  const chat = useChat();
  const tts = useSpeechSynthesis();
  const initializedRef = useRef(false);
  const prevMessagesLenRef = useRef(0);

  const handleVoiceResult = useCallback(
    (transcript: string) => {
      if (transcript.trim()) {
        chat.sendMessage(transcript.trim());
      }
    },
    [chat]
  );

  const stt = useSpeechRecognition(handleVoiceResult);

  // Initialize from sessionStorage
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const stored = sessionStorage.getItem("ai-teacher-session");
    if (!stored) {
      router.push("/");
      return;
    }

    try {
      const { topic, sourceText } = JSON.parse(stored);
      sessionStorage.removeItem("ai-teacher-session");

      if (sourceText) {
        chat.setSourceMaterial(sourceText, topic || undefined);
      } else if (topic) {
        chat.setTopic(topic);
      }

      // Send initial message
      const initialMessage = sourceText
        ? topic
          ? `I've uploaded a document and I'd like to learn about: ${topic}`
          : "I've uploaded a document. Please help me understand it."
        : `I'd like to learn about: ${topic}`;

      // Small delay to ensure state is set
      setTimeout(() => {
        chat.sendMessage(initialMessage);
      }, 100);
    } catch {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-speak new assistant messages when TTS is enabled
  useEffect(() => {
    if (!tts.autoSpeak) return;
    if (chat.isStreaming) return;
    if (chat.messages.length <= prevMessagesLenRef.current) return;

    const lastMessage = chat.messages[chat.messages.length - 1];
    if (lastMessage?.role === "assistant" && lastMessage.content) {
      tts.speak(lastMessage.content);
    }

    prevMessagesLenRef.current = chat.messages.length;
  }, [chat.messages, chat.isStreaming, tts]);

  const handleToggleVoice = useCallback(() => {
    if (stt.isListening) {
      stt.stopListening();
    } else {
      stt.startListening();
    }
  }, [stt]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">AI Teacher</h1>
          {chat.topic && (
            <span className="text-sm text-gray-500 hidden sm:inline">
              — {chat.topic}
            </span>
          )}
        </div>
      </header>

      {/* Error banner */}
      {chat.error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-sm text-red-700">
          {chat.error}
        </div>
      )}

      {/* Chat area */}
      <ChatWindow messages={chat.messages} isStreaming={chat.isStreaming} />

      {/* Input */}
      <ChatInput
        onSend={chat.sendMessage}
        isStreaming={chat.isStreaming}
        onStopStreaming={chat.stopStreaming}
        isListening={stt.isListening}
        voiceSupported={stt.isSupported}
        onToggleVoice={handleToggleVoice}
        voiceTranscript={stt.transcript}
        autoSpeak={tts.autoSpeak}
        isSpeaking={tts.isSpeaking}
        ttsSupported={tts.isSupported}
        onToggleAutoSpeak={() => tts.setAutoSpeak(!tts.autoSpeak)}
        onStopSpeaking={tts.stop}
      />
    </div>
  );
}
