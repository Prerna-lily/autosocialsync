// // import React from "react";
// // import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
// //
// // const Navbar = () => {
// //   return (
// //     <header className="bg-white border-b border-gray-200 shadow-sm w-full">
// //       <div className="container mx-auto px-6 py-3 flex justify-between items-center">
// //
// //         {/* Left Section - Search Bar */}
// //         <div className="relative w-1/3">
// //           <input
// //             type="text"
// //             placeholder="Search..."
// //             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           />
// //           <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
// //         </div>
// //
// //         {/* Right Section - Icons */}
// //         <div className="flex items-center space-x-6">
// //           {/* Notification Bell */}
// //           <button className="relative text-gray-600 hover:text-gray-800">
// //             <FaBell size={20} />
// //             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
// //           </button>
// //
// //           {/* Profile Dropdown */}
// //           <div className="relative group">
// //             <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none">
// //               <FaUserCircle size={24} />
// //               <span className="hidden md:inline-block">Abhishek</span>
// //             </button>
// //
// //             {/* Dropdown Menu */}
// //             <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden group-hover:block">
// //               <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
// //               <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
// //               <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</a>
// //             </div>
// //           </div>
// //         </div>
// //
// //       </div>
// //     </header>
// //   );
// // };
// //
// // export default Navbar;
//
//
// import React, { useState, useEffect } from "react";
// import { FaSearch, FaBell, FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
//
// const Navbar = () => {
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isScrolled, setIsScrolled] = useState(false);
//
//   // Handle click outside profile dropdown
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest('.profile-dropdown')) {
//         setIsProfileOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);
//
//   // Add scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);
//
//   return (
//     <header className={`bg-white border-b border-gray-100 w-full sticky top-0 z-20 transition-shadow duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
//       <div className="flex items-center h-16 px-6">
//         {/* Spacer to account for sidebar width - matches sidebar width */}
//         <div className="w-[280px]"></div>
//
//         {/* Main navbar content */}
//         <div className="flex-1 flex justify-between items-center ml-4">
//           {/* Search Bar */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="relative max-w-xl w-full"
//           >
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search campaigns, posts..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               {searchQuery && (
//                 <button
//                   onClick={() => setSearchQuery("")}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   ×
//                 </button>
//               )}
//             </div>
//           </motion.div>
//
//           {/* Right Section - Icons */}
//           <div className="flex items-center space-x-6 ml-4">
//             {/* Notification Bell */}
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="relative text-gray-500 hover:text-blue-600 transition-colors duration-200"
//             >
//               <FaBell size={20} />
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
//                 3
//               </span>
//             </motion.button>
//
//             {/* Profile Dropdown */}
//             <div className="relative profile-dropdown">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="flex items-center space-x-2 focus:outline-none"
//                 onClick={() => setIsProfileOpen(!isProfileOpen)}
//               >
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
//                   <span className="font-medium text-sm">AK</span>
//                 </div>
//                 <span className="hidden md:inline-block font-medium text-gray-700">Abhishek</span>
//               </motion.button>
//
//               {/* Dropdown Menu */}
//               <AnimatePresence>
//                 {isProfileOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 10 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-40"
//                   >
//                     <div className="px-4 py-3 border-b border-gray-100">
//                       <p className="text-sm font-medium text-gray-700">Signed in as</p>
//                       <p className="text-sm text-gray-500 truncate">abhishek@socialsync.com</p>
//                     </div>
//
//                     <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors">
//                       <FaUserCircle className="mr-3 text-blue-500" />
//                       <span>Profile</span>
//                     </a>
//
//                     <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors">
//                       <FaCog className="mr-3 text-blue-500" />
//                       <span>Settings</span>
//                     </a>
//
//                     <div className="border-t border-gray-100">
//                       <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors">
//                         <FaSignOutAlt className="mr-3 text-blue-500" />
//                         <span>Logout</span>
//                       </a>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };
//
// export default Navbar;





import React, { useState, useEffect } from "react";
import { FaSearch, FaBell, FaCog, FaSignOutAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle click outside profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown")) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/auth");
  };

  return (
    <header
      className={`bg-white border-b border-gray-100 w-full sticky top-0 z-20 transition-shadow duration-300 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="flex items-center h-16 px-6">
        {/* Spacer to account for sidebar width */}
        <div className="w-[280px]"></div>

        {/* Main navbar content */}
        <div className="flex-1 flex justify-between items-center ml-4">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative max-w-xl w-full"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search campaigns, posts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </motion.div>

          {/* Right Section - Icons */}
          <div className="flex items-center space-x-6 ml-4">
            {/* Notification Bell */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative text-gray-500 hover:text-blue-600 transition-colors duration-200"
            >
              <FaBell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                3
              </span>
            </motion.button>

            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                  <span className="font-medium text-sm">
                    {user?.full_name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <span className="hidden md:inline-block font-medium text-gray-700">
                  {user?.full_name || "User"}
                </span>
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-40"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-700">Signed in as</p>
                      <p className="text-sm text-gray-500 truncate">{user?.email || "user@example.com"}</p>
                    </div>

                    <a
                      href="#"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
                    >
                      <FaCog className="mr-3 text-blue-500" />
                      <span>Settings</span>
                    </a>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
                    >
                      <FaSignOutAlt className="mr-3 text-blue-500" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;