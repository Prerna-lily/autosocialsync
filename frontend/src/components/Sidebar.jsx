// import React, { useState } from "react";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
//
// import {
//   FaPlus, FaClock, FaChartLine, FaFolder, FaCalendar, FaShareAlt,
//   FaChartBar, FaLightbulb, FaCommentDots, FaCreditCard, FaGlobe
// } from "react-icons/fa";
//
// const Sidebar = () => {
//   const [selectedBrand, setSelectedBrand] = useState("My Brand");
//   const navigate = useNavigate();
//   const location = useLocation();
//
//   return (
//     <aside className="w-[280px] h-screen bg-white border-r border-gray-200 shadow-xl flex flex-col overflow-y-auto transition-all duration-300">
//       {/* Create New Button */}
//       <div className="p-4 space-y-4">
//         <button
//           className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center hover:from-blue-700 hover:to-blue-600 transition duration-200 shadow"
//           onClick={() => navigate("/create-post")}
//         >
//           <FaPlus className="mr-2" /> Create New
//         </button>
//
//         {/* Brand Selector */}
//         <div className="relative">
//           <select
//             className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={selectedBrand}
//             onChange={(e) => setSelectedBrand(e.target.value)}
//           >
//             <option>My Brand</option>
//             <option>SocialSync</option>
//             <option>Marketing Hub</option>
//           </select>
//         </div>
//
//         {/* Auto Posting */}
//         <button className="w-full bg-blue-100 text-blue-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center border border-blue-300 hover:bg-blue-200 transition">
//           <FaClock className="mr-2" /> Start Auto Posting
//         </button>
//       </div>
//
//       {/* Navigation Links */}
//       <nav className="flex-1 p-4 space-y-1">
//         <NavItem icon={<FaChartLine />} text="Dashboard" link="/social-dashboard" currentPath={location.pathname} />
//         <NavItem icon={<FaFolder />} text="Content Library" link="/library" currentPath={location.pathname} />
//         <NavItem icon={<FaCalendar />} text="Content Calendar" link="/content-calendar" currentPath={location.pathname} />
//         <NavItem icon={<FaShareAlt />} text="Brand & Social Accounts" link="/accounts" currentPath={location.pathname} />
//       </nav>
//
//       {/* Additional Features */}
//       <div className="border-t border-gray-200 p-4 space-y-1">
//         <NavItem icon={<FaChartBar />} text="Competitor Analysis" currentPath={location.pathname} />
//         <NavItem icon={<FaLightbulb />} text="Idea Lab" link="/create-campaign" currentPath={location.pathname} />
//       </div>
//
//       {/* Support & Settings */}
//       <div className="border-t border-gray-200 p-4 space-y-1">
//         <NavItem icon={<FaCommentDots />} text="Chat Support" link="/chat-support" currentPath={location.pathname} />
//         <NavItem icon={<FaCreditCard />} text="Pricing & Account" currentPath={location.pathname} />
//         <NavItem icon={<FaGlobe />} text="Language Settings" currentPath={location.pathname} />
//       </div>
//     </aside>
//   );
// };
//
// // Single Sidebar Item Component
// const NavItem = ({ icon, text, link = "#", currentPath }) => {
//   const isActive = currentPath === link;
//
//   return (
//     <NavLink
//       to={link}
//       className={`flex items-center px-4 py-2.5 rounded-md transition-all duration-200 font-medium
//         ${isActive ? "bg-blue-50 text-blue-700 shadow-inner" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"}
//       `}
//     >
//       <span className={`w-5 mr-3 text-[16px] ${isActive ? "text-blue-600" : ""}`}>{icon}</span>
//       <span>{text}</span>
//     </NavLink>
//   );
// };
//
// export default Sidebar;


import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaClock,
  FaChartLine,
  FaFolder,
  FaCalendar,
  FaShareAlt,
  FaChartBar,
  FaLightbulb,
  FaCommentDots,
  FaCreditCard,
  FaGlobe,
  FaChevronDown,
  FaUserCircle,
  FaBookmark
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const [selectedBrand, setSelectedBrand] = useState("My Brand");
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-[280px] h-screen bg-white border-r border-gray-100 flex flex-col"
    >
      {/* Scrollable Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Logo/Brand Header */}
        <div className="p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-start">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">SS</span>
            </div>
            <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              SocialSync
            </h1>
          </div>
          <p className="text-left text-xs text-gray-500 mt-1 font-medium">Marketing Suite Pro</p>
        </div>

        {/* Create New Button */}
        <div className="px-5 pt-5 pb-3">
          <motion.button
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center hover:shadow-lg transition-all duration-200 shadow-md"
            onClick={() => navigate("/create-post")}
          >
            <FaPlus className="mr-3 text-sm" />
            <span className="text-sm tracking-wide">Create New</span>
          </motion.button>
        </div>

{/*          */}{/* Brand Selector */}
{/*         <div className="px-5 pb-3 relative"> */}
{/*           <div */}
{/*             className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700 cursor-pointer flex items-center justify-between hover:bg-gray-100 transition" */}
{/*             onClick={() => setIsBrandOpen(!isBrandOpen)} */}
{/*           > */}
{/*             <div className="flex items-center"> */}
{/*               <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 mr-3 shadow-sm"></div> */}
{/*               <span className="font-medium text-sm">{selectedBrand}</span> */}
{/*             </div> */}
{/*             <FaChevronDown className={`text-xs text-gray-500 transition-transform duration-200 ${isBrandOpen ? 'transform rotate-180' : ''}`} /> */}
{/*           </div> */}

