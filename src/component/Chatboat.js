"use client";
import React, { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);


const handleSend = async (e) => {
  e.preventDefault();
  const userMessage = input;
  setMessages([...messages, { text: userMessage, isUser: true }]);
  setInput("");
  setLoading(true); //  Show loading message

  try {
    const res = await fetch("/api/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { text: data.reply, isUser: false }]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      { text: "Error generating response.", isUser: false },
    ]);
  } finally {
    setLoading(false); //  Hide loading message
  }
};

  // const handleSend = async (e) => {
  //   e.preventDefault();
  //   if (!input.trim()) return;

  //   const userMessage = { text: input, isUser: true };
  //   setMessages((prev) => [...prev, userMessage]);

  //   console.log("Sending prompt:", input); //  Log what's being sent

  //   try {
  //     const res = await fetch("/api/route", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ prompt: input }),
  //     });

  //     console.log("Response status:", res.status); //  Response status

  //     const data = await res.json();
  //     console.log("API response data:", data); //  Actual response

  //     const botMessage = { text: data.answer, isUser: false };
  //     setMessages((prev) => [...prev, botMessage]);
  //   } catch (error) {
  //     console.error("Error calling API:", error); //Catch & log error
  //     const errorMessage = { text: "Error fetching response", isUser: false };
  //     setMessages((prev) => [...prev, errorMessage]);
  //   }

  //   setInput("");
  // };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="flex items-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          onClick={() => setIsOpen(true)}
          aria-label="Open Chatbot"
        >
          <img
            src="/asset/smile_18339704.png"
            alt="Chatbot Icon"
            className="w-18 h-18"
          />
          {/* <span className="text-sm font-medium">Chat</span> */}
        </button>
      </div>

      {isOpen && (
  <div className="fixed top-4 bottom-4 right-2 md:right-16 md:top-8 md:bottom-6 w-[95%] md:w-[42%] bg-black/30 bg-opacity-50 z-50 flex items-center justify-center">
    <div className="w-full h-full overflow-y-auto rounded-lg shadow-lg flex flex-col bg-[url('/asset/bg1.jpg')] bg-cover bg-center bg-no-repeat">

    {/* Optional: Add a semi-transparent overlay for readability */}
    {/* <div className="absolute inset-0 bg-black/30 rounded-lg"></div> */}

    {/* Header */}
    <div className="relative flex justify-between items-center bg-blue-300 text-white p-4 rounded-t-lg">
      <h2 className="text-lg font-bold">💬 AntixxTachHub ChatBot</h2>
      <button onClick={() => setIsOpen(false)}>✖</button>
    </div>

    {/* Messages */}
    <div className="relative flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`max-w-xs px-4 py-2 rounded-lg ${
            msg.isUser
              ? "bg-blue-100 self-end text-right ml-auto"
              : "bg-gray-300 self-start text-left mr-auto"
          }`}
        >
          {msg.text}
        </div>
      ))}


   {loading && (
    <div className="max-w-xs px-4 py-2 rounded-lg bg-yellow-100 text-gray-700 italic self-start mr-auto">
      Preparing response, wait for a moment...
    </div>
  )}

      <div ref={messagesEndRef} />
    </div>

    {/* Input */}
    <form
      onSubmit={handleSend}
      className="relative flex items-center p-4 border-t bg-gray-100"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Send
      </button>
    </form>
  </div>
</div>


    
        
      )}
    </>
  );
}
