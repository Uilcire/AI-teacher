"use client";

interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TopicInput({ value, onChange }: TopicInputProps) {
  return (
    <div>
      <label
        htmlFor="topic"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Topic or Text
      </label>
      <textarea
        id="topic"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter a topic to learn about (e.g., 'Quantum entanglement') or paste an essay, article, or any text you'd like to understand better..."
        className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
      />
    </div>
  );
}
