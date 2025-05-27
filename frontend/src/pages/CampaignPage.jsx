// import React, { useState, useRef, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// import Navbar from '../components/Navbar';
// import { FiDownload, FiCheck, FiX } from 'react-icons/fi';
// import { jsPDF } from 'jspdf';
// import axios from 'axios';
//
// const CampaignPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const campaignData = location.state?.campaignData;
//   const campaignId = location.pathname.split('/').pop();
//   const [isLoadedCampaign, setIsLoadedCampaign] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//
//   const [campaignName, setCampaignName] = useState(campaignData?.name || 'Campaign');
//   const [posts, setPosts] = useState([]);
//   const [originalPosts, setOriginalPosts] = useState({});
//   const [isSaving, setIsSaving] = useState(false);
//   const contentRefs = useRef({});
//
//   const cleanText = (text) => {
//     if (!text) return '';
//     return text.replace(/\*\*/g, '').replace(/#+\s*/g, '').trim();
//   };
//
// useEffect(() => {
//   if (campaignId && campaignId !== 'campaign') {
//     const loadCampaign = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axios.get(`http://localhost:8000/api/campaign-schedules/get-campaign/${campaignId}`);
//
//         if (response.data) {
//           const loadedCampaign = response.data;
//
//           setPosts(loadedCampaign.posts.map((post, idx) => ({
//             id: idx + 1,
//             title: post.title,
//             type: post.type,
//             schedule: post.schedule,
//             description: post.description,
//             cta: post.cta,
//             isEditing: false,
//           })));
//
//           setCampaignName(loadedCampaign.campaign_name || 'Campaign');
//           setIsLoadedCampaign(true);
//         } else {
//           throw new Error('Empty response from server');
//         }
//       } catch (error) {
//         console.error('Error loading campaign:', error);
//         alert(`Failed to load campaign: ${error.response?.data?.detail || error.message}`);
//         navigate('/campaigns'); // Redirect to campaigns list
//       } finally {
//         setIsLoading(false);
//       }
//     };
//
//     loadCampaign();
//   } else if (campaignData) {
//     // Handle new campaign data from location state
//     const rawContent = typeof campaignData?.raw === 'string'
//       ? campaignData.raw
//       : campaignData?.raw?.raw;
//
//     const raw = cleanText(rawContent);
//     const postSections = raw.split(/Post \d+/).map((s) => s.trim()).filter(Boolean);
//     const validPosts = postSections.filter((section) => section.includes('1. What to Post'));
//
//     const initialPosts = validPosts.map((section, idx) => {
//       const lines = section.split('\n').filter(Boolean);
//       const getField = (label) =>
//         lines.find((line) => line.startsWith(label))?.split(':')?.slice(1).join(':')?.trim() || '';
//
//       const descIndex = lines.findIndex((line) => line.startsWith('4. Description:'));
//       const description =
//         descIndex !== -1
//           ? lines.slice(descIndex).join('\n').replace('4. Description:', '').trim()
//           : '';
//
//       return {
//         id: idx + 1,
//         title: getField('1. What to Post'),
//         type: getField('2. Type of Post'),
//         schedule: getField('3. Posting Schedule'),
//         description,
//         cta: getField('5. Call-to-Action'),
//         isEditing: false,
//       };
//     });
//
//     setPosts(initialPosts);
//     setCampaignName(campaignData?.name || 'Campaign');
//   }
// }, [campaignId, campaignData, navigate]);
//
//   const toggleEdit = (id) => {
//     setPosts((prev) =>
//       prev.map((post) =>
//         post.id === id
//           ? {
//               ...post,
//               isEditing: true,
//             }
//           : post
//       )
//     );
//
//     setOriginalPosts((prev) => ({
//       ...prev,
//       [id]: posts.find((p) => p.id === id),
//     }));
//   };
//
//   const handleDiscard = (id) => {
//     const original = originalPosts[id];
//     if (original) {
//       setPosts((prev) =>
//         prev.map((post) => (post.id === id ? { ...original, isEditing: false } : post))
//       );
//     }
//   };
//
//   const handleAccept = (id) => {
//     const card = contentRefs.current[id];
//     if (card) {
//       const getText = (selector, prefix) => {
//         const raw = card.querySelector(selector)?.innerText || '';
//         if (!raw.includes(prefix)) return raw.trim();
//         return raw.replace(prefix, '').trim();
//       };
//
//       const updatedPost = {
//         title: getText('[data-field="title"]', '📌'),
//         type: getText('[data-field="type"]', '📝 Type:'),
//         schedule: getText('[data-field="schedule"]', '📅 Schedule:'),
//         description: getText('[data-field="description"]', '🧾 Description:'),
//         cta: getText('[data-field="cta"]', '🔗'),
//       };
//
//       setPosts((prev) =>
//         prev.map((post) =>
//           post.id === id ? { ...post, ...updatedPost, isEditing: false } : post
//         )
//       );
//     }
//   };
//
//   const handleSaveSchedule = async () => {
//     const hasEmptyFields = posts.some(
//       (post) =>
//         !post.title || !post.type || !post.schedule || !post.description || !post.cta
//     );
//
//     if (hasEmptyFields) {
//       alert('⚠️ Please fill in all fields before saving the schedule.');
//       return;
//     }
//
//     setIsSaving(true);
//     try {
//       const payload = {
//         campaignName: campaignName,
//         theme: campaignData?.theme || '',
//         posts: posts.map((post) => ({
//           title: post.title,
//           type: post.type,
//           schedule: post.schedule,
//           description: post.description,
//           cta: post.cta,
//         })),
//         startDate: campaignData?.dates?.[0] || '',
//         endDate: campaignData?.dates?.slice(-1)[0] || '',
//       };
//
//       const response = await axios.post('http://localhost:8000/api/save-campaign/', payload, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//
//       if (response.status === 200 || response.status === 201) {
//         alert('✅ Campaign schedule saved successfully!');
//         navigate(`/saved-campaigns`);
//
//       } else {
//         alert('⚠️ Failed to save campaign schedule.');
//       }
//     } catch (error) {
//       console.error('Error saving campaign:', error);
//       if (error.response) {
//         alert(`❌ Error saving campaign: ${error.response.data.detail || error.response.statusText}`);
//       } else {
//         alert('❌ Error saving campaign schedule.');
//       }
//     } finally {
//       setIsSaving(false);
//     }
//   };
//
//   const handleDownloadPDF = () => {
//     const postCount = posts.length;
//     const dates = isLoadedCampaign
//       ? posts.map(post => post.schedule)
//       : campaignData?.dates || [];
//
//     let metadata = `📅 Campaign Schedule\n\n`;
//     metadata += `Total Posts: ${postCount}\n`;
//     if (dates.length) {
//       metadata += `Post Dates:\n${dates.map((d, i) => `- Post ${i + 1}: ${d}`).join('\n')}\n`;
//     }
//
//     const content = posts
//       .map(
//         (post, idx) => `
// Post ${idx + 1}
// 1. What to Post: ${post.title}
// 2. Type of Post: ${post.type}
// 3. Posting Schedule: ${post.schedule}
// 4. Description:
// ${post.description}
// 5. Call-to-Action: ${post.cta}
//     `
//       )
//       .join('\n\n');
//
//     const doc = new jsPDF();
//     const pageHeight = doc.internal.pageSize.height;
//     const marginTop = 20;
//     const lineHeight = 7;
//     const lines = doc.splitTextToSize(`${metadata}\n\n${content}`, 180);
//     let cursorY = marginTop;
//
//     doc.setFont('helvetica', 'normal');
//     doc.setFontSize(12);
//
//     lines.forEach((line) => {
//       if (cursorY + lineHeight > pageHeight - 15) {
//         doc.addPage();
//         cursorY = marginTop;
//       }
//       doc.text(line, 15, cursorY);
//       cursorY += lineHeight;
//     });
//
//     doc.save(`${campaignName.replace(/\s+/g, '_')}_schedule.pdf`);
//   };
//
//   return (
//     <div className="flex bg-gray-100 min-h-screen font-[Inter]">
//       {/* Sidebar */}
//       <div className="w-[250px] fixed top-0 left-0 bottom-0 z-20 bg-white shadow-lg">
//         <Sidebar />
//       </div>
//
//       {/* Main Content */}
//       <div className="flex flex-col flex-1 ml-[250px]">
//         <Navbar />
//
//         <main className="flex-1 overflow-y-auto p-8">
//           <div className="max-w-6xl mx-auto">
//             <h1 className="text-4xl font-bold text-gray-800 mb-8">
//               🎯 {campaignName} Schedule
//               {isLoadedCampaign && <span className="text-sm ml-2 text-gray-500">(Saved Campaign)</span>}
//             </h1>
//
//             {isLoading ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {posts.map((post) => (
//                   <div
//                     key={post.id}
//                     ref={(el) => (contentRefs.current[post.id] = el)}
//                     className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
//                   >
//                     <h2 className="text-lg font-bold text-pink-600 mb-2">
//                       💌 Post {post.id}
//                     </h2>
//
//                     <div
//                       data-field="title"
//                       contentEditable={post.isEditing}
//                       suppressContentEditableWarning={true}
//                       className="text-md font-semibold text-gray-800 mb-1"
//                       id={`post-${post.id}-title`}
//                       name={`post-${post.id}-title`}
//                     >
//                       {post.isEditing ? post.title : <>📌 {post.title}</>}
//                     </div>
//
//                     <div
//                       data-field="schedule"
//                       contentEditable={post.isEditing}
//                       suppressContentEditableWarning={true}
//                       className="text-sm text-gray-600 mb-1"
//                       id={`post-${post.id}-schedule`}
//                       name={`post-${post.id}-schedule`}
//                     >
//                       {post.isEditing ? post.schedule : <>📅 <strong>Schedule:</strong> {post.schedule}</>}
//                     </div>
//
//                     <div
//                       data-field="type"
//                       contentEditable={post.isEditing}
//                       suppressContentEditableWarning={true}
//                       className="text-sm text-gray-600 mb-1"
//                       id={`post-${post.id}-type`}
//                       name={`post-${post.id}-type`}
//                     >
//                       {post.isEditing ? post.type : <>📝 <strong>Type:</strong> {post.type}</>}
//                     </div>
//
//                     <div
//                       data-field="description"
//                       contentEditable={post.isEditing}
//                       suppressContentEditableWarning={true}
//                       className="text-sm text-gray-700 whitespace-pre-wrap mb-2"
//                       id={`post-${post.id}-description`}
//                       name={`post-${post.id}-description`}
//                     >
//                       {post.isEditing ? post.description : (
//                         <>
//                           🧾 <strong>Description:</strong>
//                           <br />
//                           {post.description}
//                         </>
//                       )}
//                     </div>
//
//                     <div
//                       data-field="cta"
//                       contentEditable={post.isEditing}
//                       suppressContentEditableWarning={true}
//                       className="text-sm text-purple-600 font-medium"
//                       id={`post-${post.id}-cta`}
//                       name={`post-${post.id}-cta`}
//                     >
//                       {post.isEditing ? post.cta : <>🔗 {post.cta}</>}
//                     </div>
//
//                     <div className="flex mt-4 gap-3">
//                       {post.isEditing ? (
//                         <>
//                           <button
//                             onClick={() => handleAccept(post.id)}
//                             className="flex items-center gap-2 border border-emerald-600 text-emerald-700 font-medium px-4 py-2 rounded-full hover:bg-emerald-100 transition-all duration-200"
//                           >
//                             <FiCheck className="text-md" />
//                             Accept
//                           </button>
//                           <button
//                             onClick={() => handleDiscard(post.id)}
//                             className="flex items-center gap-2 border border-rose-600 text-rose-700 font-medium px-4 py-2 rounded-full hover:bg-rose-100 transition-all duration-200"
//                           >
//                             <FiX className="text-md" />
//                             Discard
//                           </button>
//                         </>
//                       ) : (
//                         <button
//                           onClick={() => toggleEdit(post.id)}
//                           className="flex items-center gap-2 border border-blue-600 text-blue-700 font-medium px-4 py-2 rounded-full hover:bg-blue-100 transition-all duration-200"
//                         >
//                           ✏️ Edit
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </main>
//
//         {/* Sticky Footer */}
//         <footer className="sticky bottom-0 bg-white border-t py-4 px-8 shadow-inner z-10">
//           <div className="max-w-6xl mx-auto flex justify-between items-center">
//             <button
//               onClick={handleDownloadPDF}
//               className="flex items-center gap-2 border border-gray-700 text-gray-700 font-medium px-5 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
//             >
//               <FiDownload className="text-lg" />
//               Download as PDF
//             </button>
//
//             <button
//               disabled={isSaving}
//               onClick={handleSaveSchedule}
//               className={`flex items-center gap-2 border border-emerald-600 text-emerald-700 font-medium px-5 py-2 rounded-full transition-all duration-200 ${
//                 isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-100'
//               }`}
//             >
//               <FiCheck className="text-lg" />
//               {isSaving ? 'Saving...' : 'Save Schedule'}
//             </button>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };
//
// export default CampaignPage;

