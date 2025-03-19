"use client";

import { useRef } from "react";
import { useChat } from "ai/react";
import clsx from "clsx";
import {
  VercelIcon,
  GithubIcon,
  LoadingCircle,
  SendIcon,
  UserIcon,
} from "./icons";
import Textarea from "react-textarea-autosize";
import Image from "next/image";

// Define the button options
const buttonOptions = [
  "Tell me about AI",
  "Share an interesting fact",
  "Give me a coding tip",
];

export default function Chat() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    onResponse: (response) => {
      if (response.status === 429) {
        window.alert("You have reached your request limit for the day.");
        return;
      }
    },
  });

  const disabled = isLoading;

  // Function to handle button clicks
  const handleButtonClick = (option: string) => {
    setInput(option);
    // Use the existing form submission
    formRef.current?.requestSubmit();
  };

  return (
    <main className="flex flex-col items-center justify-between pb-40">
      <div className="absolute top-5 hidden w-full justify-between px-5 sm:flex">
      </div>
      {messages.length > 0 ? (
        messages.map((message, i) => (
          <div
            key={i}
            className={clsx(
              "flex w-full items-center justify-center border-b border-gray-200 py-8",
              message.role === "user" ? "bg-white" : "bg-gray-100",
            )}
          >
            <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
              <div
                className={clsx(
                  message.role === "assistant"
                    ? "bg-white"
                    : "bg-black p-1.5 text-white",
                )}
              >
                {message.role === "user" ? (
                  <UserIcon />
                ) : (
                  <Image
                    src="/sample-image.png"
                    alt="sample-image"
                    width={36}
                    height={36}
                  />
                )}
              </div>
              <div className="prose prose-p:leading-relaxed mt-1 w-full break-words">
                {message.content}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="border-gray-200sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border sm:w-full">
          <div className="flex flex-col space-y-4 p-7 sm:p-10">
            <Image
              src="/sample-image.png"
              alt="sample-image"
              width={40}
              height={40}
              className="h-20 w-20"
            />
            <h1 className="text-lg font-semibold text-black">
              Hi, I'm a fine tuned LLM.
            </h1>
            <p className="text-gray-500">
              I'm part of a series of computational experiments taught by{" "}
              <a
                href="https://linkin.bio/yallahalim/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4 transition-colors hover:text-black"
              >
                Halim Madi
              </a>. I was built using{" "}
              <a
                href="https://openai.com/blog/gpt-3-5-turbo-fine-tuning-and-api-updates"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4 transition-colors hover:text-black"
              >
                fine-tuned GPT4.
              </a>
            </p>
          </div>
          <div className="flex flex-col space-y-4 border-t border-gray-200 bg-gray-50 p-7 sm:p-10">
            {buttonOptions.map((option, i) => (
              <button
                key={i}
                className="rounded-md border border-gray-200 bg-white px-5 py-3 text-left text-sm text-gray-500 transition-all duration-75 hover:border-black hover:text-gray-700 active:bg-gray-50"
                onClick={() => handleButtonClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-lg"
        >
          {/* Hidden textarea to maintain form functionality */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="hidden"
          />
          
          {/* Buttons instead of visible input */}
          <div className="flex flex-wrap gap-3 justify-center">
            {buttonOptions.map((option, i) => (
              <button
                key={i}
                type="button"
                className={clsx(
                  "px-4 py-3 rounded-md font-medium transition-all",
                  isLoading
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : "bg-green-500 text-white hover:bg-green-600",
                )}
                onClick={() => handleButtonClick(option)}
                disabled={isLoading}
              >
                {option}
              </button>
            ))}
          </div>
        </form>
        <p className="text-center text-xs text-gray-400">
          Built with{" "}
          <a
            href="https://sdk.vercel.ai/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            Vercel AI SDK
          </a>
          ,{" "}
          <a
            href="https://openai.com/blog/gpt-3-5-turbo-fine-tuning-and-api-updates"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            OpenAI GPT-3.5-turbo, as part of a course taught by
          </a>{" "}
          Halim Madi.{" "}
          <a
            href="https://linkin.bio/yallahalim/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            Learn to build your own
          </a>
          .
        </p>
      </div>
    </main>
  );
}