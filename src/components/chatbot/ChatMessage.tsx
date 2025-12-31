import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

import { Message } from "@/utils/interfaces/Message";

export const ChatMessage = ({ sender, text }: Message) => {
  return (
    <div
      className={`p-3 rounded-xl max-w-[75%] wrap-break-words shadow my-2 ${
        sender === "user"
          ? "bg-[#88ab33] text-white self-end rounded-br-none"
          : "bg-gray-800 text-gray-200 self-start rounded-bl-none"
      }`}
    >
      <div className="prose prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </div>
    </div>
  );
};