import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { FiDownload, FiCheck, FiX, FiEdit2, FiSave, FiShare2, FiCalendar, FiCopy } from 'react-icons/fi';
import { FaRegLightbulb, FaRegClock, FaRegStickyNote, FaRegHandPointer } from 'react-icons/fa';
import { RiMagicLine } from 'react-icons/ri';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CampaignPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const campaignData = location.state?.campaignData;
  const campaignId = location.pathname.split('/').pop();
  const [isLoadedCampaign, setIsLoadedCampaign] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const [campaignName, setCampaignName] = useState(campaignData?.name || 'Campaign');
  const [posts, setPosts] = useState([]);
  const [originalPosts, setOriginalPosts] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const contentRefs = useRef({});

  const cleanText = (text) => {
    if (!text) return '';
    return text.replace(/\*\*/g, '').replace(/#+\s*/g, '').trim();
  };

useEffect(() => {
  if (campaignId && campaignId !== 'campaign') {
    const loadCampaign = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/get-campaign/${campaignId}`);

        if (response.data) {
          const loadedCampaign = response.data;

          setPosts(loadedCampaign.posts.map((post, idx) => ({
            id: idx + 1,
            title: post.title,
            type: post.type,
            schedule: post.schedule,
            description: post.description,
            cta: post.cta,
            isEditing: false,
          })));

          setCampaignName(loadedCampaign.campaign_name || 'Campaign');
          setIsLoadedCampaign(true);
        } else {
          throw new Error('Empty response from server');
        }
      } catch (error) {
        console.error('Error loading campaign:', error);
        toast.error(`Failed to load campaign: ${error.response?.data?.detail || error.message}`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        navigate('/campaigns');
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaign();
  } else if (campaignData) {
    // Handle new campaign data from location state
    const rawContent = typeof campaignData?.raw === 'string'
      ? campaignData.raw
      : campaignData?.raw?.raw;

    const raw = cleanText(rawContent);
    const postSections = raw.split(/Post \d+/).map((s) => s.trim()).filter(Boolean);
    const validPosts = postSections.filter((section) => section.includes('1. What to Post'));

    const initialPosts = validPosts.map((section, idx) => {
      const lines = section.split('\n').filter(Boolean);
      const getField = (label) =>
        lines.find((line) => line.startsWith(label))?.split(':')?.slice(1).join(':')?.trim() || '';

      const descIndex = lines.findIndex((line) => line.startsWith('4. Description:'));
      const description =
        descIndex !== -1
          ? lines.slice(descIndex).join('\n').replace('4. Description:', '').trim()
          : '';

      return {
        id: idx + 1,
        title: getField('1. What to Post'),
        type: getField('2. Type of Post'),
        schedule: getField('3. Posting Schedule'),
        description,
        cta: getField('5. Call-to-Action'),
        isEditing: false,
      };
    });

    setPosts(initialPosts);
    setCampaignName(campaignData?.name || 'Campaign');
  }
}, [campaignId, campaignData, navigate]);


  const toggleEdit = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              isEditing: true,
            }
          : post
      )
    );

    setOriginalPosts((prev) => ({
      ...prev,
      [id]: posts.find((p) => p.id === id),
    }));
  };

  const handleDiscard = (id) => {
    const original = originalPosts[id];
    if (original) {
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? { ...original, isEditing: false } : post))
      );
      toast.info('Changes discarded', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  const handleAccept = (id) => {
    const card = contentRefs.current[id];
    if (card) {
      const getText = (selector, prefix) => {
        const raw = card.querySelector(selector)?.innerText || '';
        if (!raw.includes(prefix)) return raw.trim();
        return raw.replace(prefix, '').trim();
      };

      const updatedPost = {
        title: getText('[data-field="title"]', '📌'),
        type: getText('[data-field="type"]', '📝 Type:'),
        schedule: getText('[data-field="schedule"]', '📅 Schedule:'),
        description: getText('[data-field="description"]', '🧾 Description:'),
        cta: getText('[data-field="cta"]', '🔗'),
      };

      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, ...updatedPost, isEditing: false } : post
        )
      );
      toast.success('Changes saved', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

const handleSaveSchedule = async () => {
  const hasEmptyFields = posts.some(
    (post) =>
      !post.title || !post.type || !post.schedule || !post.description || !post.cta
  );

  if (hasEmptyFields) {
    toast.warning('Please fill in all fields before saving the schedule', {
      position: "bottom-right",
      autoClose: 5000,
      theme: "colored",
    });
    return;
  }

  setIsSaving(true);
  try {
    const payload = {
      campaignName: campaignName,
      theme: campaignData?.theme || '',
      posts: posts.map((post) => ({
        title: post.title,
        type: post.type,
        schedule: post.schedule,
        description: post.description,
        cta: post.cta,
      })),
      startDate: campaignData?.startDate || '',
      endDate: campaignData?.endDate || '',
    };

    const response = await axios.post('http://localhost:8000/api/save-campaign/', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200 || response.status === 201) {
      toast.success('Campaign saved successfully!', {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });
      setTimeout(() => {
        navigate('/saved-campaigns');
      }, 1500);
    } else {
      throw new Error('Failed to save campaign schedule');
    }
  } catch (error) {
    console.error('Error saving campaign:', error);
    toast.error(
      `Error saving campaign: ${error.response?.data?.detail || error.message}`,
      {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
      }
    );
  } finally {
    setIsSaving(false);
  }
};

  const handleDownloadPDF = () => {
    const postCount = posts.length;
    const dates = isLoadedCampaign
      ? posts.map(post => post.schedule)
      : campaignData?.dates || [];

    let metadata = `📅 Campaign Schedule\n\n`;
    metadata += `Total Posts: ${postCount}\n`;
    if (dates.length) {
      metadata += `Post Dates:\n${dates.map((d, i) => `- Post ${i + 1}: ${d}`).join('\n')}\n`;
    }

    const content = posts
      .map(
        (post, idx) => `
Post ${idx + 1}
1. What to Post: ${post.title}
2. Type of Post: ${post.type}
3. Posting Schedule: ${post.schedule}
4. Description:
${post.description}
5. Call-to-Action: ${post.cta}
    `
      )
      .join('\n\n');

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const marginTop = 20;
    const lineHeight = 7;
    const lines = doc.splitTextToSize(`${metadata}\n\n${content}`, 180);
    let cursorY = marginTop;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    lines.forEach((line) => {
      if (cursorY + lineHeight > pageHeight - 15) {
        doc.addPage();
        cursorY = marginTop;
      }
      doc.text(line, 15, cursorY);
      cursorY += lineHeight;
    });

    doc.save(`${campaignName.replace(/\s+/g, '_')}_schedule.pdf`);
    toast.success('PDF downloaded successfully!', {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      theme: "colored",
    });
  };

  const generateShareLink = async () => {
    setIsSharing(true);
    try {
      // In a real app, you would generate a shareable link from your backend
      const mockLink = `https://yourdomain.com/share/${campaignId || 'new'}`;
      setShareLink(mockLink);

      // Copy to clipboard
      await navigator.clipboard.writeText(mockLink);
      toast.success('Share link copied to clipboard!', {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });
    } catch (error) {
      console.error('Error generating share link:', error);
      toast.error('Failed to generate share link', {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!', {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard', {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

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
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                    <RiMagicLine className="text-white text-2xl" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {campaignName}
                      </span>
                    </h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isLoadedCampaign ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isLoadedCampaign ? 'Saved Campaign' : 'New Campaign'}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="flex items-center gap-1">
                        <FaRegClock className="text-gray-400" />
                        {posts.length} posts
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={generateShareLink}
                  disabled={isSharing}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiShare2 className="text-lg" />
                  {isSharing ? 'Generating...' : 'Share'}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiDownload className="text-lg" />
                  Export
                </button>
              </div>
            </div>

            {/* Share Link Modal */}
            {shareLink && (
              <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FiShare2 className="text-indigo-600 flex-shrink-0" />
                  <p className="text-indigo-800 truncate">{shareLink}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(shareLink)}
                  className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-200 transition-colors"
                >
                  <FiCopy className="text-sm" />
                  <span className="text-sm">Copy</span>
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
                  <RiMagicLine className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600 text-2xl" />
                </div>
                <p className="text-gray-600 mt-4">Loading your campaign details...</p>
                <p className="text-gray-400 text-sm mt-1">This won't take long</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-64 h-48 mb-6 flex items-center justify-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                  <RiMagicLine className="text-indigo-400 text-5xl" />
                </div>
                <h3 className="text-xl font-medium text-gray-700">No posts found</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                  It looks like this campaign doesn't have any posts yet. Try creating a new campaign.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    ref={(el) => (contentRefs.current[post.id] = el)}
                    className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md ${
                      post.isEditing ? 'ring-2 ring-indigo-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center mr-3">
                          <span className="text-indigo-600 font-medium">{post.id}</span>
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-800">
                            {post.title || 'Untitled Post'}
                          </h2>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              {post.type || 'No type specified'}
                            </span>
                            {post.isEditing && (
                              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                Editing
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`${post.title}\n\n${post.description}`)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy post content"
                      >
                        <FiCopy className="text-sm" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <FaRegClock className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                        <div
                          data-field="schedule"
                          contentEditable={post.isEditing}
                          suppressContentEditableWarning={true}
                          className={`flex-1 ${post.isEditing ? 'bg-gray-50 px-3 py-2 rounded-lg border border-gray-200' : ''}`}
                        >
                          {post.schedule || 'No schedule specified'}
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FaRegStickyNote className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                        <div
                          data-field="description"
                          contentEditable={post.isEditing}
                          suppressContentEditableWarning={true}
                          className={`flex-1 whitespace-pre-wrap ${post.isEditing ? 'bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 min-h-[100px]' : 'text-gray-700'}`}
                        >
                          {post.description || 'No description provided'}
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FaRegHandPointer className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                        <div
                          data-field="cta"
                          contentEditable={post.isEditing}
                          suppressContentEditableWarning={true}
                          className={`flex-1 ${post.isEditing ? 'bg-gray-50 px-3 py-2 rounded-lg border border-gray-200' : 'text-indigo-600 font-medium'}`}
                        >
                          {post.cta || 'No call-to-action'}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-5 gap-2">
                      {post.isEditing ? (
                        <>
                          <button
                            onClick={() => handleAccept(post.id)}
                            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200"
                          >
                            <FiCheck className="text-md" />
                            Save
                          </button>
                          <button
                            onClick={() => handleDiscard(post.id)}
                            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                          >
                            <FiX className="text-md" />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => toggleEdit(post.id)}
                          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                        >
                          <FiEdit2 className="text-md" />
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Enhanced Sticky Footer */}
        {!isLoading && posts.length > 0 && (
          <footer className="sticky bottom-0 bg-white border-t border-gray-200 py-4 px-8 shadow-sm z-10">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                  <FaRegLightbulb className="text-indigo-500" />
                  <span>Tip: Click on any field to edit content</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(posts, null, 2))}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
                  title="Copy all posts as JSON"
                >
                  <FiCopy className="text-md" />
                  Copy JSON
                </button>
                <button
                  onClick={handleSaveSchedule}
                  disabled={isSaving}
                  className={`flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                    isSaving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <FiSave className="text-lg" />
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-pulse">Saving</span>
                    </span>
                  ) : (
                    'Save Campaign'
                  )}
                </button>
              </div>
            </div>
          </footer>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
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

export default CampaignPage;