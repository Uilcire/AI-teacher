"use client";

import { useState, useCallback, FormEvent } from "react";
import VoiceButton from "./VoiceButton";
import TTSControl from "./TTSControl";

interface ChatInputProps {
  onSend: (message: string) => void;
  isStreaming: boolean;
  onStopStreaming: () => void;
  // Voice
  isListening: boolean;
  voiceSupported: boolean;
  onToggleVoice: () => void;
  voiceTranscript: string;
  // TTS
  autoSpeak: boolean;
  isSpeaking: boolean;
  ttsSupported: boolean;
  onToggleAutoSpeak: () => void;
  onStopSpeaking: () => void;
}

export default function ChatInput({
  onSend,
  isStreaming,
  onStopStreaming,
  isListening,
  voiceSupported,
  onToggleVoice,
  voiceTranscript,
  autoSpeak,
  isSpeaking,
  ttsSupported,
  onToggleAutoSpeak,
  onStopSpeaking,
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const displayValue = isListening ? voiceTranscript : input;

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const text = displayValue.trim();
      if (!text || isStreaming) return;
      onSend(text);
      setInput("");
    },
    [displayValue, isStreaming, onSend]
  );

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex items-center gap-1">
          <VoiceButton
            isListening={isListening}
            isSupported={voiceSupported}
            onToggle={onToggleVoice}
          />
          <TTSControl
            autoSpeak={autoSpeak}
            isSpeaking={isSpeaking}
            isSupported={ttsSupported}
            onToggleAutoSpeak={onToggleAutoSpeak}
            onStop={onStopSpeaking}
          />
        </div>

        <input
          type="text"
          value={displayValue}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isListening ? "Listening..." : "Type your message..."
          }
          disabled={isStreaming || isListening}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder-gray-400"
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={onStopStreaming}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!displayValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}
