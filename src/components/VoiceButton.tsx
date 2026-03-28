"use client";

interface VoiceButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onToggle: () => void;
}

export default function VoiceButton({
  isListening,
  isSupported,
  onToggle,
}: VoiceButtonProps) {
  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`p-2 rounded-full transition-colors ${
        isListening
          ? "bg-red-100 text-red-600 animate-pulse"
          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
      }`}
      title={isListening ? "Stop listening" : "Start voice input"}
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
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
    </button>
  );
}
