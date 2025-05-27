import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  FiPlus, FiClock, FiX, FiChevronLeft, FiChevronRight,
  FiCalendar, FiFilter, FiRefreshCw, FiUpload, FiDownload,
  FiShare2, FiUsers, FiBarChart2, FiSettings, FiTag
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Confetti from 'react-confetti';

ChartJS.register(ArcElement, Tooltip, Legend);

const localizer = momentLocalizer(moment);
const API_URL = "http://127.0.0.1:8000/api/scheduled-posts";

const CalendarPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { caption, image_url, platform, is_carousel } = location.state || {};
  const fileInputRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState("all");
  const [stats, setStats] = useState({
    totalPosts: 0,
    byPlatform: {},
    byStatus: {}
  });
  const [showConfetti, setShowConfetti] = useState(false);

  // Platform colors and icons
  const platformData = {
    instagram: { color: "#E1306C", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
    facebook: { color: "#4267B2", icon: "M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" },
    twitter: { color: "#1DA1F2", icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" },
    linkedin: { color: "#0077B5", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" }
  };

  // Status colors
  const statusColors = {
    scheduled: "bg-blue-100 text-blue-800",
    published: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    draft: "bg-yellow-100 text-yellow-800"
  };

  // Fetch scheduled posts and statistics
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [eventsRes, statsRes, teamRes] = await Promise.all([
          axios.get(API_URL),
          axios.get(`${API_URL}/stats`),
          axios.get("http://127.0.0.1:8000/api/team-members")
        ]);

        // Process events
        const eventsData = eventsRes.data.map((post) => ({
          id: post.id,
          title: post.caption.length > 30 ? post.caption.slice(0, 30) + "..." : post.caption,
          start: new Date(post.scheduled_time),
          end: new Date(new Date(post.scheduled_time).getTime() + 30 * 60000),
          allDay: false,
          platform: post.platform,
          caption: post.caption,
          image_url: post.image_url,
          status: post.status || "scheduled",
          is_carousel: post.is_carousel || false,
          assigned_to: post.assigned_to || null,
          tags: post.tags || []
        }));

        setEvents(eventsData);
        setFilteredEvents(eventsData);

        // Process statistics
        setStats({
          totalPosts: statsRes.data.total_posts,
          byPlatform: statsRes.data.by_platform,
          byStatus: statsRes.data.by_status
        });

        // Process team members
        setTeamMembers(teamRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters whenever events, activeFilter, searchQuery, or selectedTeamMember changes
  useEffect(() => {
    let result = [...events];

    // Apply platform filter
    if (activeFilter !== "all") {
      result = result.filter(event => event.platform === activeFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(event =>
        event.caption.toLowerCase().includes(query) ||
        (event.tags && event.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Apply team member filter
    if (selectedTeamMember !== "all") {
      result = result.filter(event => event.assigned_to === selectedTeamMember);
    }

    setFilteredEvents(result);
  }, [events, activeFilter, searchQuery, selectedTeamMember]);

  // Schedule a new post
  const schedulePost = async () => {
    if (!caption || !image_url || !platform) {
      toast.warning("Missing post data. Please create a post first.");
      return;
    }

    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(selectedTime.getHours());
    scheduledDateTime.setMinutes(selectedTime.getMinutes());

    try {
      setIsModalLoading(true);
      const response = await axios.post("http://127.0.0.1:8000/api/schedule-post/", {
        caption,
        image_url: is_carousel ? image_url : image_url,
        platform,
        scheduled_time: scheduledDateTime.toISOString(),
        is_carousel,
        tags: ["scheduled"]
      });

      const newEvent = {
        id: response.data.id || Date.now(),
        title: caption.length > 30 ? caption.slice(0, 30) + "..." : caption,
        start: scheduledDateTime,
        end: new Date(scheduledDateTime.getTime() + 30 * 60000),
        allDay: false,
        platform,
        caption,
        image_url: is_carousel ? image_url : image_url,
        status: "scheduled",
        is_carousel,
        tags: ["scheduled"]
      };

      setEvents([...events, newEvent]);

      // Show confetti on success
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000); // Hide after 3 seconds

      toast.success("Post scheduled successfully! 🎉");
      setShowScheduleForm(false);

      // Update stats
      setStats(prev => ({
        ...prev,
        totalPosts: prev.totalPosts + 1,
        byPlatform: {
          ...prev.byPlatform,
          [platform]: (prev.byPlatform[platform] || 0) + 1
        },
        byStatus: {
          ...prev.byStatus,
          scheduled: (prev.byStatus.scheduled || 0) + 1
        }
      }));
    } catch (error) {
      console.error("Error scheduling post:", error);
      toast.error("Failed to schedule post. Please try again.");
    } finally {
      setIsModalLoading(false);
    }
  };

  // Delete a scheduled post
  const deletePost = async (eventId) => {
    setIsModalLoading(true);
    const toastId = toast.loading("Canceling post...", { position: "top-right" });

    try {
      await axios.delete(`${API_URL}/${eventId}/`);
      const deletedEvent = events.find(e => e.id === eventId);
      setEvents(events.filter((event) => event.id !== eventId));

      toast.update(toastId, {
        render: "Post canceled successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setSelectedEvent(null);

      // Update stats
      setStats(prev => ({
        ...prev,
        totalPosts: prev.totalPosts - 1,
        byPlatform: {
          ...prev.byPlatform,
          [deletedEvent.platform]: (prev.byPlatform[deletedEvent.platform] || 0) - 1
        },
        byStatus: {
          ...prev.byStatus,
          [deletedEvent.status]: (prev.byStatus[deletedEvent.status] || 0) - 1
        }
      }));
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

  // Update post status
  const updatePostStatus = async (eventId, newStatus) => {
    setIsModalLoading(true);
    const toastId = toast.loading("Updating post status...");

    try {
      await axios.patch(`${API_URL}/${eventId}/`, { status: newStatus });
      setEvents(events.map(event =>
        event.id === eventId ? { ...event, status: newStatus } : event
      ));

      // Update stats
      const updatedEvent = events.find(e => e.id === eventId);
      setStats(prev => ({
        ...prev,
        byStatus: {
          ...prev.byStatus,
          [updatedEvent.status]: (prev.byStatus[updatedEvent.status] || 0) - 1,
          [newStatus]: (prev.byStatus[newStatus] || 0) + 1
        }
      }));

      toast.update(toastId, {
        render: "Post status updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error updating post status:", error);
      toast.update(toastId, {
        render: "Failed to update post status.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsModalLoading(false);
    }
  };

  // Export calendar data to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredEvents.map(event => ({
        "Post Title": event.title,
        "Platform": event.platform,
        "Scheduled Time": moment(event.start).format("YYYY-MM-DD HH:mm"),
        "Status": event.status,
        "Assigned To": event.assigned_to || "Unassigned",
        "Tags": event.tags?.join(", ") || ""
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Scheduled Posts");
    XLSX.writeFile(workbook, "SocialMediaCalendar.xlsx");
  };

  // Import calendar data from Excel
  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Process imported data (this would need to be adapted to your API)
      toast.info(`Imported ${jsonData.length} posts. Ready to process.`);
      // Here you would typically send this data to your backend
    };
    reader.readAsArrayBuffer(file);
  };

  // Share calendar via email
  const shareCalendar = () => {
    const subject = "Social Media Content Calendar";
    const body = `Here's our content calendar: ${window.location.href}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  // Platform distribution chart data
  const platformChartData = {
    labels: Object.keys(stats.byPlatform),
    datasets: [
      {
        data: Object.values(stats.byPlatform),
        backgroundColor: Object.keys(stats.byPlatform).map(p => platformData[p]?.color || "#999"),
        borderWidth: 0,
      }
    ]
  };

  // Status distribution chart data
  const statusChartData = {
    labels: Object.keys(stats.byStatus),
    datasets: [
      {
        data: Object.values(stats.byStatus),
        backgroundColor: ["#3B82F6", "#10B981", "#EF4444", "#F59E0B"],
        borderWidth: 0,
      }
    ]
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // Custom event styles
  const eventStyleGetter = (event) => {
    const platformColor = platformData[event.platform]?.color || "#3174ad";

    return {
      style: {
        backgroundColor: platformColor,
        borderLeft: `4px solid ${platformColor}`,
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

  // Custom toolbar component
  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-3 mb-3 md:mb-0">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => onNavigate("PREV")}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
        >
          <FiChevronLeft size={20} />
        </motion.button>
        <h2 className="text-xl font-semibold text-gray-800">{label}</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => onNavigate("NEXT")}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
        >
          <FiChevronRight size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => onNavigate("TODAY")}
          className="ml-4 px-4 py-1.5 text-sm bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
        >
          Today
        </motion.button>
      </div>
      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => onView(Views.MONTH)}
          className={`px-4 py-1.5 text-sm rounded-md ${
            currentView === Views.MONTH ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Month
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => onView(Views.WEEK)}
          className={`px-4 py-1.5 text-sm rounded-md ${
            currentView === Views.WEEK ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Week
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => onView(Views.DAY)}
          className={`px-4 py-1.5 text-sm rounded-md ${
            currentView === Views.DAY ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Day
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => onView(Views.AGENDA)}
          className={`px-4 py-1.5 text-sm rounded-md ${
            currentView === Views.AGENDA ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Agenda
        </motion.button>
      </div>
    </div>
  );

  // Custom event component
  const CustomEvent = ({ event }) => (
    <div className="p-1">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-2 mt-0.5">
          {event.platform && (
            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d={platformData[event.platform]?.icon} />
            </svg>
          )}
        </div>
        <div>
          <div className="truncate text-sm font-medium">{event.title}</div>
          {event.assigned_to && (
            <div className="text-xs text-white opacity-80 truncate">@{event.assigned_to}</div>
          )}
        </div>
      </div>
    </div>
  );

  // Get aspect ratio for media preview
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
      default:
        return "aspect-[1/1]";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Confetti animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.2}
            initialVelocityY={20}
            confettiSource={{
              w: 10,
              h: window.innerHeight,
              x: 0, // Left side
              y: 0
            }}
          />
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.2}
            initialVelocityY={20}
            confettiSource={{
              w: 10,
              h: window.innerHeight,
              x: window.innerWidth - 10, // Right side
              y: 0
            }}
          />
        </div>
      )}

      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 px-4 py-6 overflow-y-auto md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">Content Calendar</h1>
                <p className="text-gray-600">Plan, visualize and manage your social media content</p>
              </div>
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowScheduleForm(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 text-sm"
                >
                  <FiPlus className="text-lg" />
                  Schedule Post
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm"
                >
                  <FiUpload className="text-lg" />
                  Import
                </motion.button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalPosts}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                    <FiCalendar size={20} />
                  </div>
                </div>
              </div>
              {Object.entries(stats.byPlatform).slice(0, 3).map(([platform, count]) => (
                <div key={platform} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 capitalize">{platform} Posts</p>
                      <p className="text-2xl font-bold text-gray-800">{count}</p>
                    </div>
                    <div
                      className="p-3 rounded-full"
                      style={{ backgroundColor: `${platformData[platform]?.color}20`, color: platformData[platform]?.color }}
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d={platformData[platform]?.icon} />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-3 md:mb-0">
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                      showFilters ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <FiFilter size={16} />
                    Filters
                  </motion.button>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3"
                    >
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Platform</label>
                          <div className="flex flex-wrap gap-2">
                            {["all", ...Object.keys(platformData)].map((platform) => (
                              <motion.button
                                key={platform}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveFilter(platform === "all" ? "all" : platform)}
                                className={`px-3 py-1 text-xs rounded-full capitalize ${
                                  activeFilter === platform
                                    ? `bg-${platformData[platform]?.color || "blue"}-100 text-${platformData[platform]?.color || "blue"}-600`
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {platform}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
                          <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Showing {filteredEvents.length} of {events.length} posts
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm"
                >
                  <FiRefreshCw size={16} />
                  Refresh
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={exportToExcel}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm"
                >
                  <FiDownload size={16} />
                  Export
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={shareCalendar}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm"
                >
                  <FiShare2 size={16} />
                  Share
                </motion.button>
              </div>
            </div>

            {/* Calendar and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* Calendar */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  {isLoading ? (
                    <div className="h-[60vh] flex items-center justify-center">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-200 animate-spin"></div>
                        <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
                      </div>
                    </div>
                  ) : (
                    <Calendar
                      localizer={localizer}
                      events={filteredEvents}
                      startAccessor="start"
                      endAccessor="end"
                      onSelectEvent={handleSelectEvent}
                      onNavigate={handleNavigate}
                      onView={handleViewChange}
                      view={currentView}
                      date={currentDate}
                      style={{ height: "60vh", padding: "1rem" }}
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
              <div className="space-y-6">
                {/* Analytics Card */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <FiBarChart2 className="mr-2" /> Analytics
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Platform Distribution</h4>
                      <div className="h-40">
                        <Doughnut
                          data={platformChartData}
                          options={{
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'right'
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Status Overview</h4>
                      <div className="h-40">
                        <Doughnut
                          data={statusChartData}
                          options={{
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'right'
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Posts */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <FiClock className="mr-2" /> Upcoming Posts
                  </h3>
                  <div className="space-y-3">
                    {filteredEvents
                      .filter(event => new Date(event.start) > new Date())
                      .sort((a, b) => new Date(a.start) - new Date(b.start))
                      .slice(0, 5)
                      .map(event => (
                        <motion.div
                          key={event.id}
                          whileHover={{ x: 5 }}
                          onClick={() => setSelectedEvent(event)}
                          className="p-3 bg-gray-50 rounded-lg cursor-pointer border border-gray-200"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center mb-1">
                                <span
                                  className={`inline-block w-2 h-2 rounded-full mr-2`}
                                  style={{ backgroundColor: platformData[event.platform]?.color }}
                                ></span>
                                <span className="text-sm font-medium text-gray-800 truncate max-w-[120px]">
                                  {event.title}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {moment(event.start).format("MMM D, h:mm A")}
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[event.status]}`}>
                              {event.status}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    {filteredEvents.filter(event => new Date(event.start) > new Date()).length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No upcoming posts scheduled
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Post Modal */}
            <AnimatePresence>
              {showScheduleForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto relative z-50"
                    style={{
                      width: "90%",
                      maxWidth: "400px",
                    }}
                  >
                    {showConfetti && (
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 rounded-xl border-2 border-yellow-400 pointer-events-none"
                      />
                    )}

                    <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-4">
                      <h2 className="text-xl font-bold text-gray-800">Schedule Post</h2>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setShowScheduleForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX size={20} />
                      </motion.button>
                    </div>

                    <div className="space-y-4 pb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                        <DatePicker
                          selected={selectedDate}
                          onChange={setSelectedDate}
                          minDate={new Date()}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          popperPlacement="bottom-start"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                        <DatePicker
                          selected={selectedTime}
                          onChange={setSelectedTime}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                      {caption && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Post Preview</p>
                          <p className="text-gray-800 text-sm mb-2">{caption}</p>
                          {image_url && (
                            <div className="mt-2">
                              <div className={`${getAspectRatio(platform)} w-full overflow-hidden rounded border border-gray-200`}>
                                <img
                                  src={is_carousel ? image_url[0] : image_url}
                                  alt="Post preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="pt-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={schedulePost}
                          disabled={isModalLoading}
                          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                        >
                          {isModalLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Scheduling...
                            </>
                          ) : (
                            "Confirm Schedule"
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Event Detail Modal */}
            <AnimatePresence>
              {selectedEvent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                  onClick={() => setSelectedEvent(null)}
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isModalLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="relative">
                          <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-200 animate-spin"></div>
                          <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold text-gray-800">Post Details</h2>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setSelectedEvent(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FiX size={20} />
                          </motion.button>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {selectedEvent.platform && (
                                <svg
                                  className="h-5 w-5 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  style={{ color: platformData[selectedEvent.platform]?.color }}
                                >
                                  <path d={platformData[selectedEvent.platform]?.icon} />
                                </svg>
                              )}
                              <span className="font-medium capitalize">{selectedEvent.platform}</span>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full ${statusColors[selectedEvent.status]}`}>
                              {selectedEvent.status}
                            </span>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center text-gray-800 mb-2">
                              <FiClock className="mr-2 text-gray-500 h-4 w-4" />
                              <p className="font-medium text-sm">
                                {moment(selectedEvent.start).format("MMMM Do YYYY, h:mm a")}
                              </p>
                            </div>
                            <p className="text-sm text-gray-800 mb-3">{selectedEvent.caption}</p>
                            {selectedEvent.image_url && (
                              <div className={`${getAspectRatio(selectedEvent.platform)} w-full overflow-hidden rounded border border-gray-200`}>
                                <img
                                  src={selectedEvent.is_carousel ? selectedEvent.image_url[0] : selectedEvent.image_url}
                                  alt="Post media"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>

                          {selectedEvent.tags?.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Tags</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedEvent.tags.map(tag => (
                                  <span key={tag} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full flex items-center">
                                    <FiTag className="mr-1" size={12} /> {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedEvent.assigned_to && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Assigned To</p>
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2">
                                  {selectedEvent.assigned_to.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm text-gray-800">
                                  {teamMembers.find(m => m.username === selectedEvent.assigned_to)?.name || selectedEvent.assigned_to}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="pt-3 flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                navigate('/create-post', {
                                  state: {
                                    editMode: true,
                                    postData: selectedEvent
                                  }
                                });
                              }}
                              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                              disabled={isModalLoading}
                            >
                              Edit Post
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => deletePost(selectedEvent.id)}
                              className="flex-1 bg-red-100 text-red-600 py-2.5 rounded-lg font-medium hover:bg-red-200 transition-colors text-sm"
                              disabled={isModalLoading}
                            >
                              Cancel Post
                            </motion.button>
                          </div>

                          {selectedEvent.status === "scheduled" && (
                            <div className="pt-2">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updatePostStatus(selectedEvent.id, "published")}
                                className="w-full bg-green-100 text-green-600 py-2.5 rounded-lg font-medium hover:bg-green-200 transition-colors text-sm"
                                disabled={isModalLoading}
                              >
                                Mark as Published
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                </motion.div>
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
              theme="colored"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CalendarPage;