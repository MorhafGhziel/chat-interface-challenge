"use client";

import Image from "next/image";
import { useState } from "react";
import axios from "axios";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInput() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setError(null);
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        messages: [...messages, userMessage],
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const assistantMessage = response.data.message;
      if (!assistantMessage?.content) {
        throw new Error("Invalid response from server");
      }

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to send message";
      const technicalError = error.response?.data?.technicalError;
      setError(
        technicalError
          ? `${errorMessage} (Technical details: ${technicalError})`
          : errorMessage
      );
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Messages Display */}
      <div className="flex-1 overflow-y-auto p-4 mb-20">
        <div className="max-w-4xl mx-auto space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 text-black rounded-bl-none"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border border-t-1 border-gray-200">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto flex items-center gap-2"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="w-full p-3 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500 transition"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Image
                src="/assets/icons/mic.svg"
                alt="mic"
                width={24}
                height={24}
              />
            </button>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Image
              src="/assets/icons/send.svg"
              alt="send"
              width={24}
              height={24}
            />
          </button>
        </form>
      </div>
    </>
  );
}
