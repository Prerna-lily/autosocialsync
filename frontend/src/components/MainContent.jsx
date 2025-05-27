import React, { useState } from "react";
import { FaLightbulb, FaCalendar, FaBullhorn, FaPaperPlane, FaArrowLeft, FaSpinner } from "react-icons/fa";

// Chat UI Component
const MainContent = () => {
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to handle sending messages
 const handleSendMessage = async (messageText) => {
  if (!messageText.trim()) return;

  setChatActive(true);
  const newMessages = [...messages, { text: messageText, sender: "user" }];
  setMessages(newMessages);
  setInput(""); // Clear input field
  setLoading(true); // Show loading animation

  try {
const response = await fetch("http://127.0.0.1:8000/api/chatbot/", {  // Ensure "/" at end
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: messageText }),
});

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Ensure response structure is correct
const botReply = typeof data.response === "object" ? JSON.stringify(data.response) : data.response;


    setMessages([...newMessages, { text: botReply, sender: "bot" }]);
  } catch (error) {
    setMessages([...newMessages, { text: "Error fetching response. Please try again.", sender: "bot" }]);
  } finally {
    setLoading(false); // Hide loading animation
  }
};


  return (
    <main className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-8">
        {!chatActive ? (
          <>
            {/* Title Section */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Try <span className="text-blue-600">Chat by SocialSync</span>
              </h1>
              <p className="text-gray-600">Type your own query or select a suggestion to begin.</p>
            </div>

            {/* Chat Suggestions */}
            <div className="space-y-6 mt-6">
              <ChatSuggestion
                icon={<FaLightbulb className="text-blue-600 text-lg" />}
                title="Get Content Ideas"
                suggestions={[
                  "Generate three viral Instagram Reel ideas about my health consulting sessions.",
                  "Give me 5 engaging captions for a food blogger's Instagram post.",
                  "Suggest 3 unique post ideas for a fitness brand launching new protein shakes."
                ]}
                onClick={handleSendMessage}
              />
              <ChatSuggestion
                icon={<FaCalendar className="text-blue-600 text-lg" />}
                title="Generate Content Calendar"
                suggestions={[
                  "Generate a 7-day Content Calendar for 'a personal finance influencer'.",
                  "Create a monthly posting plan for a fashion brand launching a summer collection.",
                  "Suggest a weekly content strategy for a tech startup's LinkedIn page."
                ]}
                onClick={handleSendMessage}
              />
              <ChatSuggestion
                icon={<FaBullhorn className="text-blue-600 text-lg" />}
                title="Get Ad Ideas"
                suggestions={[
                  "Generate 10 attention-grabbing headlines for a new product launch.",
                  "Give me 5 persuasive call-to-actions for a skincare brand.",
                  "Suggest 3 creative ad copy ideas for a travel agency promoting summer vacations."
                ]}
                onClick={handleSendMessage}
              />
            </div>

            {/* Chat Input Below Suggestions */}
            <div className="mt-6">
              <ChatInput input={input} setInput={setInput} handleSendMessage={handleSendMessage} />
            </div>
          </>
        ) : (
          <ChatInterface
            messages={messages}
            input={input}
            setInput={setInput}
            handleSendMessage={handleSendMessage}
            setChatActive={setChatActive}
            loading={loading}
          />
        )}
      </div>
    </main>
  );
};

// Chat Input Field Component (Used in both initial and chat views)
const ChatInput = ({ input, setInput, handleSendMessage }) => (
  <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md flex items-center">
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Type your message here..."
      className="flex-1 p-3 border-none focus:outline-none text-gray-700"
    />
    <button
      onClick={() => handleSendMessage(input)}
      className="ml-3 text-blue-600 hover:text-blue-800 transition duration-200"
    >
      <FaPaperPlane className="text-lg" />
    </button>
  </div>
);

// Chat Interface Component
const ChatInterface = ({ messages, input, setInput, handleSendMessage, setChatActive, loading }) => (
  <div className="flex flex-col h-[75vh] relative">
    {/* Chat Header */}
    <div className="p-4 bg-white flex items-center shadow-md border-b">
      <button onClick={() => setChatActive(false)} className="mr-3 text-blue-600 hover:text-blue-800">
        <FaArrowLeft className="text-lg" />
      </button>
      <h2 className="text-lg font-bold text-gray-800">Chat with SocialSync AI</h2>
    </div>

    {/* Chat Messages - Improved UI */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg shadow-inner">
      {messages.map((msg, index) => (
        <div key={index} className={`flex items-end ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
<div
  className={`relative px-4 py-3 rounded-2xl shadow-md text-sm max-w-[75%] whitespace-pre-line transition-all duration-300 ${
    msg.sender === "user" ? "bg-blue-600 text-white self-end" : "bg-white border border-gray-300"
  }`}
>
  {msg.text.split("\n").map((line, index) => (
    <p key={index} className="mb-1">
      {line}
    </p>
  ))}
</div>

        </div>
      ))}
      {loading && (
        <div className="flex justify-start">
          <div className="px-4 py-3 bg-gray-300 text-gray-700 rounded-2xl shadow-md flex items-center space-x-2">
            <FaSpinner className="animate-spin text-gray-700" />
            <span>Generating response...</span>
          </div>
        </div>
      )}
    </div>

    {/* Chat Input Field */}
    <div className="p-4 bg-white border-t shadow-md flex items-center">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message here..."
        className="flex-1 p-3 border-none focus:outline-none text-gray-700"
      />
      <button
        onClick={() => handleSendMessage(input)}
        className="ml-3 text-blue-600 hover:text-blue-800 transition duration-200"
      >
        <FaPaperPlane className="text-lg" />
      </button>
    </div>
  </div>
);

// Component for Chat Suggestions
const ChatSuggestion = ({ icon, title, suggestions, onClick }) => (
  <div className="space-y-4">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-800">{title}</h2>
        <div className="space-y-2">
          {suggestions.map((text, index) => (
            <button
              key={index}
              className="w-full text-left p-3 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm text-sm transition duration-200"
              onClick={() => onClick(text)}
            >
              "{text}"
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default MainContent;
