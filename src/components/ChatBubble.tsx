'use client';

interface ChatBubbleProps {
  onClick: () => void;
}

export default function ChatBubble({ onClick }: ChatBubbleProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-red-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A16E4B]/70 ring-offset-2 z-50"
      aria-label="Open help chat"
    >
      <img
        src="/Chat.gif"
        alt="Chatbot icon"
        className="w-10 h-10 rounded-full" // smaller so background shows
      />
    </button>
  );
}
