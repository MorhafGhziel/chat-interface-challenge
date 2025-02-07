"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { getRandomSuggestions } from "@/constants";
import Suggestions from "./Suggestions";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: Error;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

type MessageType = "text" | "audio";
type MessageRole = "user" | "assistant";

interface Message {
  role: MessageRole;
  content: string;
  id: string;
  type: MessageType;
  audioUrl?: string;
  isVoiceMessage?: boolean;
  timestamp: string;
}

interface ApiErrorResponse {
  error: string;
  technicalError?: string;
  status: number;
}

interface ApiSuccessResponse {
  message: Message;
  status: number;
  error?: string;
}

export default function ChatInput() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");

        setInput(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setError("Speech recognition failed. Please try again.");
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    setCurrentSuggestions(getRandomSuggestions(3));
  }, [messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setError(null);
      setInput("");
      setIsVoiceInput(true);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setError(null);
  };

  const formatMessageTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageContent = input.trim().replace(/\s+/g, " ");

    // Clear input and stop voice immediately
    setInput("");
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    setIsVoiceInput(false);

    setError(null);
    const userMessage: Message = {
      role: "user",
      content: messageContent,
      id: Date.now().toString(),
      type: "text",
      isVoiceMessage: isVoiceInput,
      timestamp: formatMessageTime(new Date()),
    };

    inputRef.current?.focus();

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post<ApiSuccessResponse>("/api/chat", {
        messages: [...messages, userMessage],
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.message.content,
        id: Date.now().toString(),
        type: "text" as MessageType,
        timestamp: formatMessageTime(new Date()),
      };

      if (!assistantMessage?.content) {
        throw new Error("Invalid response from server");
      }

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiErrorResponse;
        const errorMessage = apiError.error || "Failed to send message";
        setError(
          apiError.technicalError
            ? `${errorMessage} (Technical details: ${apiError.technicalError})`
            : errorMessage
        );
      } else {
        setError(
          error instanceof Error ? error.message : "Failed to send message"
        );
      }

      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: suggestion.trim().replace(/\s+/g, " "),
      id: Date.now().toString(),
      type: "text",
      timestamp: formatMessageTime(new Date()),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post<ApiSuccessResponse>("/api/chat", {
        messages: [...messages, userMessage],
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.message.content,
        id: Date.now().toString(),
        type: "text" as MessageType,
        timestamp: formatMessageTime(new Date()),
      };

      if (!assistantMessage?.content) {
        throw new Error("Invalid response from server");
      }

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiErrorResponse;
        const errorMessage = apiError.error || "Failed to send message";
        setError(
          apiError.technicalError
            ? `${errorMessage} (Technical details: ${apiError.technicalError})`
            : errorMessage
        );
      } else {
        setError(
          error instanceof Error ? error.message : "Failed to send message"
        );
      }

      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)]">
      {/* Messages Display */}
      <div
        className={`h-[calc(100%-130px)] ${
          messages.length > 0 || error || isLoading
            ? "overflow-y-auto"
            : "overflow-hidden flex items-center justify-center"
        }`}
      >
        <div className="min-h-full w-full max-w-5xl mx-auto space-y-4 px-3 sm:px-6 py-4">
          <div className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded relative animate-fade-in text-sm">
                {error}
              </div>
            )}
            {messages.length === 0 && !error && !isLoading && (
              <div className="flex items-center justify-center">
                <div className="text-center text-gray-500 animate-fade-in">
                  <Image
                    src="/assets/icons/logo.svg"
                    alt="logo"
                    width={40}
                    height={40}
                    className="mx-auto mb-3 opacity-50"
                  />
                  <p className="text-base sm:text-xl">
                    Start a conversation by sending a message
                  </p>
                </div>
              </div>
            )}
          </div>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } animate-fade-in-up w-full mb-3`}
            >
              <div
                className={`flex flex-col gap-1 ${
                  message.role === "assistant"
                    ? "max-w-[90%] sm:max-w-[85%]"
                    : "max-w-[85%] sm:max-w-[70%]"
                }`}
              >
                <div
                  className={`inline-block rounded-2xl px-3 sm:px-4 py-2 transform transition-all duration-300 ease-out ${
                    message.role === "user"
                      ? "bg-blue-500 text-white rounded-br-none hover:bg-blue-600 ml-auto"
                      : "bg-gray-100 text-black rounded-bl-none hover:bg-gray-200"
                  }`}
                >
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    {message.isVoiceMessage && (
                      <div className="flex items-center gap-1 text-[10px] opacity-75">
                        <Image
                          src="/assets/icons/mic.svg"
                          alt="voice"
                          width={10}
                          height={10}
                          className={
                            message.role === "user" ? "invert" : "opacity-50"
                          }
                        />
                        voice message
                      </div>
                    )}
                    {message.type === "audio" ? (
                      <div className="flex items-center gap-2">
                        <audio
                          src={message.audioUrl}
                          controls
                          className="max-w-full"
                        />
                      </div>
                    ) : (
                      <div className="break-words whitespace-normal text-sm sm:text-base">
                        {message.content}
                      </div>
                    )}
                    <div
                      className={`text-[10px] ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      } text-left`}
                    >
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-gray-100 rounded-2xl px-4 py-2 rounded-bl-none">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Container for Suggestions and Input */}
      <div className="h-[130px] bg-white border-t border-gray-200">
        {/* Suggestions */}
        <Suggestions
          suggestions={currentSuggestions}
          onSuggestionClick={handleSuggestionClick}
          isLoading={isLoading}
        />

        {/* Input Form */}
        <div className="h-[76px] border-t border-gray-200 shadow-lg">
          <form
            onSubmit={handleSubmit}
            className="max-w-5xl mx-auto flex items-center justify-center gap-2 p-4 h-full"
          >
            <div className="flex-1 relative max-w-3xl">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder={
                  isListening ? "Listening..." : "Type your message..."
                }
                className="w-full p-3 pl-4 pr-12 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500 transition-all duration-200"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200 p-2 rounded-full ${
                  isListening
                    ? "bg-red-500 animate-pulse hover:bg-red-600"
                    : "hover:bg-gray-100"
                }`}
                disabled={isLoading}
              >
                <Image
                  src="/assets/icons/mic.svg"
                  alt={isListening ? "Stop listening" : "Start listening"}
                  width={24}
                  height={24}
                  className={`transition-all duration-200 ${
                    isListening
                      ? "invert brightness-200"
                      : "opacity-70 hover:opacity-100"
                  }`}
                />
              </button>
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading || isListening}
              className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Image
                src="/assets/icons/send.svg"
                alt="send"
                width={24}
                height={24}
                className={`transition-transform duration-200 ${
                  isLoading ? "rotate-90" : ""
                }`}
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
