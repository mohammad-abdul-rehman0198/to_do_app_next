interface ChatMessageProps {
  sender: "user" | "bot";
  text: string;
}

export const ChatMessage = ({ sender, text }: ChatMessageProps) => {
  return (
    <div
      className={`p-3 rounded-xl max-w-[75%] wrap-break-words shadow ${
        sender === "user"
          ? "bg-[#88ab33] text-white self-end rounded-br-none"
          : "bg-gray-800 text-gray-200 self-start rounded-bl-none"
      }`}
    >
      {text}
    </div>
  );
};
