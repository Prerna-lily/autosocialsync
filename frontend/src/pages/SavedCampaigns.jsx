// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// import Navbar from '../components/Navbar';
// import axios from 'axios';
// import { FiEye, FiPlay, FiEdit, FiTrash2 } from 'react-icons/fi';
//
// const SavedCampaigns = () => {
//   const [campaigns, setCampaigns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [generating, setGenerating] = useState(null);
//   const navigate = useNavigate();
//
//   useEffect(() => {
//   const fetchCampaigns = async () => {
//     try {
//       // Remove the trailing slash from the URL
//       const response = await axios.get('http://localhost:8000/api/get-campaigns');
//       setCampaigns(response.data);
//     } catch (err) {
//       setError('Failed to load campaigns. Please try again.');
//       console.error('Error details:', err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   fetchCampaigns();
// }, []);
//
//   const handleViewCampaign = (campaignId) => {
//     navigate(`/campaign/${campaignId}`);
//   };
//
//   const handleGenerateContent = async (campaignId) => {
//     setGenerating(campaignId);
//     try {
//       const response = await axios.post(
//         `http://localhost:8000/api/campaign-schedules/generate-content/${campaignId}`
//       );
//
//       alert(response.data.message);
//       // Refresh campaigns list
//       const updatedResponse = await axios.get('http://localhost:8000/api/campaign-schedules/get-campaigns/');
//       setCampaigns(updatedResponse.data);
//     } catch (error) {
//       alert(`Error generating content: ${error.response?.data?.detail || error.message}`);
//     } finally {
//       setGenerating(null);
//     }
//   };
//
//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };
//
//   return (
//     <div className="flex bg-gray-100 min-h-screen font-[Inter]">
//       <div className="w-[250px] fixed top-0 left-0 bottom-0 z-20 bg-white shadow-lg">
//         <Sidebar />
//       </div>
//
//       <div className="flex flex-col flex-1 ml-[250px]">
//         <Navbar />
//
//         <main className="flex-1 overflow-y-auto p-8">
//           <div className="max-w-6xl mx-auto">
//             <div className="flex justify-between items-center mb-8">
//               <h1 className="text-4xl font-bold text-gray-800">
//                 📅 Saved Campaigns
//               </h1>
//             </div>
//
//             {loading ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             ) : error ? (
//               <div className="text-red-500 text-center py-8">{error}</div>
//             ) : campaigns.length === 0 ? (
//               <div className="text-center py-8">No campaigns found</div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {campaigns.map((campaign) => (
//                   <div
//                     key={campaign._id}
//                     className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//                   >
//                     <div className="p-6">
//                       <div className="flex justify-between items-start mb-4">
//                         <h2 className="text-xl font-bold text-gray-800 truncate">
//                           {campaign.campaign_name}
//                         </h2>
//                         <span className={`px-2 py-1 text-xs rounded-full ${
//                           campaign.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
//                           campaign.status === 'generating' ? 'bg-blue-100 text-blue-800' :
//                           'bg-green-100 text-green-800'
//                         }`}>
//                           {campaign.status || 'draft'}
//                         </span>
//                       </div>
//
//                       <p className="text-gray-600 mb-2">
//                         <span className="font-semibold">Theme:</span> {campaign.theme}
//                       </p>
//
//                       <div className="flex items-center text-sm text-gray-500 mb-4">
//                         <span className="mr-4">
//                           {campaign.posts?.length || 0} posts
//                         </span>
//                         <span>
//                           {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
//                         </span>
//                       </div>
//
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleViewCampaign(campaign._id)}
//                           className="flex items-center justify-center p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
//                           title="View Campaign"
//                         >
//                           <FiEye className="text-lg" />
//                         </button>
//
//                         <button
//                           onClick={() => handleGenerateContent(campaign._id)}
//                           disabled={generating === campaign._id}
//                           className={`flex items-center justify-center p-2 ${
//                             generating === campaign._id ?
//                             'bg-gray-100 text-gray-400 cursor-not-allowed' :
//                             'bg-green-100 text-green-600 hover:bg-green-200'
//                           } rounded-lg transition-colors`}
//                           title="Generate Content"
//                         >
//                           <FiPlay className="text-lg" />
//                         </button>
//
//                         <button
//                           className="flex items-center justify-center p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
//                           title="Edit Campaign"
//                         >
//                           <FiEdit className="text-lg" />
//                         </button>
//
//                         <button
//                           className="flex items-center justify-center p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//                           title="Delete Campaign"
//                         >
//                           <FiTrash2 className="text-lg" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };
//
// export default SavedCampaigns;
//

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { FiEye, FiPlay, FiEdit, FiTrash2, FiPlus, FiSearch, FiCalendar, FiFilter } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

const SavedCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/get-campaigns');
        setCampaigns(response.data);
      } catch (err) {
        setError('Failed to load campaigns. Please try again.');
        console.error('Error details:', err.response?.data || err.message);
        toast.error('Failed to load campaigns', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleViewCampaign = (campaignId) => {
    navigate(`/campaign/${campaignId}`);
  };

  const handleGenerateContent = async (campaignId) => {
    setGenerating(campaignId);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/campaign-schedules/generate-content/${campaignId}`
      );

      toast.success(response.data.message || 'Content generated successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Refresh campaigns list
      const updatedResponse = await axios.get('http://localhost:8000/api/get-campaigns');
      setCampaigns(updatedResponse.data);
    } catch (error) {
      toast.error(`Error generating content: ${error.response?.data?.detail || error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setGenerating(null);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await axios.delete(`http://localhost:8000/api/campaign-schedules/delete-campaign/${campaignId}`);
        setCampaigns(campaigns.filter(c => c._id !== campaignId));
        toast.success('Campaign deleted successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (error) {
        toast.error(`Error deleting campaign: ${error.response?.data?.detail || error.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';

    // Try parsing as ISO string first
    let date = new Date(dateString);

    // If invalid, try parsing the specific format you're receiving (e.g., "April 24 at 10:00 AM")
    if (isNaN(date.getTime())) {
      // Custom parsing for your date format
      const parts = dateString.match(/(\w+) (\d+) at (\d+):(\d+) (AM|PM)/);
      if (parts) {
        const months = {
          January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
          July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
        };

        const month = months[parts[1]];
        const day = parseInt(parts[2]);
        let hours = parseInt(parts[3]);
        const minutes = parseInt(parts[4]);
        const period = parts[5];

        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        date = new Date(new Date().getFullYear(), month, day, hours, minutes);
      }
    }

    if (isNaN(date.getTime())) return 'Invalid date';

    const options = {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleString(undefined, options);
  };


  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.theme.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      {/* Sidebar */}
      <div className="w-[250px] fixed top-0 left-0 bottom-0 z-20 bg-white shadow-xl border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 ml-[250px]">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Saved Campaigns
                  </span>
                </h1>
                <p className="text-gray-500 mt-2">
                  Manage and organize all your marketing campaigns in one place
                </p>
              </div>

              <button
                onClick={() => navigate('/create-campaign')}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <FiPlus className="text-lg" />
                Create New Campaign
              </button>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiFilter className="text-gray-400" />
                  </div>
                  <select
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <select
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                    defaultValue=""
                  >
                    <option value="">All Dates</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                    <option value="last-month">Last Month</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <h3 className="text-sm font-medium text-gray-500">Total Campaigns</h3>
                <p className="text-2xl font-bold text-gray-800">{campaigns.length}</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <h3 className="text-sm font-medium text-gray-500">Active</h3>
                <p className="text-2xl font-bold text-indigo-600">
                  {campaigns.filter(c => c.status === 'active').length}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <h3 className="text-sm font-medium text-gray-500">Drafts</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {campaigns.filter(c => c.status === 'draft').length}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                <p className="text-2xl font-bold text-green-600">
                  {campaigns.filter(c => c.status === 'completed').length}
                </p>
              </motion.div>
            </div>

            {/* Campaigns List */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading your campaigns...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-lg font-medium mb-2">Error loading campaigns</div>
                <p className="text-gray-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-64 h-48 mb-6 mx-auto flex items-center justify-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                  <FiSearch className="text-indigo-400 text-5xl" />
                </div>
                <h3 className="text-xl font-medium text-gray-700">No campaigns found</h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  {searchTerm ? 'No campaigns match your search.' : 'You haven\'t created any campaigns yet.'}
                </p>
                <button
                  onClick={() => navigate('/create-campaign')}
                  className="mt-4 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 mx-auto"
                >
                  <FiPlus className="text-lg" />
                  Create New Campaign
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <motion.div
                    key={campaign._id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl font-bold text-gray-800 truncate">
  {campaign.campaign_name}
</h2>
<p className="text-gray-600 truncate">
  {campaign.theme}
</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          campaign.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status || 'draft'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Posts</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {campaign.posts?.length || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Created</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {formatDate(campaign.created_at)}
                          </p>
                        </div>
                      </div>

                      {/* Enhanced Date Display Section */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 mb-1">Start Date</p>
            <p className="text-sm font-semibold text-indigo-600">
              {campaign.start_date ? formatDate(campaign.start_date) : 'Not set'}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 mb-1">End Date</p>
            <p className="text-sm font-semibold text-indigo-600">
              {campaign.end_date ? formatDate(campaign.end_date) : 'Not set'}
            </p>
          </div>
        </div>
      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-500">
                          <span>ID: {campaign._id.substring(0, 6)}...</span>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewCampaign(campaign._id)}
                            className="flex items-center justify-center p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors group relative"
                            title="View Campaign"
                          >
                            <FiEye className="text-lg" />
                            <span className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              View
                            </span>
                          </button>

                          <button
                            onClick={() => handleGenerateContent(campaign._id)}
                            disabled={generating === campaign._id}
                            className={`flex items-center justify-center p-2 group relative ${
                              generating === campaign._id ?
                              'bg-gray-100 text-gray-400 cursor-not-allowed' :
                              'bg-green-100 text-green-600 hover:bg-green-200'
                            } rounded-lg transition-colors`}
                            title="Generate Content"
                          >
                            <FiPlay className="text-lg" />
                            <span className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              Generate
                            </span>
                          </button>

                          <button
                            onClick={() => navigate(`/campaign/${campaign._id}`)}
                            className="flex items-center justify-center p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors group relative"
                            title="Edit Campaign"
                          >
                            <FiEdit className="text-lg" />
                            <span className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              Edit
                            </span>
                          </button>

                          <button
                            onClick={() => handleDeleteCampaign(campaign._id)}
                            className="flex items-center justify-center p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors group relative"
                            title="Delete Campaign"
                          >
                            <FiTrash2 className="text-lg" />
                            <span className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              Delete
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName="rounded-lg shadow-xl"
        progressStyle={{ background: 'linear-gradient(to right, #4f46e5, #7c3aed)' }}
      />
    </div>
  );
};

export default SavedCampaigns;