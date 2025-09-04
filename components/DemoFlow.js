"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Image,
  Video,
  X,
  Check,
  Download,
  Copy
} from "lucide-react";

const maslowLevels = [
  "Essentials for Living",
  "Security and Peace of Mind",
  "Belonging and Connection",
  "Well-being, Self-Respect and Achievement",
  "Living Your Potential",
];

const storyTypes = [
  "Against All Odds",
  "The Journey for Change",
  "Rising From the Ashes",
  "The Fall From Grace",
  "Comedy",
  "Our Hero Returns",
  "From Grass to Grace",
];

const culturalContexts = ["Youth Hustle Life", "Ethnicity", "Psychographics"];

const enhancementOptions = [
  {
    value: "Cinematic angles and moody lighting",
    icon: "🎬",
    description: "Professional camera work and atmospheric lighting",
  },
  {
    value: "Facial emotion and grit",
    icon: "😤",
    description: "Intense expressions and raw emotion",
  },
  {
    value: "Cultural artifacts",
    icon: "🏺",
    description: "Authentic cultural elements and symbols",
  },
  {
    value: "Poster-worthy layout",
    icon: "🖼️",
    description: "Compelling composition and visual hierarchy",
  },
];

const videoEnhancementOptions = [
  {
    value: "cinematic",
    icon: "🎬",
    title: "Cinematic",
    description: "Professional shot-by-shot script with camera angles and emotional tone",
  },
  {
    value: "digital",
    icon: "📱",
    title: "Digital Short",
    description: "Voiceover-first social media script focused on youth culture and simplicity",
  },
];

function prepareBrandSafePrompt(prompt, brandSafeMode = true) {
  if (!brandSafeMode) return prompt;
  
  const replacements = {
    "Pepsi": "a fizzy cola in a blue-labeled glass bottle",
    "Coca-Cola": "a glass soda bottle with a red label",
    "Nivea": "a round skincare cream jar with a deep blue lid",
    "Swan Spring Water": "a clear plastic bottle of refreshing natural spring water",
    "Gala": "a golden brown sausage roll in a red street-style wrapper"
  };
  
  let cleanPrompt = prompt;
  Object.entries(replacements).forEach(([brand, generic]) => {
    const regex = new RegExp(brand, "gi");
    cleanPrompt = cleanPrompt.replace(regex, generic);
  });
  
  return cleanPrompt;
}

