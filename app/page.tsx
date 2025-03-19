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

// Define the subjects from The Prophet
const prophetSubjects = [
  "Love",
  "Marriage",
  "Children",
  "Giving",
  "Eating and Drinking",
  "Work",
  "Joy and Sorrow",
  "Houses",
  "Clothes",
  "Buying and Selling",
  "Crime and Punishment",
  "Laws",
  "Freedom",
  "Reason and Passion",
  "Pain",
  "Self-Knowledge",
  "Teaching",
  "Friendship",
  "Talking",
  "Time",
  "Good and Evil",
  "Prayer",
  "Pleasure",
  "Beauty",
  "Religion",
  "Death"
];

// Updated prophet loading messages - last message is fixed as requested
const prophetMessages = [
  "the prophet is breathing",
  "the prophet is seeing",
  "the prophet is saying",
  "a machine is praying",
  "prayers computing",
  "this website prays",
  "this website is a shrine that changes",
  "this prophet is a diary\ncracked open\nto a chapter of vulnerability",
  "wait for the living\nalgorithm",
  "your magi gift has been submitted" // This will always be the last message
];

// ASCII art for the background
const leftTempleAscii = `
     /\\
    /  \\
   /____\\
  /|    |\\
 / |    | \\
/__|____|__\\
   /|  |\\
  / |  | \\
 /__|__|__\\
    |  |
    |  |
    |__|
    
  ∞ ◯ ∞
  
  ☥ △ ☥
  * * *
`;

const rightSunAscii = `
     \\|/
    - O -
     /|\\
   * * * *
  *   |   *
 *    |    *
*_____|_____*
      |
      |
      ◯
    ☽ ☼ ☾
    
    ∞∞∞∞∞
    * * *
`;