{/*           <AnimatePresence> */}
{/*             {isBrandOpen && ( */}
{/*               <motion.div */}
{/*                 initial={{ opacity: 0, height: 0 }} */}
{/*                 animate={{ opacity: 1, height: 'auto' }} */}
{/*                 exit={{ opacity: 0, height: 0 }} */}
{/*                 transition={{ duration: 0.2 }} */}
{/*                 className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden" */}
{/*               > */}
{/*                 {["My Brand", "SocialSync", "Marketing Hub"].map((brand) => ( */}
{/*                   <div */}
{/*                     key={brand} */}
{/*                     className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center ${selectedBrand === brand ? 'bg-blue-50' : ''}`} */}
{/*                     onClick={() => { */}
{/*                       setSelectedBrand(brand); */}
{/*                       setIsBrandOpen(false); */}
{/*                     }} */}
{/*                   > */}
{/*                     <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 mr-3 shadow-sm"></div> */}
{/*                     <span className={`text-sm ${selectedBrand === brand ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>{brand}</span> */}
{/*                   </div> */}
{/*                 ))} */}
{/*               </motion.div> */}
{/*             )} */}
{/*           </AnimatePresence> */}
{/*         </div> */}

{/*          */}{/* Auto Posting */}
{/*         <div className="px-5 pb-5"> */}
{/*           <motion.button */}
{/*             whileHover={{ y: -1 }} */}
{/*             whileTap={{ scale: 0.98 }} */}
{/*             className="w-full bg-white text-gray-700 py-3 px-4 rounded-xl font-medium flex items-center justify-center border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm hover:shadow-md" */}
{/*           > */}
{/*             <FaClock className="mr-3 text-blue-500" /> */}
{/*             <span className="text-sm tracking-wide">Start Auto Posting</span> */}
{/*           </motion.button> */}
{/*         </div> */}

        {/* Navigation Links */}
        <div className="px-3 pb-4">
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Content Management</h3>
          <NavItem icon={<FaChartLine size={14} />} text="Dashboard" link="/social-dashboard" currentPath={location.pathname} />
          <NavItem icon={<FaFolder size={14} />} text="Content Library" link="/drafts-page" currentPath={location.pathname} />
          <NavItem icon={<FaCalendar size={14} />} text="Content Calendar" link="/content-calendar" currentPath={location.pathname} />
          <NavItem icon={<FaShareAlt size={14} />} text="Brand Accounts" link="/accounts" currentPath={location.pathname} />
        </div>

        {/* Additional Features */}
        <div className="border-t border-gray-100 px-3 pt-4 pb-4">
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Advanced Tools</h3>
          <NavItem icon={<FaChartBar size={14} />} text="Competitor Analysis" currentPath={location.pathname} />
          <NavItem icon={<FaLightbulb size={14} />} text="Idea Lab" link="/create-campaign" currentPath={location.pathname} />
          <NavItem icon={<FaBookmark size={14} />} text="Saved Campaigns" link="/saved-campaigns" currentPath={location.pathname} />
        </div>

        {/* Support & Settings */}
        <div className="border-t border-gray-100 px-3 pt-4">
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Support</h3>
          <NavItem icon={<FaCommentDots size={14} />} text="Chat Support" link="/chat-support" currentPath={location.pathname} />
          <NavItem icon={<FaCreditCard size={14} />} text="Pricing & Account" currentPath={location.pathname} />
          <NavItem icon={<FaGlobe size={14} />} text="Language Settings" currentPath={location.pathname} />
        </div>
      </div>

      {/* User Profile - Fixed at bottom */}

<div className="border-t border-gray-100 p-4 bg-gray-50 mt-auto">
  <div className="flex items-center">
    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center shadow-inner">
      <span className="text-white font-medium text-lg">
        {JSON.parse(localStorage.getItem("user"))?.full_name?.[0]?.toUpperCase() || "U"}
      </span>
    </div>
    <div className="ml-3">
      <p className="text-sm font-medium text-gray-800">
        {JSON.parse(localStorage.getItem("user"))?.full_name || "User"}
      </p>
      <p className="text-xs text-gray-500">Pro Plan</p>
    </div>
  </div>
</div>
    </motion.aside>
  );
};

// NavItem Component
const NavItem = ({ icon, text, link = "#", currentPath }) => {
  const isActive = currentPath === link;

  return (
    <motion.div whileHover={{ y: -1 }}>
      <NavLink
        to={link}
        className={`flex items-center px-4 py-3 rounded-xl mx-2 transition-all duration-200 text-sm
          ${isActive
            ? "bg-gradient-to-r from-blue-50 to-blue-50 text-blue-600 border-l-2 border-blue-500 font-medium"
            : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"}
        `}
      >
        <span className={`w-5 mr-3 flex justify-center ${isActive ? "text-blue-500" : "text-gray-500"}`}>
          {icon}
        </span>
        <span className="flex-1 tracking-wide">{text}</span>
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 rounded-full bg-blue-500"
          ></motion.div>
        )}
      </NavLink>
    </motion.div>
  );
};

export default Sidebar;