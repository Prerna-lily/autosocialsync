import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaCoins,
  FaWrench,
  FaQuestionCircle,
  FaCheck,
  FaPlus,
  FaTimes,
  FaSpinner
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Dashboard = () => {
  const [linkedInAuthUrl, setLinkedInAuthUrl] = useState("");
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showAccountTypeSelector, setShowAccountTypeSelector] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState("personal");
  const [disconnecting, setDisconnecting] = useState(false);
  const [linkedInState, setLinkedInState] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

 const fetchInitialData = async (retryCount = 0) => {
  const maxRetries = 3;
  try {
    console.log("Fetching LinkedIn auth URL...");
    // Get LinkedIn auth URL
    const authUrlResponse = await axios.get("/api/linkedin/auth-url");
    console.log("Auth URL response:", authUrlResponse.data);

    if (!authUrlResponse.data.authUrl) {
      throw new Error("No LinkedIn auth URL returned from server. Please check backend configuration.");
    }
    setLinkedInAuthUrl(authUrlResponse.data.authUrl);
    setLinkedInState(authUrlResponse.data.state);

    // Get connected accounts
    await fetchConnectedAccounts();
  } catch (error) {
    console.error("Error fetching data:", error);
    console.error("Full error object:", error.response || error);
    let errorMessage = error.response?.data?.detail || error.message;
    if (error.response?.status === 500) {
      errorMessage = "Server error while fetching LinkedIn auth URL. Please try again or contact support.";
    }
    if (retryCount < maxRetries) {
      console.log(`Retrying fetchInitialData (attempt ${retryCount + 1})...`);
      setTimeout(() => fetchInitialData(retryCount + 1), 1000);
    } else {
      setError(`Failed to load dashboard: ${errorMessage}`);
    }
  } finally {
    if (retryCount === 0) {
      setLoading(false);
    }
  }
};

  const handleLinkedInConnect = (accountType = "personal") => {
    if (!linkedInAuthUrl) {
      setError("LinkedIn authentication URL is not available. Please refresh the page or try again later.");
      return;
    }
    try {
      const url = new URL(linkedInAuthUrl);
      url.searchParams.set('account_type', accountType);
      url.searchParams.set('state', linkedInState);
      window.location.href = url.toString();
    } catch (err) {
      console.error("Error constructing LinkedIn auth URL:", err);
      setError("Failed to initiate LinkedIn connection. Please try again.");
    }
  };

  // Check URL parameters when component mounts
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('linkedin_connected') === 'true') {
      setSuccessMessage("LinkedIn account connected successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (query.get('linkedin_error')) {
      setError(`LinkedIn connection failed: ${query.get('linkedin_error')}`);
      setTimeout(() => setError(null), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    fetchInitialData();
  }, [location]);

  const fetchConnectedAccounts = async () => {
    try {
      const response = await axios.get("/api/accounts?user_id=current_user_id");
      setConnectedAccounts(response.data?.accounts || []);
    } catch (error) {
      console.error("Error fetching connected accounts:", error);
      setError("Failed to load connected accounts");
    }
  };

  const handleDisconnect = async (accountId) => {
    if (disconnecting) return;

    try {
      setDisconnecting(true);
      await axios.delete(`/api/accounts/${accountId}`, {
        data: { user_id: "current_user_id" }
      });
      setSuccessMessage("Account disconnected successfully");
      setTimeout(() => setSuccessMessage(""), 5000);
      await fetchConnectedAccounts();
    } catch (error) {
      console.error("Error disconnecting account:", error);
      setError("Failed to disconnect account");
    } finally {
      setDisconnecting(false);
    }
  };

  const handleConnect = (platform) => {
    switch (platform) {
      case 'linkedin':
        setShowAccountTypeSelector(true);
        break;
      case 'facebook':
        setError("Facebook integration coming soon!");
        break;
      case 'instagram':
        setError("Instagram integration coming soon!");
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4 flex items-center justify-center"
              >
                <FaSpinner className="text-blue-500 text-xl" />
              </motion.div>
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center mx-auto"
              >
                Retry
              </motion.button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex justify-between items-center"
                >
                  <span>{successMessage}</span>
                  <button
                    onClick={() => setSuccessMessage("")}
                    className="text-green-700 hover:text-green-900"
                  >
                    <FaTimes />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showAccountTypeSelector && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white p-6 rounded-lg max-w-md w-full mx-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Connect LinkedIn Account</h3>
                      <button
                        onClick={() => setShowAccountTypeSelector(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <p className="mb-4 text-gray-600">Select which type of LinkedIn account you want to connect:</p>
                    <div className="space-y-3 mb-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedAccountType('personal');
                          handleLinkedInConnect('personal');
                          setShowAccountTypeSelector(false);
                        }}
                        className={`w-full px-4 py-3 rounded-lg flex items-center ${selectedAccountType === 'personal' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                      >
                        <FaLinkedin className="mr-3" />
                        Personal Profile
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedAccountType('company');
                          handleLinkedInConnect('company');
                          setShowAccountTypeSelector(false);
                        }}
                        className={`w-full px-4 py-3 rounded-lg flex items-center ${selectedAccountType === 'company' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                      >
                        <FaLinkedin className="mr-3" />
                        Company Page
                      </motion.button>
                    </div>
                    <p className="text-xs text-gray-500">
                      You'll be redirected to LinkedIn to authorize access to your account.
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Good Afternoon, Admin <span className="ml-1">👋</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Here's what's happening with your social accounts today
              </p>
            </header>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Connected Accounts
                </h2>
                <span className="text-sm text-gray-500">
                  {connectedAccounts.length} of 3 connected
                </span>
              </div>

              {connectedAccounts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {connectedAccounts.map((account) => (
                    <motion.div
                      key={account._id}
                      whileHover={{ y: -5 }}
                      className="border border-gray-200 rounded-lg p-4 flex items-center bg-gradient-to-r from-gray-50 to-white relative"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-sm ${
                        account.platform === 'instagram' ? 'bg-gradient-to-r from-pink-500 to-purple-600' :
                        account.platform === 'facebook' ? 'bg-gradient-to-r from-blue-600 to-blue-800' :
                        'bg-gradient-to-r from-blue-500 to-blue-700'
                      }`}>
                        {account.platform === 'instagram' ? <FaInstagram className="text-white text-xl" /> :
                         account.platform === 'facebook' ? <FaFacebook className="text-white text-xl" /> :
                         <FaLinkedin className="text-white text-xl" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{account.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{account.platform}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-3">
                          <FaCheck />
                        </span>
                        <button
                          onClick={() => handleDisconnect(account._id || account.account_id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Disconnect"
                          disabled={disconnecting}
                        >
                          {disconnecting ? <FaSpinner className="animate-spin" /> : <FaTimes />}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FaLinkedin className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-500 mb-4">No accounts connected yet</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAccountTypeSelector(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                  >
                    Connect Your First Account
                  </motion.button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Connect Your Social Accounts
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Link your social media accounts to unlock powerful scheduling and analytics features.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConnect('instagram')}
                  className="flex flex-col items-center px-6 py-6 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all group"
                >
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                    <FaInstagram className="text-white text-2xl" />
                  </div>
                  <span className="text-gray-700 font-medium">Instagram</span>
                  <span className="text-xs text-gray-500 mt-1">Connect Account</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConnect('facebook')}
                  className="flex flex-col items-center px-6 py-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                    <FaFacebook className="text-white text-2xl" />
                  </div>
                  <span className="text-gray-700 font-medium">Facebook</span>
                  <span className="text-xs text-gray-500 mt-1">Connect Account</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConnect('linkedin')}
                  className="flex flex-col items-center px-6 py-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-blue-700 w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                    <FaLinkedin className="text-white text-2xl" />
                  </div>
                  <span className="text-gray-700 font-medium">LinkedIn</span>
                  <span className="text-xs text-gray-500 mt-1">Connect Account</span>
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div whileHover={{ y: -5 }}>
                <Link
                  to="/create-post"
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all h-full block border border-gray-100 group"
                >
                  <div className="bg-gradient-to-r from-blue-100 to-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-inner group-hover:shadow-inner-lg transition-shadow">
                    <FaCoins className="text-blue-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Win Rewards</h3>
                  <p className="text-gray-600 mb-4">
                    Invite friends and earn credits for premium features!
                  </p>
                  <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                    <span>Learn more</span>
                    <FaPlus className="ml-2 text-xs" />
                  </div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -5 }}>
                <Link
                  to="/calendar"
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all h-full block border border-gray-100 group"
                >
                  <div className="bg-gradient-to-r from-blue-100 to-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-inner group-hover:shadow-inner-lg transition-shadow">
                    <FaWrench className="text-blue-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Product Updates</h3>
                  <p className="text-gray-600 mb-4">
                    Discover new features and improvements we've released.
                  </p>
                  <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                    <span>See what's new</span>
                    <FaPlus className="ml-2 text-xs" />
                  </div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -5 }}>
                <Link
                  to="/chat-support"
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all h-full block border border-gray-100 group"
                >
                  <div className="bg-gradient-to-r from-blue-100 to-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-inner group-hover:shadow-inner-lg transition-shadow">
                    <FaQuestionCircle className="text-blue-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Need Help?</h3>
                  <p className="text-gray-600 mb-4">
                    Our support team is ready to assist you with any questions.
                  </p>
                  <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                    <span>Contact support</span>
                    <FaPlus className="ml-2 text-xs" />
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;