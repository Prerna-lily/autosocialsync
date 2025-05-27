// import React from "react";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
// import MainContent from "../components/MainContent";
//
// const ChatSupport = () => {
//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <Sidebar />
//
//       {/* Main Content */}
//       <main className="flex-1 flex flex-col bg-gray-100">
//         {/* Navbar */}
//         <Navbar />
//
//         {/* Main Content Section */}
//         <div className="p-6 flex-1 overflow-auto">
//           <MainContent />
//         </div>
//
//
//       </main>
//
//     </div>
//   );
// };
//
// export default ChatSupport;

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaPaperPlane,
  FaLightbulb,
  FaCalendar,
  FaBullhorn,
  FaArrowLeft,
  FaSpinner,
  FaRobot,
  FaUser,
  FaRegCopy,
} from "react-icons/fa";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { BsSendFill } from "react-icons/bs";

const ChatSupport = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Main Content Section */}
        <div className="flex-1 overflow-auto">
          <MainContent />
        </div>
      </main>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

const MainContent = () => {
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    setChatActive(true);
    const newMessages = [...messages, { text: messageText, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: messageText }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const botReply =
        typeof data.response === "object"
          ? JSON.stringify(data.response)
          : data.response;

      setMessages([...newMessages, { text: botReply, sender: "bot" }]);
      toast.success("Response received!");
    } catch (error) {
      setMessages([
        ...newMessages,
        { text: "Error fetching response. Please try again.", sender: "bot" },
      ]);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard!");
  };

  return (
    <div className="h-full">
      {!chatActive ? (
        <div className="max-w-4xl mx-auto p-6 h-full flex flex-col">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SocialSync AI Assistant
              </span>
            </h1>
            <p className="text-gray-500 text-lg">
              Get instant help with your social media strategy
            </p>
          </div>

          {/* Chat Suggestions */}
          <div className="flex-1 space-y-8 mt-4">
            <ChatSuggestion
              icon={
                <FaLightbulb className="text-yellow-500 text-xl bg-yellow-100 p-2 rounded-full" />
              }
              title="Content Ideas"
              description="Get creative suggestions for your next viral post"
              suggestions={[
                "Generate three viral Instagram Reel ideas about my health consulting sessions.",
                "Give me 5 engaging captions for a food blogger's Instagram post.",
                "Suggest 3 unique post ideas for a fitness brand launching new protein shakes.",
              ]}
              onClick={handleSendMessage}
            />

            <ChatSuggestion
              icon={
                <FaCalendar className="text-blue-500 text-xl bg-blue-100 p-2 rounded-full" />
              }
              title="Content Calendar"
              description="Plan your social media schedule effectively"
              suggestions={[
                "Generate a 7-day Content Calendar for 'a personal finance influencer'.",
                "Create a monthly posting plan for a fashion brand launching a summer collection.",
                "Suggest a weekly content strategy for a tech startup's LinkedIn page.",
              ]}
              onClick={handleSendMessage}
            />

            <ChatSuggestion
              icon={
                <FaBullhorn className="text-purple-500 text-xl bg-purple-100 p-2 rounded-full" />
              }
              title="Ad Campaigns"
              description="Boost your marketing with effective ad strategies"
              suggestions={[
                "Generate 10 attention-grabbing headlines for a new product launch.",
                "Give me 5 persuasive call-to-actions for a skincare brand.",
                "Suggest 3 creative ad copy ideas for a travel agency promoting summer vacations.",
              ]}
              onClick={handleSendMessage}
            />
          </div>

          {/* Tips Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-start gap-3">
              <MdOutlineTipsAndUpdates className="text-blue-600 text-xl mt-1" />
              <div>
                <h3 className="font-medium text-blue-800 mb-2">Pro Tip</h3>
                <p className="text-sm text-blue-600">
                  Try being specific with your requests for better results. For
                  example: "Generate 3 Instagram post ideas for a vegan bakery
                  targeting millennials."
                </p>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="mt-6 sticky bottom-6">
            <div className="relative shadow-lg rounded-xl overflow-hidden">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
                placeholder="Ask me anything about social media..."
                className="w-full p-4 pr-12 bg-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl text-gray-700"
              />
              <button
                onClick={() => handleSendMessage(input)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition duration-200"
              >
                <BsSendFill className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ChatInterface
          messages={messages}
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          setChatActive={setChatActive}
          loading={loading}
          copyToClipboard={copyToClipboard}
        />
      )}
    </div>
  );
};

const ChatInterface = ({
  messages,
  input,
  setInput,
  handleSendMessage,
  setChatActive,
  loading,
  copyToClipboard,
}) => {
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="p-4 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <button
            onClick={() => setChatActive(false)}
            className="mr-3 text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition duration-200"
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <FaRobot className="text-blue-600 text-lg" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">SocialSync AI</h2>
              <p className="text-xs text-gray-500">
                {loading ? "Typing..." : "Online"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-6 max-w-md">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <FaRobot className="text-blue-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                How can I help you today?
              </h3>
              <p className="text-gray-500">
                Ask me anything about social media strategy, content creation,
                or marketing ideas.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] lg:max-w-[70%] relative group ${
                msg.sender === "user" ? "ml-auto" : "mr-auto"
              }`}
            >
              <div
                className={`flex items-start ${
                  msg.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 ${
                    msg.sender === "user"
                      ? "ml-3 bg-blue-600 text-white"
                      : "mr-3 bg-gray-200 text-gray-700"
                  } p-2 rounded-full`}
                >
                  {msg.sender === "user" ? (
                    <FaUser className="text-sm" />
                  ) : (
                    <FaRobot className="text-sm" />
                  )}
                </div>
                <div
                  className={`relative px-4 py-3 rounded-xl shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 rounded-tl-none border border-gray-200"
                  }`}
                >
                  {msg.text.split("\n").map((line, i) => (
                    <p key={i} className="mb-1">
                      {line}
                    </p>
                  ))}
                  <button
                    onClick={() => copyToClipboard(msg.text)}
                    className={`absolute -bottom-3 ${
                      msg.sender === "user" ? "-right-3" : "-left-3"
                    } bg-white text-gray-500 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-200 hover:text-blue-600 border border-gray-200`}
                    title="Copy to clipboard"
                  >
                    <FaRegCopy className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start max-w-[85%] lg:max-w-[70%]">
              <div className="flex-shrink-0 mr-3 bg-gray-200 text-gray-700 p-2 rounded-full">
                <FaRobot className="text-sm" />
              </div>
              <div className="px-4 py-3 bg-white text-gray-800 rounded-xl rounded-tl-none border border-gray-200 flex items-center space-x-2">
                <FaSpinner className="animate-spin text-gray-500" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
            placeholder="Type your message here..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
          />
          <button
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim()}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition duration-200 ${
              input.trim()
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <BsSendFill className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatSuggestion = ({ icon, title, description, suggestions, onClick }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition duration-200">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {icon}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500 mb-3">{description}</p>
            <div className="space-y-2">
              {suggestions.map((text, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition duration-200 text-gray-700 hover:text-gray-900"
                  onClick={() => onClick(text)}
                >
                  "{text}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSupport;