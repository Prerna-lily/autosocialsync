
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaPlus, FaClock, FaChartLine, FaFolder, FaCalendar, FaShareAlt,
  FaChartBar, FaLightbulb, FaPlay, FaCommentDots, FaCreditCard, FaGlobe
} from "react-icons/fa";

const Sidebar = () => {
  const [selectedBrand, setSelectedBrand] = useState("My Brand");
const navigate = useNavigate();

  return (
    <aside className="w-[280px] h-screen bg-white border-r border-gray-200 flex flex-col shadow-lg overflow-y-auto">
      {/* Create New Button */}
      <div className="p-4 space-y-4">
<button
  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center hover:bg-blue-700 transition"
  onClick={() => navigate("/create-post")} // 👈 redirects to CreatePost
>
  <FaPlus className="mr-2" /> Create New
</button>


        {/* Brand Selector */}
        <div className="relative">
          <select
            className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 appearance-none text-gray-700"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option>My Brand</option>
            <option>SocialSync</option>
            <option>Marketing Hub</option>
          </select>
        </div>

        {/* Auto Posting */}
        <button className="w-full bg-blue-100 text-blue-700 py-3 px-4 rounded-md font-medium flex items-center justify-center border border-blue-300 hover:bg-blue-200 transition">
          <FaClock className="mr-2" /> Start Auto Posting
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        <NavItem icon={<FaChartLine />} text="Dashboard" link="/social-dashboard" />
        <NavItem icon={<FaFolder />} text="Content Library" link="/draft-page" />
        <NavItem icon={<FaCalendar />} text="Content Calendar" link="/content-calendar" />
        <NavItem icon={<FaShareAlt />} text="Brand & Social Accounts" link="/accounts" />
      </nav>

      {/* Demo Section */}
{/*       <div className="p-4 bg-gray-100 mx-4 mb-4 rounded-md text-center"> */}
{/*         <h3 className="font-medium text-gray-800 mb-1">Need a Demo?</h3> */}
{/*         <p className="text-sm text-gray-600 mb-3">Discover the full potential of SocialSync in just 30 minutes!</p> */}
{/*         <button className="w-full bg-white text-blue-700 border border-blue-300 py-2 px-4 rounded-md font-medium flex items-center justify-center hover:bg-blue-50 transition"> */}
{/*           <FaPlay className="mr-2" /> Watch Demo */}
{/*         </button> */}
{/*       </div> */}

      {/* Additional Features */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        <NavItem icon={<FaChartBar />} text="Competitor Analysis" />
<NavItem icon={<FaLightbulb />} text="Idea Lab" link="/idea-lab" />
      </div>

      {/* Rewards Section */}
{/*       <div className="p-4"> */}
{/*         <div className="bg-orange-100 p-4 rounded-md"> */}
{/*           <div className="flex justify-between items-center mb-2"> */}
{/*             <span className="text-sm font-medium text-orange-800">Unlock Rewards</span> */}
{/*             <span className="text-sm text-orange-600">1/5</span> */}
{/*           </div> */}
{/*           <div className="w-full bg-orange-200 rounded-full h-1.5"> */}
{/*             <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: "20%" }}></div> */}
{/*           </div> */}
{/*           <p className="text-xs text-orange-600 mt-2">Up to 50% off</p> */}
{/*         </div> */}
{/*       </div> */}

      {/* Support & Settings */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        <NavItem icon={<FaCommentDots />} text="Chat Support" link="/chat-support"/>

        <NavItem icon={<FaCreditCard />} text="Pricing & Account" />
        <NavItem icon={<FaGlobe />} text="Language Settings" />
      </div>
    </aside>
  );
};

// Navigation Item Component
import { Link } from "react-router-dom";

const NavItem = ({ icon, text, link, active = false }) => (
  <Link
    to={link} // ✅ Use Link for navigation
    className={`flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-md ${active ? "bg-blue-50 text-blue-700" : ""}`}
  >
    <span className="w-5 mr-3">{icon}</span>
    <span>{text}</span>
  </Link>
);

export default Sidebar;
