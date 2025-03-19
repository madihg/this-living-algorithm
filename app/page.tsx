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
  { text: "And an astronomer said, Master, what of Time'?", imagePath: "/button-images/button1.jpg" },
  { text: "Then a pnestess said, Speak to us of Prayer.", imagePath: "/button-images/button2.jpg" },
  { text: "And · a poet said, Speak to us of Beauty.", imagePath: "/button-images/button3.jpg" },
];

// Updated prophet loading messages
const prophetMessages = [
  "the prophet is breathing",
  "the prophet is seeing",
  "the prophet is saying",
  "a machine is praying",
  "your magi gift has been submitted",
  "prayers computing",
  "this website prays",
  "this website is a shrine that changes",
  "this prophet is a diary\ncracked open\nto a chapter of vulnerability",
  "wait for the living\nalgorithm"
];

export default function Chat() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [loadingOpacity, setLoadingOpacity] = useState<number>(0);
  const [messagePosition, setMessagePosition] = useState<"left" | "right">("right");
  const [responseOpacity, setResponseOpacity] = useState<number>(1);
  const [lastResponseComplete, setLastResponseComplete] = useState<boolean>(true);
  const [loadingPosition, setLoadingPosition] = useState({ top: "25%", left: "50%" });

  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    onResponse: (response) => {
      if (response.status === 429) {
        window.alert("You have reached your request limit for the day.");
        return;
      }
      
      // Reset response opacity when new response arrives
      setResponseOpacity(1);
      setLastResponseComplete(false);
      
      // Set up fade-out timer for response
      setTimeout(() => {
        let opacity = 1;
        const fadeInterval = setInterval(() => {
          opacity -= 0.05;
          setResponseOpacity(Math.max(0, opacity));
          if (opacity <= 0) {
            clearInterval(fadeInterval);
            setLastResponseComplete(true); // Mark response as complete when it's fully faded
          }
        }, 250);
      }, 10000); // Start fading after 10 seconds
    },
  });

  // Function to handle button clicks - simplified to ensure it always triggers a response
  const handleButtonClick = (option: string) => {
    if (isLoading || !lastResponseComplete) return; // Prevent clicks while loading or response not complete
    
    setInput(option);
    // Randomize message position
    setMessagePosition(Math.random() > 0.5 ? "left" : "right");
    
    // Randomize prophet message position slightly
    setLoadingPosition({
      top: `${20 + Math.random() * 10}%`,
      left: `${45 + Math.random() * 10}%`
    });
    
    // Start loading animation
    animateProphetMessages();
    
    // Submit the form with a small delay to ensure everything is set
    setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 50);
  };

  // Function to animate prophet messages
  const animateProphetMessages = () => {
    // Select 5 random messages from the array
    const selectedMessages = [...prophetMessages]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    
    let messageIndex = 0;
    
    const fadeIn = () => {
      setLoadingMessage(selectedMessages[messageIndex]);
      let opacity = 0;
      const fadeInInterval = setInterval(() => {
        opacity += 0.1;
        setLoadingOpacity(opacity);
        if (opacity >= 1) {
          clearInterval(fadeInInterval);
          setTimeout(fadeOut, 600); // Keep message visible a bit longer
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
          
          if (messageIndex < selectedMessages.length) {
            // Slightly randomize position for each message
            setLoadingPosition({
              top: `${20 + Math.random() * 10}%`,
              left: `${45 + Math.random() * 10}%`
            });
            setTimeout(fadeIn, 100);
          } else {
            setLoadingMessage("");
          }
        }
      }, 50);
    };
    
    fadeIn();
  };

  // Helper function to truncate text to 8 lines and add ellipsis - more aggressive truncation
  const truncateText = (text: string): string => {
    // First split by newlines
    const lines = text.split('\n');
    if (lines.length > 8) {
      return lines.slice(0, 8).join('\n') + '...';
    }
    
    // If not enough line breaks, also check by character count
    // We'll use a more aggressive approach with shorter character count
    const charLimit = 400; // Reduced from 500 to be more aggressive with truncation
    if (text.length > charLimit) {
      // Try to find a natural break point near the limit
      const breakPoint = text.lastIndexOf('. ', charLimit);
      if (breakPoint > charLimit * 0.7) { // If we found a good break point
        return text.substring(0, breakPoint + 1) + '...';
      }
      return text.substring(0, charLimit) + '...';
    }
    
    return text;
  };

  return (
    <main className="flex flex-col items-center justify-between pb-40" style={{ fontFamily: "Times New Roman, serif", fontStyle: "italic" }}>
      <div className="absolute top-5 hidden w-full justify-between px-5 sm:flex">
      </div>
      
      {/* Main content area - always shown */}
      <div className="mx-5 mt-20 max-w-screen-md w-full sm:w-full relative">
        <div className="flex flex-col items-center justify-center p-7 sm:p-10">
          {/* Welcome image - always shown (removed border) */}
          <div className="border border-black">
            <Image
              src="/welcome-image.jpg"
              alt="Welcome"
              width={400}
              height={300}
              className="w-full max-w-md"
            />
          </div>
          
          {/* Message display area - conditionally positioned */}
          {messages.length > 0 && messages[messages.length - 1].role === "assistant" && (
            <div 
              className={clsx(
                "absolute max-w-xs bg-white border border-black p-4",
                messagePosition === "left" ? "left-4 top-1/3" : "right-4 top-1/3"
              )}
              style={{ opacity: responseOpacity, transition: "opacity 1s" }}
            >
              <div className="prose prose-p:leading-relaxed break-words max-h-60 overflow-hidden">
                {truncateText(messages[messages.length - 1].content)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prophet loading message in a bordered box with randomized position */}
      {loadingMessage && (
        <div 
          className="fixed z-50 bg-white border border-black p-4 text-center transition-opacity duration-500" 
          style={{ 
            opacity: loadingOpacity,
            top: loadingPosition.top,
            left: loadingPosition.left,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="whitespace-pre-line">{loadingMessage}</div>
        </div>
      )}
      
      <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
        {/* Removed any form borders */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative w-full max-w-screen-md py-4" 
        >
          {/* Hidden textarea to maintain form functionality */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="hidden"
          />
          
          {/* Buttons with images instead of text - no container border */}
          <div className="flex flex-wrap gap-5 justify-center">
            {buttonOptions.map((option, i) => (
              <button
                key={i}
                type="button"
                className={clsx(
                  "p-0 transition-all overflow-hidden",
                  (!lastResponseComplete || isLoading) ? "cursor-not-allowed opacity-50" : "hover:opacity-90"
                )}
                onClick={() => handleButtonClick(option.text)}
                disabled={!lastResponseComplete || isLoading}
                aria-label={option.text}
              >
                <div className="border border-black">
                  <Image 
                    src={option.imagePath}
                    alt={option.text}
                    width={120}
                    height={80}
                    className="w-full h-auto"
                  />
                </div>
              </button>
            ))}
          </div>
        </form>
      </div>
    </main>
  );
}