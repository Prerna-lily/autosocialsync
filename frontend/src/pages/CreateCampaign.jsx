// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// import Navbar from '../components/Navbar';
// import { FaCalendarAlt, FaRobot, FaMagic, FaFileSignature } from 'react-icons/fa';
//
// export default function CreateCampaign() {
//   const [formData, setFormData] = useState({
//     name: '',
//     theme: '',
//     count: 1,
//     startDate: '',
//     endDate: '',
//   });
//
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();
//
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === 'count' ? parseInt(value, 10) || 1 : value,
//     }));
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//
//     const { name, theme, count, startDate, endDate } = formData;
//
//     if (name.length < 3) return setError('Campaign name must be at least 3 characters.');
//     if (theme.length < 3) return setError('Theme must be at least 3 characters.');
//     if (count < 1 || count > 50) return setError('Number of posts must be between 1 and 50.');
//     if (!startDate || !endDate) return setError('Please select both start and end dates.');
//
//     try {
//       setLoading(true);
//
//       const response = await fetch('http://127.0.0.1:8000/api/plan-campaign/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//
//       if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
//       const data = await response.json();
//
//       if (data && data.content) {
//         setSuccess('Campaign generated successfully!');
//         navigate('/campaign', { state: { campaignData: data.content } });
//       } else {
//         throw new Error('Invalid response structure.');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Error generating campaign. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-[Poppins]">
//       <Sidebar />
//       <div className="flex flex-col flex-1">
//         <Navbar />
//         <div className="p-8">
//           <div className="flex items-center gap-3 mb-6">
//             <FaMagic className="text-blue-600 text-3xl" />
//             <h1 className="text-3xl font-semibold text-gray-800">Create AI Campaign</h1>
//           </div>
//
//           <form
//             onSubmit={handleSubmit}
//             className="space-y-6 bg-white p-8 rounded-lg shadow-lg max-w-2xl"
//           >
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
//                 <FaFileSignature className="text-blue-500" /> Campaign Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="mt-2 block w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter campaign name"
//                 required
//               />
//             </div>
//
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
//                 <FaRobot className="text-purple-500" /> Theme
//               </label>
//               <input
//                 type="text"
//                 name="theme"
//                 value={formData.theme}
//                 onChange={handleChange}
//                 className="mt-2 block w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 placeholder="e.g., AI in Marketing"
//                 required
//               />
//             </div>
//
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
//                 <FaRobot className="text-green-500" /> Number of Posts
//               </label>
//               <input
//                 type="number"
//                 name="count"
//                 value={formData.count}
//                 onChange={handleChange}
//                 className="mt-2 block w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//                 min="1"
//                 max="50"
//                 required
//               />
//             </div>
//
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
//                   <FaCalendarAlt className="text-red-500" /> Start Date
//                 </label>
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={formData.startDate}
//                   onChange={handleChange}
//                   className="mt-2 block w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
//                   required
//                 />
//               </div>
//
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
//                   <FaCalendarAlt className="text-indigo-500" /> End Date
//                 </label>
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={formData.endDate}
//                   onChange={handleChange}
//                   className="mt-2 block w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   required
//                 />
//               </div>
//             </div>
//
//             {error && <p className="text-red-500 text-sm">{error}</p>}
//             {success && <p className="text-green-600 text-sm">{success}</p>}
//
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-blue-600 w-full text-white px-6 py-3 rounded hover:bg-blue-700 transition font-semibold shadow-md"
//             >
//               {loading ? 'Generating...' : 'Generate Campaign'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { FaCalendarAlt, FaRobot, FaMagic, FaFileSignature, FaLightbulb, FaRocket } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateCampaign() {
  const [formData, setFormData] = useState({
    name: '',
    theme: '',
    count: 1,
    startDate: '',
    endDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'count' ? parseInt(value, 10) || 1 : value,
    }));
  };

  const validateForm = () => {
    const { name, theme, count, startDate, endDate } = formData;

    if (name.length < 3) {
      toast.error('Campaign name must be at least 3 characters.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return false;
    }

    if (theme.length < 3) {
      toast.error('Theme must be at least 3 characters.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return false;
    }

    if (count < 1 || count > 50) {
      toast.error('Number of posts must be between 1 and 50.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return false;
    }

    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return false;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('End date must be after start date.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setProgress(0);

      // Simulate progress (in a real app, you might update this based on actual progress)
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      const response = await fetch('http://127.0.0.1:8000/api/plan-campaign/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
      const data = await response.json();

      setProgress(100);

      if (data && data.content) {
        toast.success('Campaign generated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setTimeout(() => {
          navigate('/campaign', { state: { campaignData: data.content } });
        }, 1500);
      } else {
        throw new Error('Invalid response structure.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error generating campaign. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-[Poppins]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <div className="p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
                <FaMagic className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Create AI Campaign</h1>
                <p className="text-gray-600">Generate a complete content campaign with AI</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <FaFileSignature className="text-blue-500" /> Campaign Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="e.g., Summer Marketing Blitz"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <FaLightbulb className="text-yellow-500" /> Campaign Theme
                      </label>
                      <input
                        type="text"
                        name="theme"
                        value={formData.theme}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-200"
                        placeholder="e.g., AI in Digital Marketing"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">Describe the main topic or focus of your campaign</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <FaRobot className="text-purple-500" /> Number of Posts
                      </label>
                      <input
                        type="number"
                        name="count"
                        value={formData.count}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                        min="1"
                        max="50"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">Between 1 and 50 posts</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          <FaCalendarAlt className="text-red-500" /> Start Date
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          <FaCalendarAlt className="text-green-500" /> End Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    {loading ? 'Generating...' : 'Generate Campaign'}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaMagic className="text-indigo-500" /> Campaign Tips
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Naming Your Campaign</h4>
                      <p className="text-sm text-blue-700">Choose a descriptive name that reflects your campaign's purpose and makes it easy to identify later.</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-2">Theme Selection</h4>
                      <p className="text-sm text-purple-700">Be specific with your theme. Instead of "Marketing", try "AI-Powered Social Media Marketing Strategies".</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Post Count</h4>
                      <p className="text-sm text-green-700">For best results, aim for 10-20 posts for a 2-week campaign. More posts may dilute quality.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300 ease-out">
          <div className="bg-white/90 p-8 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <FaRocket className="text-white text-3xl animate-bounce" />
                </div>
                <div className="absolute -inset-2 border-4 border-indigo-200 rounded-full animate-ping opacity-75"></div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">Crafting Your Campaign</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Our AI is analyzing your requirements and generating high-quality content tailored to your needs.
              </p>

              <div className="w-full mb-4">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
              </div>

              <div className="flex space-x-2 mt-2">
                {['Generating ideas', 'Writing content', 'Optimizing', 'Finalizing'].map((step, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      progress > index * 25
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
        theme="light"
      />
    </div>
  );
}