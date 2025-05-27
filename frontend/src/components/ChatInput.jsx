import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const ChatInput = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() !== "") {
      console.log("User Message:", message);
      setMessage("");
    }
  };

  return (
    <div className="fixed bottom-0 left-[280px] right-0 p-4 bg-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto relative">
        <input
          type="text"
          placeholder="Type your message here..."
          className="w-full pl-4 pr-12 py-3 bg-blue-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800"
        >
          <FaPaperPlane className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
