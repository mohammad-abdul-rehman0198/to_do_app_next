import remarkGfm from "remark-gfm";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Message } from "@/utils/interfaces/Message";

export const ChatMessage = ({ sender, text }: Message) => {
  const isUser = sender === "user";

  return (
    <div
      className={`flex items-start max-w-[75%] my-2 ${
        isUser ? "self-end flex-row-reverse" : "self-start"
      }`}
    >
      {/* Icon */}
      <div className="shrink-0">
        {isUser ? <User size={24} /> : <Bot size={24} />}
      </div>

      {/* Message bubble */}
      <div
        className={`ml-2 mr-2 p-3 rounded-xl shadow wrap-break-words prose prose-invert ${
          isUser
            ? "bg-[#88ab33] text-white rounded-br-none"
            : "bg-gray-800 text-gray-200 rounded-bl-none"
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </div>
    </div>
  );
};
