"use client";

import { Send, X, Bot } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { ButtonType } from "@/utils/enum/ButtonType";
import { Message } from "@/utils/interfaces/Message";
import { userController } from "@/state/controller/user";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";
import { ChatMessage } from "@/components/chatbot/ChatMessage";
import { getChatbotResponse } from "@/app/actions/chatbot/chatbot";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { FloatingButton } from "@/components/chatbot/FloatingButton";
import { BotTypingLoader } from "@/components/chatbot/BotTypingLoader";
import { ChatbotSchema } from "@/utils/validationSchemas/ChatbotSchema";

interface FormValues {
  message: string;
}

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "👋 Hi there! I’m your Todo Assistant. How can I help you today?",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { user } = userController.useState(["user"]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: yupResolver(ChatbotSchema),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onSubmit = async (data: FormValues) => {
    const messageText = data.message;
    if (!messageText) return;

    setMessages((prev) => [...prev, { sender: "user", text: messageText }]);
    reset();
    setIsLoading(true);
    setError(null);

    try {
      const {
        success,
        data: chatbotResponse,
        message,
      } = await getChatbotResponse(user?.id || "", messageText, 100);

      if (success) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: chatbotResponse || "" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: message || NOTIFY_MESSAGES.CHATBOT_RESPONSE_FAILED,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: NOTIFY_MESSAGES.SERVER_ERROR },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isSubmitting]);

  return (
    <>
      <FloatingButton onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className="fixed  bottom-22 max-md:right-2 md:right-6 w-[95vw] max-w-sm sm:max-w-md md:w-96 h-[70vh] sm:h-[80vh]  bg-gray-900 text-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-50">
          <div className="bg-gray-800 px-4 py-3 flex justify-between items-center border-b border-gray-700">
            <div className="flex flex-col ">
              <div className="flex items-center gap-2">
              <Bot size={20} />
              <h2 className="font-semibold text-lg">Todo Assistant</h2>
              </div>
              <p className="text-sm text-gray-400">
                Ask me anything about your todos
              </p>
            </div>
            <Button
              type={ButtonType.BUTTON}
              variant={ButtonVariant.TEXT}
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
              logo={<X size={18} />}
            />
          </div>

          <div className="relative flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 flex flex-col">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} sender={msg.sender} text={msg.text} />
            ))}

            {isLoading && <BotTypingLoader />}

            <div ref={messagesEndRef} />
          </div>

          {error && <div className="text-red-500 p-2">{error}</div>}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex p-3 border-t border-gray-700"
          >
            <Input
              type="text"
              {...register("message")}
              placeholder="Type your message..."
            />
            <Button
              type={ButtonType.SUBMIT}
              isDisable={isSubmitting || !isValid || isLoading}
              isLoading={isSubmitting || isLoading}
              className="ml-2 px-4 py-2 rounded-md flex items-center transition"
              logo={<Send size={18} />}
            />
          </form>

          {errors.message && (
            <p className="text-red-500 text-sm px-3 py-1">
              {errors.message.message}
            </p>
          )}
        </div>
      )}
    </>
  );
};