export default function Chat() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [loadingOpacity, setLoadingOpacity] = useState<number>(0);
  const [messagePosition, setMessagePosition] = useState<"left" | "right">("right");
  const [responseOpacity, setResponseOpacity] = useState<number>(1);
  const [lastResponseComplete, setLastResponseComplete] = useState<boolean>(true);
  const [showResetButton, setShowResetButton] = useState<boolean>(false);
  const [randomizedButtons, setRandomizedButtons] = useState([
    { text: `And then Almitra said, speak to us of ${prophetSubjects[Math.floor(Math.random() * prophetSubjects.length)]}`, imagePath: "/button-images/button1.jpg" },
    { text: `And then Almitra said, speak to us of ${prophetSubjects[Math.floor(Math.random() * prophetSubjects.length)]}`, imagePath: "/button-images/button2.jpg" },
    { text: `And then Almitra said, speak to us of ${prophetSubjects[Math.floor(Math.random() * prophetSubjects.length)]}`, imagePath: "/button-images/button3.jpg" },
  ]);

  const { messages: chatMessages, input, setInput, handleSubmit, isLoading } = useChat({
    onResponse: (response) => {
      if (response.status === 429) {
        window.alert("You have reached your request limit for the day.");
        return;
      }
      
      // Reset response opacity when new response arrives
      setResponseOpacity(1);
      setLastResponseComplete(false);
      setShowResetButton(false);
      
      // Set up fade-out timer for response
      setTimeout(() => {
        let opacity = 1;
        const fadeInterval = setInterval(() => {
          opacity -= 0.05;
          setResponseOpacity(Math.max(0, opacity));
          if (opacity <= 0) {
            clearInterval(fadeInterval);
            // Force a delay before enabling buttons to ensure state updates properly
            setTimeout(() => {
              setLastResponseComplete(true); // Mark response as complete when it's fully faded
              setShowResetButton(true); // Show reset button when response fades
            }, 100);
          }
        }, 250);
      }, 10000); // Start fading after 10 seconds
    },
  });
  
  // Add an effect to track response opacity and update button state
  useEffect(() => {
    if (responseOpacity <= 0) {
      setLastResponseComplete(true);
      setShowResetButton(true);
    }
  }, [responseOpacity]);
  
  // Debug helper to log state changes
  useEffect(() => {
    console.log("Response state changed:", { responseOpacity, lastResponseComplete, isLoading, showResetButton });
  }, [responseOpacity, lastResponseComplete, isLoading, showResetButton]);
  
  // Function to reset the interaction state
  const handleReset = () => {
    setRandomizedButtons([
      { text: `And then Almitra said, speak to us of ${prophetSubjects[Math.floor(Math.random() * prophetSubjects.length)]}`, imagePath: "/button-images/button1.jpg" },
      { text: `And then Almitra said, speak to us of ${prophetSubjects[Math.floor(Math.random() * prophetSubjects.length)]}`, imagePath: "/button-images/button2.jpg" },
      { text: `And then Almitra said, speak to us of ${prophetSubjects[Math.floor(Math.random() * prophetSubjects.length)]}`, imagePath: "/button-images/button3.jpg" },
    ]);
    setLastResponseComplete(true);
    setShowResetButton(false);
  };
  
  // Function to handle button clicks - simplified to ensure it always triggers a response
  const handleButtonClick = (option: string) => {
    if (isLoading || !lastResponseComplete) return; // Prevent clicks while loading or response not complete
    
    setInput(option);
    // Randomize message position
    setMessagePosition(Math.random() > 0.5 ? "left" : "right");
    
    // Start loading animation
    animateProphetMessages();
    
    // Hide reset button when starting new interaction
    setShowResetButton(false);
    
    // Submit the form with a small delay to ensure everything is set
    setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 50);
  };

  // Function to animate prophet messages at the top of the page
  const animateProphetMessages = () => {
    // Select 4 random messages from the array (excluding the last one)
    const selectedMessages = [...prophetMessages.slice(0, -1)]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
    
    // Add the fixed last message
    selectedMessages.push(prophetMessages[prophetMessages.length - 1]);
    
    let messageIndex = 0;
    
    const fadeIn = () => {
      setLoadingMessage(selectedMessages[messageIndex]);
      let opacity = 0;
      const fadeInInterval = setInterval(() => {
        opacity += 0.05;
        setLoadingOpacity(opacity);
        if (opacity >= 1) {
          clearInterval(fadeInInterval);
          setTimeout(fadeOut, 800); // Keep message visible a bit longer
        }
      }, 100); // Slower fade in
    };
    
    const fadeOut = () => {
      let opacity = 1;
      const fadeOutInterval = setInterval(() => {
        opacity -= 0.05;
        setLoadingOpacity(opacity);
        if (opacity <= 0) {
          clearInterval(fadeOutInterval);
          messageIndex++;
          
          if (messageIndex < selectedMessages.length) {
            setTimeout(fadeIn, 150);
          } else {
            setLoadingMessage("");
          }
        }
      }, 100); // Slower fade out
    };
    
    fadeIn();
  };

  // Helper function to truncate text to 8 lines and add ellipsis
  const truncateText = (text: string): string => {
    // First split by newlines
    const lines = text.split('\n');
    if (lines.length > 8) {
      return lines.slice(0, 8).join('\n') + '...';
    }
    
    // If not enough line breaks, also check by character count
    // We'll use a more aggressive approach with shorter character count
    const charLimit = 400; 
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
      {/* ASCII art backgrounds */}
      {/* Left side ASCII temple */}
      <div className="fixed left-5 top-1/3 text-gray-700 opacity-80 z-0 hidden md:block">
        <pre style={{ fontSize: "18px", lineHeight: "18px", fontFamily: "monospace" }}>
          {leftTempleAscii}
        </pre>
      </div>
      
      {/* Right side ASCII sun */}
      <div className="fixed right-5 top-1/3 text-gray-700 opacity-80 z-0 hidden md:block">
        <pre style={{ fontSize: "18px", lineHeight: "18px", fontFamily: "monospace" }}>
          {rightSunAscii}
        </pre>
      </div>
      
      <div className="absolute top-5 hidden w-full justify-between px-5 sm:flex">
      </div>
      
      {/* Prophet message above the welcome image */}
      {loadingMessage && (
        <div 
          className="fixed top-10 left-0 right-0 mx-auto z-50 text-center transition-opacity duration-1000 mt-8"
          style={{ opacity: loadingOpacity }}
        >
          <div className="bg-white border border-black p-3 mx-auto inline-block">
            <div className="whitespace-pre-line text-xl">{loadingMessage}</div>
          </div>
        </div>
      )}
      
      {/* Main content area - always shown */}
      <div className="mx-5 mt-20 max-w-screen-md w-full sm:w-full relative">
        <div className="flex flex-col items-center justify-center p-7 sm:p-10">
          {/* Welcome image - always shown */}
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
          {chatMessages.length > 0 && chatMessages[chatMessages.length - 1].role === "assistant" && (
            <div 
              className={clsx(
                "absolute max-w-xs bg-white border border-black p-4",
                messagePosition === "left" ? "left-4 top-1/3" : "right-4 top-1/3"
              )}
              style={{ opacity: responseOpacity, transition: "opacity 1s" }}
            >
              <div className="prose prose-p:leading-relaxed break-words max-h-60 overflow-hidden">
                {truncateText(chatMessages[chatMessages.length - 1].content)}
              </div>
            </div>
          )}
        </div>
      </div>
      
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
          
          {/* Reset button that appears when response vanishes */}
          {showResetButton && (
            <div className="flex justify-center mb-4">
              <button
                type="button"
                className="bg-black text-white py-2 px-6 font-italic"
                style={{ fontFamily: "Times New Roman, serif", fontStyle: "italic" }}
                onClick={handleReset}
              >
                kneel, gift, pray ... again
              </button>
            </div>
          )}
          
          {/* Buttons with images instead of text - no container border */}
          <div className="flex flex-wrap gap-5 justify-center">
            {randomizedButtons.map((option, i) => (
              <button
                key={i}
                type="button"
                className={clsx(
                  "p-0 transition-all overflow-hidden",
                  (isLoading || (responseOpacity > 0 && !lastResponseComplete)) ? "cursor-not-allowed opacity-50" : "hover:opacity-90"
                )}
                onClick={() => handleButtonClick(option.text)}
                disabled={isLoading || (responseOpacity > 0 && !lastResponseComplete)}
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