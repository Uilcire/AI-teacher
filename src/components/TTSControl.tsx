"use client";

interface TTSControlProps {
  autoSpeak: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  onToggleAutoSpeak: () => void;
  onStop: () => void;
}

export default function TTSControl({
  autoSpeak,
  isSpeaking,
  isSupported,
  onToggleAutoSpeak,
  onStop,
}: TTSControlProps) {
  if (!isSupported) return null;

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onToggleAutoSpeak}
        className={`p-2 rounded-full transition-colors ${
          autoSpeak
            ? "bg-blue-100 text-blue-600"
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        }`}
        title={autoSpeak ? "Disable auto-read" : "Enable auto-read responses"}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {autoSpeak ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.8l4.2-3.15A.5.5 0 0111.5 6v12a.5.5 0 01-.8.4L6.5 15.2H4a1 1 0 01-1-1v-4.4a1 1 0 011-1h2.5z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          )}
        </svg>
      </button>

      {isSpeaking && (
        <button
          type="button"
          onClick={onStop}
          className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors"
          title="Stop speaking"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="6" y="6" width="12" height="12" rx="1" />
          </svg>
        </button>
      )}
    </div>
  );
}
