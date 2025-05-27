import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaInstagram, FaFacebook, FaLinkedin, FaPlus, FaTrash, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("/api/accounts?user_id=current_user_id");
        // Ensure we always have an array to map over
        setAccounts(response.data?.accounts || []);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setError("Failed to load accounts");
        toast.error("Failed to load accounts");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleDisconnect = async (accountId) => {
    if (disconnecting) return;

    try {
      setDisconnecting(true);
      const toastId = toast.loading("Disconnecting account...");

      await axios.delete(`/api/accounts/${accountId}`, {
        data: { user_id: "current_user_id" }
      });

      setAccounts(accounts.filter(account =>
        account._id !== accountId && account.account_id !== accountId
      ));

      toast.update(toastId, {
        render: "Account disconnected successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
    } catch (error) {
      console.error("Error disconnecting account:", error);
      setError("Failed to disconnect account");
      toast.error("Failed to disconnect account");
    } finally {
      setDisconnecting(false);
    }
  };

  // Get platform icon
  const getPlatformIcon = (platform) => {
    switch(platform.toLowerCase()) {
      case 'instagram':
        return <FaInstagram className="text-white text-xl" />;
      case 'facebook':
        return <FaFacebook className="text-white text-xl" />;
      case 'linkedin':
        return <FaLinkedin className="text-white text-xl" />;
      default:
        return <FaLinkedin className="text-white text-xl" />;
    }
  };

  // Get platform color class
  const getPlatformColorClass = (platform) => {
    switch(platform.toLowerCase()) {
      case 'instagram':
        return 'bg-gradient-to-r from-pink-500 to-purple-600';
      case 'facebook':
        return 'bg-gradient-to-r from-blue-600 to-blue-800';
      case 'linkedin':
        return 'bg-gradient-to-r from-blue-500 to-blue-700';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-700';
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
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Loading accounts...</p>
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
        <ToastContainer position="top-center" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-8xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Connected Accounts</h1>
                <p className="text-gray-600 mt-2">
                  Manage your connected social media accounts
                </p>
              </div>
              <Link
                to="/social-dashboard"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Connect New Account
              </Link>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                <p>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm font-medium text-red-700 underline hover:text-red-800"
                >
                  Retry
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts && accounts.length > 0 ? (
                accounts.map((account) => (
                  <div key={account._id || account.account_id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${getPlatformColorClass(account.platform)}`}>
                        {getPlatformIcon(account.platform)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{account.platform}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {account.account_type === 'personal' ? 'Personal Account' : 'Business Account'}
                      </div>
                      <button
                        onClick={() => handleDisconnect(account._id || account.account_id)}
                        className="text-red-500 hover:text-red-700 flex items-center text-sm"
                        disabled={disconnecting}
                      >
                        {disconnecting ? <FaSpinner className="animate-spin mr-1" /> : <FaTrash className="mr-1" />}
                        Disconnect
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaPlus className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No accounts connected</h3>
                  <p className="text-gray-600 mb-6">
                    Connect your social media accounts to get started
                  </p>
                  <Link
                    to="/social-dashboard"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    Connect Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Accounts;