const ChatMessage = ({ sender, message, timestamp, isTyping, children }) => {
  const isBot = sender === "bot";

  return (
    <div
      className={`flex gap-3 mb-6 ${isBot ? "justify-start" : "justify-end"}`}
    >
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div
        className={`max-w-xs sm:max-w-md lg:max-w-lg ${
          isBot ? "order-2" : "order-1"
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl ${
            isBot
              ? "bg-gray-100 text-gray-800 rounded-bl-sm"
              : "bg-blue-600 text-white rounded-br-sm"
          }`}
        >
          {isTyping ? (
            <div className="flex items-center gap-1">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm leading-relaxed">{message}</p>
              {children}
            </>
          )}
        </div>
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center order-2">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );
};

const QuickReplyButton = ({ children, onClick, variant = "default" }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      variant === "primary"
        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transform hover:-translate-y-0.5"
        : variant === "secondary"
        ? "bg-blue-500 text-white hover:bg-blue-600"
        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
    }`}
  >
    {children}
  </button>
);

export default function ChatStoryFlow() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      message:
        "Hi! I'm here to help you create amazing stories with AI. Let's start by selecting your story's motivational foundation from Maslow's hierarchy.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [currentStep, setCurrentStep] = useState("maslow");
  const [isTyping, setIsTyping] = useState(false);
  const [maslow, setMaslow] = useState("");
  const [archetype, setArchetype] = useState("");
  const [context, setContext] = useState("");
  const [story, setStory] = useState("");
  const [visualCue, setVisualCue] = useState("");
  const [wantsVisual, setWantsVisual] = useState(null);
  const [selectedEnhancements, setSelectedEnhancements] = useState([]);
  const [selectedVideoStyle, setSelectedVideoStyle] = useState("");
  const [visualOutput, setVisualOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState("");
  const [toneInput, setToneInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [brand, setBrand] = useState("");
  const [contextInput, setContextInput] = useState("");
  const [brandInput, setBrandInput] = useState("");
  const [brandSafeMode, setBrandSafeMode] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (sender, message, customComponent = null) => {
    const newMessage = {
      id: messages.length + 1,
      sender,
      message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      customComponent,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const simulateTyping = async (delay = 1000) => {
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, delay));
    setIsTyping(false);
  };

  const handleMaslowSelect = async (level) => {
    setMaslow(level);
    addMessage("user", level);

    await simulateTyping(800);
    addMessage(
      "bot",
      "Perfect! Now let's choose your story archetype. What kind of narrative structure speaks to you?"
    );
    setCurrentStep("archetype");
  };

  const handleArchetypeSelect = async (type) => {
    setArchetype(type);
    addMessage("user", type);

    await simulateTyping(800);
    addMessage(
      "bot",
      "Excellent choice! Finally, let's set the cultural context to make your story more authentic and relatable."
    );
    setCurrentStep("context");
  };

  const handleContextSelect = async (ctx) => {
    setContext(ctx);
    addMessage("user", ctx);

    await simulateTyping(1000);
    addMessage(
      "bot",
      "Amazing! I have all the ingredients I need. Let me craft a compelling story for you..."
    );

    setIsGenerating(true);
    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maslow, archetype, context: ctx, brand, tone }),
      });
      const res = await response.json();
      setStory(res.story);
      console.log(res)
      setVisualCue(res.visualCue);

      await simulateTyping(2000);
      addMessage("bot", "Here's your custom story:");

      setTimeout(() => {
        addMessage("bot", res.story);
        setTimeout(() => {
          addMessage(
            "bot",
            "Would you like to bring this story to life with visuals? I can help you create either an image or a video script!"
          );
          setCurrentStep("visual");
        }, 1000);
      }, 500);
    } catch (error) {
      console.error("Error generating story:", error);
      await simulateTyping(1000);
      addMessage(
        "bot",
        "Sorry, I encountered an error generating your story. Please try again."
      );
      setCurrentStep("maslow");
    }
    setIsGenerating(false);
  };

  const handleVisualChoice = async (choice) => {
    if (choice === "skip") {
      addMessage("user", "Skip visual");
      await simulateTyping(500);
      addMessage(
        "bot",
        "No problem! Your story is complete. Feel free to start over anytime with a new story!"
      );
      setCurrentStep("complete");
      return;
    }

    setWantsVisual(choice);
    addMessage(
      "user",
      `Yes, create ${choice === "image" ? "an image" : "a video script"}`
    );

    await simulateTyping(1000);
    addMessage(
      "bot",
      `Great! Let's enhance your ${choice} with some special effects. Select any ${choice === "video" ? "style" : "enhancements"} you'd like:`
    );
    setCurrentStep("enhancements");
  };

  const handleEnhancementToggle = (enhancement) => {
    setSelectedEnhancements((prev) =>
      prev.includes(enhancement)
        ? prev.filter((e) => e !== enhancement)
        : [...prev, enhancement]
    );
  };

  const handleVideoStyleSelect = (style) => {
    setSelectedVideoStyle(style);
  };

  const generateVisual = async () => {
    if (wantsVisual === "video" && !selectedVideoStyle) {
      addMessage("bot", "Please select a video style first!");
      return;
    }

    const enhancementText = wantsVisual === "video" 
      ? `Selected style: ${selectedVideoStyle}`
      : selectedEnhancements.length > 0
        ? `Selected enhancements: ${selectedEnhancements.join(", ")}`
        : "No enhancements selected";

    addMessage("user", enhancementText);

    await simulateTyping(1000);
    addMessage("bot", `Perfect! Let me generate your ${wantsVisual} now...`);

    setIsGenerating(true);
    try {
      if (wantsVisual === "video") {
        // Call the video script API
        const response = await fetch("/api/video-script", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visualCue,
            videoStyle: selectedVideoStyle,
          }),
        });

        const res = await response.json();
        setVisualOutput(res.story);

        await simulateTyping(2000);
        addMessage("bot", "Here's your video script:");

        setTimeout(() => {
          addMessage(
            "bot",
            "",
            <div className="mt-3 bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs overflow-x-auto">
              <pre className="whitespace-pre-wrap">{res.story}</pre>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(res.story);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex items-center gap-1 text-sm text-green-400 hover:underline"
                >
                  <Copy size={14} />
                  {copied ? "Copied!" : "Copy Script"}
                </button>
              </div>
            </div>
          );
        }, 500);
      } else {
        // Apply brand-safe filtering to the visual cue before sending
        const safePrompt = prepareBrandSafePrompt(visualCue, brandSafeMode);
        
        const response = await fetch("/api/visual", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visualCue: safePrompt,
            enhancements: selectedEnhancements,
            type: wantsVisual,
          }),
        });

        const res = await response.json();
        setVisualOutput(res.output);

        await simulateTyping(2000);
        addMessage("bot", "Here's your image:");

        if (res.imageUrl) {
          let copyTimeout;
          setTimeout(() => {
            addMessage(
              "bot",
              "",
              <div className="mt-3">
                <img
                  src={res.imageUrl}
                  alt="Generated visual"
                  className="rounded-lg shadow-lg max-w-full"
                />
                <p className="text-xs text-gray-500 mt-2">Prompt: {res.output}</p>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = res.imageUrl;
                      link.download = "generated_image.png";
                      link.click();
                    }}
                    className="flex items-center gap-1 text-sm text-gray-700 hover:underline"
                  >
                    <Download size={18} />
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(res.output);
                      setCopied(true);
                      clearTimeout(copyTimeout);
                      copyTimeout = setTimeout(() => setCopied(false), 2000)
                    }}
                    className="flex items-center gap-1 text-sm text-gray-700 hover:underline"
                  >
                     <Copy size={18} />
                  </button>
                    {copied && (
              <span className="text-xs text-green-500">Copied</span>
            )}
                </div>
              </div>
            );
          }, 500);
        }
      }

      setTimeout(() => {
        addMessage("bot", "Want to create another story?");
        setCurrentStep("complete");
      }, 1000);
    } catch (error) {
      console.error("Error generating visual:", error);
      await simulateTyping(1000);
      addMessage(
        "bot",
        "Sorry, I had trouble generating your visual. Please try again."
      );
    }
    setIsGenerating(false);
  };

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        sender: "bot",
        message:
          "Hi! I'm here to help you create amazing stories with AI. Let's start by selecting your story's motivational foundation from Maslow's hierarchy.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setCurrentStep("maslow");
    setMaslow("");
    setArchetype("");
    setContext("");
    setStory("");
    setVisualCue("");
    setWantsVisual(null);
    setSelectedEnhancements([]);
    setSelectedVideoStyle("");
    setVisualOutput("");
  };

const renderQuickReplies = () => {
  switch (currentStep) {
    case "maslow":
      return (
        <div className="flex flex-wrap gap-2 mt-4">
          {maslowLevels.map((level) => (
            <QuickReplyButton
              key={level}
              onClick={() => handleMaslowSelect(level)}
              variant="default"
            >
              {level}
            </QuickReplyButton>
          ))}
        </div>
      );

    case "archetype":
      return (
        <div className="flex flex-wrap gap-2 mt-4">
          {storyTypes.map((type) => (
            <QuickReplyButton
              key={type}
              onClick={() => handleArchetypeSelect(type)}
              variant="default"
            >
              {type}
            </QuickReplyButton>
          ))}
        </div>
      );

    case "context":
      return (
        <div className="mt-4">
          <input
            type="text"
            placeholder="e.g. Yoruba market life"
            value={contextInput}
            onChange={(e) => setContextInput(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && contextInput.trim()) {
                setContext(contextInput);
                addMessage("user", contextInput);
                setContextInput("");
                await simulateTyping(800);
                addMessage("bot", "Great! Would you like to add a tone? (optional)");
                setCurrentStep("tone");
              }
            }}
            className="w-full border rounded-lg p-2 text-sm"
          />
        </div>
      );

    case "tone":
      return (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Type a tone (optional)... press Enter to submit or skip"
            value={toneInput}
            onChange={(e) => setToneInput(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                if (toneInput.trim()) {
                  setTone(toneInput);
                  addMessage("user", toneInput);
                } else {
                  addMessage("user", "(Skipped tone)");
                }
                setToneInput("");
                await simulateTyping(800);
                addMessage("bot", "Awesome! Now type in the brand name.");
                setCurrentStep("brand");
              }
            }}
            className="w-full border rounded-lg p-2 text-sm"
          />
        </div>
      );

    case "brand":
      return (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Type your brand name... (required)"
            value={brandInput}
            onChange={(e) => setBrandInput(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && brandInput.trim()) {
                setBrand(brandInput);
                addMessage("user", brandInput);
                setBrandInput("");
                await simulateTyping(800);
                addMessage("bot", "Awesome! Click the button below to generate your story.");
                setCurrentStep("generateStory");
              }
            }}
            className="w-full border rounded-lg p-2 text-sm"
          />
        </div>
      );

    case "generateStory":
      return (
        <div className="flex gap-2 mt-4">
          <QuickReplyButton
            onClick={() => handleContextSelect(context)}
            variant="primary"
          >
            Generate Story
          </QuickReplyButton>
        </div>
      );

    case "visual":
      return (
        <div className="flex flex-wrap gap-2 mt-4">
          <QuickReplyButton
            onClick={() => handleVisualChoice("image")}
            variant="primary"
          >
            <Image size={14} className="inline mr-1" /> Create Image
          </QuickReplyButton>
          <QuickReplyButton
            onClick={() => handleVisualChoice("video")}
            variant="secondary"
          >
            <Video size={14} className="inline mr-1" /> Create Video
          </QuickReplyButton>
          <QuickReplyButton
            onClick={() => handleVisualChoice("skip")}
            variant="default"
          >
            <X size={14} className="inline mr-1" /> Skip
          </QuickReplyButton>
        </div>
      );

    case "enhancements":
      return (
        <div className="mt-4 space-y-3">
          <div className="grid gap-2">
            {wantsVisual === "video" ? (
              // Video enhancement options
              videoEnhancementOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleVideoStyleSelect(option.value)}
                  className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                    selectedVideoStyle === option.value
                      ? "border-purple-500 bg-purple-50 shadow-sm"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="videoStyle"
                      checked={selectedVideoStyle === option.value}
                      readOnly
                      className="mt-0.5 w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{option.icon}</span>
                        <span className="font-medium text-sm">
                          {option.title}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              // Image enhancement options
              enhancementOptions.map((enhancement) => (
                <button
                  key={enhancement.value}
                  onClick={() => handleEnhancementToggle(enhancement.value)}
                  className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                    selectedEnhancements.includes(enhancement.value)
                      ? "border-purple-500 bg-purple-50 shadow-sm"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedEnhancements.includes(enhancement.value)}
                      readOnly
                      className="mt-0.5 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{enhancement.icon}</span>
                        <span className="font-medium text-sm">
                          {enhancement.value}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {enhancement.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
          <QuickReplyButton onClick={generateVisual} variant="primary">
            <Sparkles size={14} className="inline mr-1" /> Generate{" "}
            {wantsVisual === "image" ? "Image" : "Video Script"}
          </QuickReplyButton>
        </div>
      );

    case "complete":
      return (
        <div className="flex gap-2 mt-4">
          <QuickReplyButton onClick={resetChat} variant="primary">
            Create New Story
          </QuickReplyButton>
        </div>
      );

    default:
      return null;
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot size={32} className="text-purple-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-800">Narratives.XO</h1>
              <p className="text-xs text-gray-500">AI Story Generator</p>
            </div>
          </div>
          
          {/* Brand-Safe Mode Toggle */}
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              checked={brandSafeMode} 
              onChange={(e) => setBrandSafeMode(e.target.checked)} 
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-gray-700">Enable Brand-Safe Visuals</span>
          </label>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              sender={msg.sender}
              message={msg.message}
              timestamp={msg.timestamp}
            >
              {msg.customComponent}
            </ChatMessage>
          ))}

          {isTyping && (
            <ChatMessage sender="bot" isTyping={true} timestamp="now" />
          )}

          {isGenerating && (
            <ChatMessage
              sender="bot"
              message="Working on your request..."
              timestamp="now"
            >
              <div className="flex items-center gap-2 mt-2">
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-gray-600">Generating...</span>
              </div>
            </ChatMessage>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Replies */}
      {!isGenerating && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto">{renderQuickReplies()}</div>
        </div>
      )}
    </div>
  );
}