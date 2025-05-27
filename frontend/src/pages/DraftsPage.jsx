import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaImage,
  FaSpinner,
  FaTrash,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaPaperPlane
} from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DraftsPage = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeSlideIndex, setActiveSlideIndex] = useState({});
  const limit = 9;

  useEffect(() => {
    const fetchDrafts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/get-drafts/?page=${page}&limit=${limit}`
        );
        if (response.data.status === "success") {
          setDrafts(response.data.data);
          setTotalPages(response.data.pages);

          // Initialize slide indexes for all carousels
          const indexes = {};
          response.data.data.forEach(draft => {
            if (draft.is_carousel && Array.isArray(draft.image_url)) {
              indexes[draft._id] = 0;
            }
          });
          setActiveSlideIndex(indexes);
        } else {
          throw new Error(response.data.message || "Failed to fetch drafts");
        }
      } catch (error) {
        console.error("Error fetching drafts:", error);
        toast.error(error.message || "Failed to load drafts", {
          position: "top-center",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDrafts();
  }, [page]);

  const handleDeleteDraft = async (draftId) => {
    const toastId = toast.loading("Deleting draft...", {
      position: "top-center",
    });
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/delete-draft/${draftId}`);
      if (response.data.status === "success") {
        setDrafts(drafts.filter((draft) => draft._id !== draftId));
        toast.update(toastId, {
          render: "Draft deleted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        throw new Error(response.data.message || "Failed to delete draft");
      }
    } catch (error) {
      console.error("Error deleting draft:", error);
      toast.update(toastId, {
        render: error.message || "Failed to delete draft",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleNextSlide = (draftId) => {
    setActiveSlideIndex(prev => {
      const currentIndex = prev[draftId] || 0;
      const draft = drafts.find(d => d._id === draftId);
      if (!draft || !Array.isArray(draft.image_url)) return prev;

      const maxIndex = draft.image_url.length - 1;
      return {
        ...prev,
        [draftId]: currentIndex < maxIndex ? currentIndex + 1 : currentIndex
      };
    });
  };

  const handlePrevSlide = (draftId) => {
    setActiveSlideIndex(prev => ({
      ...prev,
      [draftId]: Math.max(0, (prev[draftId] || 0) - 1)
    }));
  };

 const getImageUrl = (draft) => {
  if (!draft.image_url) return null;

  // Handle case where image_url is a string
  if (typeof draft.image_url === 'string') {
    return draft.image_url;
  }

  // Handle case where image_url is an array
  if (Array.isArray(draft.image_url)) {
    if (draft.is_carousel) {
      const currentIndex = activeSlideIndex[draft._id] || 0;
      return draft.image_url[currentIndex] || draft.image_url[0];
    }
    return draft.image_url[0]; // Return first image if not marked as carousel
  }

  return null;
};

const isCarousel = (draft) => {
  // Check if it's marked as carousel AND has multiple images
  return draft.is_carousel &&
         Array.isArray(draft.image_url) &&
         draft.image_url.length > 1;
};

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastId="drafts-toast"
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Your Drafts</h1>
                <p className="text-gray-500 mt-1">Manage your saved posts</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-full bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  <FaChevronLeft className="text-gray-600" />
                </button>
                <button
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-full bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  <FaChevronRight className="text-gray-600" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
              </div>
            ) : drafts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <FaImage className="mx-auto text-5xl text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">No drafts found</h3>
                <p className="text-gray-500 mt-2">
                  Create some drafts and they'll appear here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {drafts.map((draft) => {
                  const currentImage = getImageUrl(draft);
                  const isCarousel = draft.is_carousel && Array.isArray(draft.image_url) && draft.image_url.length > 1;
                  const currentIndex = activeSlideIndex[draft._id] || 0;

                  return (
                    <div
                      key={draft._id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group"
                    >
                      {/* Image section */}
                      <div className="relative h-48 bg-gray-100">
                        {currentImage ? (
                          <>
                            <img
                              src={currentImage}
                              alt="Draft preview"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
                              }}
                            />
                            {isCarousel && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrevSlide(draft._id);
                                  }}
                                  disabled={currentIndex === 0}
                                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md z-10 hover:bg-white disabled:opacity-30 transition-all duration-200"
                                >
                                  <FaChevronLeft className="text-gray-700 text-sm" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNextSlide(draft._id);
                                  }}
                                  disabled={currentIndex === draft.image_url.length - 1}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md z-10 hover:bg-white disabled:opacity-30 transition-all duration-200"
                                >
                                  <FaChevronRight className="text-gray-700 text-sm" />
                                </button>
                                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                                  {draft.image_url.map((_, index) => (
                                    <div
                                      key={index}
                                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                        currentIndex === index ? 'bg-blue-600 w-4' : 'bg-white/70'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaImage className="text-gray-400 text-4xl" />
                          </div>
                        )}
                      </div>

                      {/* Content section */}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mb-2 capitalize">
                              {draft.platform}
                            </span>
                            {isCarousel && (
                              <span className="inline-block ml-2 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                {draft.image_url.length} images
                              </span>
                            )}
                          </div>
                          <button className="text-gray-400 hover:text-gray-600 transition">
                            <BsThreeDotsVertical />
                          </button>
                        </div>

                        <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                          {draft.caption || "No caption"}
                        </p>

                        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {new Date(draft.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                toast.info("Posting functionality coming soon!", {
                                  position: "top-center",
                                  autoClose: 2000,
                                });
                              }}
                              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                              title="Post now"
                            >
                              <FaPaperPlane className="text-xs" />
                            </button>
                            <button
                              onClick={() => {
                                toast.info("Scheduling functionality coming soon!", {
                                  position: "top-center",
                                  autoClose: 2000,
                                });
                              }}
                              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                              title="Schedule"
                            >
                              <FaCalendarAlt className="text-xs" />
                            </button>
                            <button
                              onClick={() => handleDeleteDraft(draft._id)}
                              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-red-500 transition"
                              title="Delete"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DraftsPage;