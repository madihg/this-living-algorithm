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

// Define the button options with image paths
const buttonOptions = [
  { text: "Tell me about AI", imagePath: "/button-images/button1.jpg" },
  { text: "Share an interesting fact", imagePath: "/button-images/button2.jpg" },
  { text: "Give me a coding tip", imagePath: "/button-images/button3.jpg" },
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
    <main className="flex flex-col items-center justify-between pb-40" style={{ fontFamily: "Times New Roman, serif", fontStyle: "italic" }}>
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
          <div className="flex flex-col items-center justify-center p-7 sm:p-10">
            {/* Replaced text with a placeholder image */}
            <Image
              src="/welcome-image.jpg"
              alt="Welcome"
              width={400}
              height={300}
              className="w-full max-w-md"
            />
          </div>
        </div>
      )}
      <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative w-full max-w-screen-md py-4 shadow-lg" 
          // Removed border class to remove text input border
        >
          {/* Hidden textarea to maintain form functionality */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="hidden"
          />
          
          {/* Buttons with images instead of text */}
          <div className="flex flex-wrap gap-5 justify-center">
            {buttonOptions.map((option, i) => (
              <button
                key={i}
                type="button"
                className={clsx(
                  "p-0 rounded-md transition-all overflow-hidden",
                  isLoading ? "cursor-not-allowed opacity-50" : "hover:opacity-90"
                )}
                onClick={() => handleButtonClick(option.text)}
                disabled={isLoading}
                aria-label={option.text}
              >
                <Image 
                  src={option.imagePath}
                  alt={option.text}
                  width={120}
                  height={80}
                  className="w-full h-auto"
                />
              </button>
            ))}
          </div>
        </form>
        {/* Removed the footer text */}
      </div>
    </main>
  );
}