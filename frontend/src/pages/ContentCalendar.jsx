import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiEdit2, FiTrash2, FiShare2, FiCopy, FiDownload } from "react-icons/fi";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FiPlus, FiClock, FiChevronLeft, FiChevronRight, FiFilter, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { saveAs } from 'file-saver';
import ReactPlayer from 'react-player';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const localizer = momentLocalizer(moment);
const API_URL = "http://127.0.0.1:8000/api/scheduled-posts";

const ContentCalendar = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    scheduled: 0,
    published: 0,
    failed: 0
  });
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  const platforms = [
    { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-r from-pink-500 to-purple-600' },
    { id: 'facebook', name: 'Facebook', color: 'bg-gradient-to-r from-blue-600 to-blue-800' },
    { id: 'twitter', name: 'Twitter', color: 'bg-gradient-to-r from-blue-400 to-blue-500' },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-gradient-to-r from-blue-700 to-blue-900' },
    { id: 'tiktok', name: 'TikTok', color: 'bg-gradient-to-r from-black to-gray-800' }
  ];

  const statuses = [
    { id: 'scheduled', name: 'Scheduled', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'published', name: 'Published', color: 'bg-green-100 text-green-800' },
    { id: 'failed', name: 'Failed', color: 'bg-red-100 text-red-800' }
  ];

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
    calculateStats();
  }, [events, selectedPlatforms, selectedStatuses, searchTerm]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_URL);
      const data = response.data;

      if (Array.isArray(data)) {
        const formatted = data.map((post) => ({
          id: post.id,
          title: post.caption.length > 30 ? post.caption.slice(0, 30) + "..." : post.caption,
          start: new Date(post.scheduled_time),
          end: new Date(new Date(post.scheduled_time).getTime() + 30 * 60000),
          allDay: false,
          platform: post.platform,
          caption: post.caption,
          image_url: post.image_url,
          video_url: post.video_url,
          status: post.status || "scheduled",
          is_carousel: post.is_carousel || false,
          media_type: post.media_type || 'image',
          engagement: post.engagement || null,
          link: post.link || null
        }));
        setEvents(formatted);
        setFilteredEvents(formatted);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load scheduled posts");
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvents = () => {
    let result = [...events];

    // Filter by platform
    if (selectedPlatforms.length > 0) {
      result = result.filter(event => selectedPlatforms.includes(event.platform));
    }

    // Filter by status
    if (selectedStatuses.length > 0) {
      result = result.filter(event => selectedStatuses.includes(event.status));
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(event =>
        event.caption.toLowerCase().includes(term) ||
        event.platform.toLowerCase().includes(term) ||
        moment(event.start).format('MMMM Do YYYY, h:mm a').toLowerCase().includes(term)
      );
    }

    setFilteredEvents(result);
  };

  const calculateStats = () => {
    const totalPosts = events.length;
    const scheduled = events.filter(e => e.status === 'scheduled').length;
    const published = events.filter(e => e.status === 'published').length;
    const failed = events.filter(e => e.status === 'failed').length;

    setStats({
      totalPosts,
      scheduled,
      published,
      failed
    });
  };

  // Delete a scheduled post
  const deletePost = async (eventId) => {
    setIsModalLoading(true);
    const toastId = toast.loading("Canceling post...", { position: "top-right" });

    try {
      await axios.delete(`${API_URL}/${eventId}/`);
      setEvents(events.filter((event) => event.id !== eventId));
      toast.update(toastId, {
        render: "Post canceled successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setShowEventModal(false);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.update(toastId, {
        render: "Failed to cancel post. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad";
    let borderColor = "#1a5276";

    if (event.platform === "instagram") {
      backgroundColor = "#E1306C";
      borderColor = "#C13584";
    } else if (event.platform === "facebook") {
      backgroundColor = "#4267B2";
      borderColor = "#365899";
    } else if (event.platform === "twitter") {
      backgroundColor = "#1DA1F2";
      borderColor = "#1A91DA";
    } else if (event.platform === "linkedin") {
      backgroundColor = "#0077B5";
      borderColor = "#006699";
    } else if (event.platform === "tiktok") {
      backgroundColor = "#000000";
      borderColor = "#333333";
    }

    // Add status-based styling
    if (event.status === 'published') {
      backgroundColor = "#10B981";
      borderColor = "#059669";
    } else if (event.status === 'failed') {
      backgroundColor = "#EF4444";
      borderColor = "#DC2626";
    }

    return {
      style: {
        backgroundColor,
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: "4px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        padding: "4px 8px",
        fontSize: "0.875rem",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      },
    };
  };

  const CustomToolbar = ({ label, onNavigate, onView }) => {
    return (
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 p-2 bg-white rounded-lg shadow-sm">
        <div className="flex items-center space-x-2 mb-2 md:mb-0">
          <button
            onClick={() => onNavigate('PREV')}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <FiChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">{label}</h2>
          <button
            onClick={() => onNavigate('NEXT')}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <FiChevronRight size={20} />
          </button>
          <button
            onClick={() => onNavigate('TODAY')}
            className="ml-4 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
          >
            Today
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onView('month')}
            className={`px-3 py-1 text-sm rounded-md ${currentView === 'month' ? 'bg-blue-100 text-blue-600 font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Month
          </button>
          <button
            onClick={() => onView('week')}
            className={`px-3 py-1 text-sm rounded-md ${currentView === 'week' ? 'bg-blue-100 text-blue-600 font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Week
          </button>
          <button
            onClick={() => onView('day')}
            className={`px-3 py-1 text-sm rounded-md ${currentView === 'day' ? 'bg-blue-100 text-blue-600 font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Day
          </button>
          <button
            onClick={() => onView('agenda')}
            className={`px-3 py-1 text-sm rounded-md ${currentView === 'agenda' ? 'bg-blue-100 text-blue-600 font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            List
          </button>
        </div>
      </div>
    );
  };

  const CustomEvent = ({ event }) => {
    return (
      <div className="p-1">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            {event.platform === "instagram" && (
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            )}
            {event.platform === "facebook" && (
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
              </svg>
            )}
            {event.platform === "twitter" && (
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            )}
            {event.platform === "linkedin" && (
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            )}
            {event.platform === "tiktok" && (
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            )}
          </div>
          <div className="ml-1 flex-1">
            <div className="text-xs font-medium truncate">{event.title}</div>
            <div className="text-[10px] opacity-80 mt-0.5">
              {moment(event.start).format("h:mm a")}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getAspectRatio = (platform) => {
    switch (platform?.toLowerCase()) {
      case "instagram":
        return "aspect-[1/1]";
      case "twitter":
        return "aspect-[1.91/1]";
      case "facebook":
        return "aspect-[1.91/1]";
      case "linkedin":
        return "aspect-[1.91/1]";
      case "tiktok":
        return "aspect-[9/16]";
      default:
        return "aspect-[1/1]";
    }
  };

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleStatusToggle = (status) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const downloadMedia = (url) => {
    saveAs(url, `post-media-${selectedEvent.id}`);
    toast.success("Media downloaded successfully");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: `Scheduled post for ${selectedEvent.platform}`,
        text: selectedEvent.caption,
        url: selectedEvent.link || window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
        toast.error("Failed to share post");
      });
    } else {
      copyToClipboard(selectedEvent.link || selectedEvent.caption);
    }
  };

  const renderMedia = () => {
    if (!selectedEvent.image_url && !selectedEvent.video_url) return null;

    if (selectedEvent.is_carousel && Array.isArray(selectedEvent.image_url)) {
      return (
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          className="w-full"
        >
          {selectedEvent.image_url.map((img, index) => (
            <div key={index} className={`${getAspectRatio(selectedEvent.platform)} w-full overflow-hidden rounded-lg`}>
              <img
                src={img}
                alt={`Post media ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </Carousel>
      );
    }

    if (selectedEvent.media_type === 'video' || selectedEvent.video_url) {
      return (
        <div className={`${getAspectRatio(selectedEvent.platform)} w-full overflow-hidden rounded-lg`}>
          <ReactPlayer
            url={selectedEvent.video_url}
            controls
            width="100%"
            height="100%"
          />
        </div>
      );
    }

    return (
      <div className={`${getAspectRatio(selectedEvent.platform)} w-full overflow-hidden rounded-lg`}>
        <img
          src={selectedEvent.image_url}
          alt="Post media"
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 px-4 py-8 overflow-y-auto md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Content Calendar
                </h1>
                <p className="text-gray-600">
                  Visualize and manage all your scheduled posts
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/create-post")}
                className="mt-4 md:mt-0 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <FiPlus className="text-lg" />
                Schedule New Post
              </motion.button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Posts</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalPosts}</h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FiCopy className="text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Scheduled</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.scheduled}</h3>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <FiClock className="text-yellow-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Published</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.published}</h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <FiShare2 className="text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Failed</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.failed}</h3>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <FiX className="text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${showFilters ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
                  >
                    <FiFilter />
                    Filters
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlatforms([]);
                      setSelectedStatuses([]);
                      setSearchTerm('');
                    }}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Platforms</h4>
                    <div className="flex flex-wrap gap-2">
                      {platforms.map(platform => (
                        <button
                          key={platform.id}
                          onClick={() => handlePlatformToggle(platform.id)}
                          className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${selectedPlatforms.includes(platform.id) ? `${platform.color} text-white` : 'bg-gray-100 text-gray-700'}`}
                        >
                          {platform.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map(status => (
                        <button
                          key={status.id}
                          onClick={() => handleStatusToggle(status.id)}
                          className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${selectedStatuses.includes(status.id) ? `${status.color} font-medium` : 'bg-gray-100 text-gray-700'}`}
                        >
                          {status.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Calendar Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {isLoading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-200 animate-spin"></div>
                    <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
                  </div>
                </div>
              ) : (
                <Calendar
                  ref={calendarRef}
                  localizer={localizer}
                  events={filteredEvents}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectEvent={handleSelectEvent}
                  onNavigate={handleNavigate}
                  onView={handleViewChange}
                  view={currentView}
                  date={currentDate}
                  style={{ height: "70vh", padding: "1rem" }}
                  eventPropGetter={eventStyleGetter}
                  components={{
                    event: CustomEvent,
                    toolbar: CustomToolbar,
                  }}
                  popup
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Event Detail Modal */}
{/* Event Detail Modal */}
<AnimatePresence>
  {selectedEvent && showEventModal && (
    <>
      {/* Blur Background Alternative */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        onClick={() => setShowEventModal(false)}
      >
        {/* Blurred overlay - we'll blur this in JavaScript */}
        <div
          className="absolute inset-0 bg-gray-500 opacity-30"
          style={{ filter: 'blur(8px)' }}
        />
      </motion.div>

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Your existing modal content */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Post Details</h2>
            <button
              onClick={() => setShowEventModal(false)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <FiX size={20} />
            </button>
          </div>


          <div className="space-y-4">
            {/* Media Preview */}
            {(selectedEvent.image_url || selectedEvent.video_url) && (
              <div className="rounded-lg overflow-hidden">
                {renderMedia()}
              </div>
            )}

            {/* Platform and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Platform</p>
                <div className="flex items-center">
                  {selectedEvent.platform === "instagram" && (
                    <svg className="h-4 w-4 text-pink-600 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  )}
                  {selectedEvent.platform === "facebook" && (
                    <svg className="h-4 w-4 text-blue-600 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                    </svg>
                  )}
                  {selectedEvent.platform === "twitter" && (
                    <svg className="h-4 w-4 text-blue-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  )}
                  {selectedEvent.platform === "linkedin" && (
                    <svg className="h-4 w-4 text-blue-700 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  )}
                  {selectedEvent.platform === "tiktok" && (
                    <svg className="h-4 w-4 text-black mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  )}
                  <p className="text-gray-800 font-medium capitalize text-sm">{selectedEvent.platform}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                  selectedEvent.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                  selectedEvent.status === 'published' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedEvent.status}
                </div>
              </div>
            </div>

            {/* Scheduled Time */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Scheduled Time</p>
              <div className="flex items-center text-gray-800">
                <FiClock className="mr-1 text-gray-500 h-4 w-4" />
                <p className="font-medium text-sm">
                  {moment(selectedEvent.start).format("MMMM Do YYYY, h:mm a")}
                </p>
              </div>
            </div>

            {/* Engagement Stats (if published) */}
            {selectedEvent.status === 'published' && selectedEvent.engagement && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Engagement</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-blue-600">Likes</p>
                    <p className="font-bold text-blue-800">{selectedEvent.engagement.likes || 0}</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-green-600">Comments</p>
                    <p className="font-bold text-green-800">{selectedEvent.engagement.comments || 0}</p>
                  </div>
                  <div className="bg-purple-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-purple-600">Shares</p>
                    <p className="font-bold text-purple-800">{selectedEvent.engagement.shares || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Caption */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Caption</p>
              <p className="text-gray-800 text-sm bg-gray-50 p-3 rounded-lg">
                {selectedEvent.caption}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 grid grid-cols-3 gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  navigate(`/edit-post/${selectedEvent.id}`);
                }}
                className="flex items-center justify-center gap-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                disabled={isModalLoading}
              >
                <FiEdit2 size={14} />
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => sharePost()}
                className="flex items-center justify-center gap-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
              >
                <FiShare2 size={14} />
                Share
              </motion.button>
              {(selectedEvent.image_url || selectedEvent.video_url) && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => downloadMedia(selectedEvent.image_url || selectedEvent.video_url)}
                  className="flex items-center justify-center gap-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                >
                  <FiDownload size={14} />
                  Save
                </motion.button>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => deletePost(selectedEvent.id)}
              className="w-full flex items-center justify-center gap-1 bg-red-100 text-red-600 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors text-sm mt-2"
              disabled={isModalLoading}
            >
              <FiTrash2 size={14} />
              Cancel Post
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  )}
</AnimatePresence>
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
/>
    </div>
  );
};

export default ContentCalendar;