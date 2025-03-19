"use client";

import { useRef, useState, useEffect } from "react";
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

// Prophet loading messages
const prophetMessages = [
  "the prophet is breathing",
  "the prophet is seeing",
  "the prophet is saying"
];

export default function Chat() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [loadingOpacity, setLoadingOpacity] = useState<number>(0);
  const [messagePosition, setMessagePosition] = useState<"left" | "right">("right");

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
    // Randomize message position
    setMessagePosition(Math.random() > 0.5 ? "left" : "right");
    // Start loading animation
    animateProphetMessages();
    // Use the existing form submission
    formRef.current?.requestSubmit();
  };

  // Function to animate prophet messages
  const animateProphetMessages = () => {
    let messageIndex = 0;
    let totalDuration = 0;
    const intervalTime = 2000; // Time for each message (total 6 seconds for 3 messages)
    
    // Clear any existing interval
    const fadeIn = () => {
      setLoadingMessage(prophetMessages[messageIndex]);
      let opacity = 0;
      const fadeInInterval = setInterval(() => {
        opacity += 0.1;
        setLoadingOpacity(opacity);
        if (opacity >= 1) {
          clearInterval(fadeInInterval);
          setTimeout(fadeOut, 500); // Wait a bit before fading out
        }
      }, 50);
    };
    
    const fadeOut = () => {
      let opacity = 1;
      const fadeOutInterval = setInterval(() => {
        opacity -= 0.1;
        setLoadingOpacity(opacity);
        if (opacity <= 0) {
          clearInterval(fadeOutInterval);
          messageIndex++;
          totalDuration += intervalTime;
          
          if (messageIndex < prophetMessages.length && totalDuration < 7000) {
            fadeIn();
          } else {
            setLoadingMessage("");
          }
        }
      }, 50);
    };
    
    fadeIn();
  };

  return (
    <main className="flex flex-col items-center justify-between pb-40" style={{ fontFamily: "Times New Roman, serif", fontStyle: "italic" }}>
      <div className="absolute top-5 hidden w-full justify-between px-5 sm:flex">
      </div>
      
      {/* Main content area - always shown */}
      <div className="mx-5 mt-20 max-w-screen-md rounded-md border border-gray-200 w-full sm:w-full relative">
        <div className="flex flex-col items-center justify-center p-7 sm:p-10">
          {/* Welcome image - always shown */}
          <Image
            src="/welcome-image.jpg"
            alt="Welcome"
            width={400}
            height={300}
            className="w-full max-w-md border border-black"
          />
          
          {/* Message display area - conditionally positioned */}
          {messages.length > 0 && messages[messages.length - 1].role === "assistant" && (
            <div 
              className={clsx(
                "absolute max-w-xs rounded-md border border-gray-200 bg-gray-100 p-4 shadow-md",
                messagePosition === "left" ? "left-4 top-1/3" : "right-4 top-1/3"
              )}
            >
              <div className="prose prose-p:leading-relaxed break-words">
                {messages[messages.length - 1].content}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading message */}
      <div 
        className="mt-8 text-center text-lg transition-opacity duration-500" 
        style={{ opacity: loadingOpacity }}
      >
        {loadingMessage}
      </div>
      
      <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative w-full max-w-screen-md py-4 shadow-lg" 
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
                  isLoading ? "cursor-not-allowed opacity-50" : "hover:opacity-90",
                  "border border-black" // Added thin black border
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
      </div>
    </main>
  );
}