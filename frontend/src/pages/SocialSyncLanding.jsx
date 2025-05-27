import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { FaMagic, FaCalendarAlt, FaRobot, FaChartLine, FaUserPlus, FaCalendarCheck, FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// IMPORTANT: Make sure this path is correct relative to THIS file's location
import dashboardImageFromFile from "../assets/dashboard.png";

const SocialSyncLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollYState, setScrollYState] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const location = useLocation();

  // Navbar shrink on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollYState(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to section based on hash
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Data for sections
  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works"},
    { name: "FAQ", href: "#faq" },
  ];

  const featuresData = [
    { icon: <FaMagic className="text-white text-3xl" />, title: "AI Content Creation", description: "Generate engaging content with AI-driven creativity.", color: "bg-purple-500", shadow: "shadow-purple-500/50" },
    { icon: <FaCalendarAlt className="text-white text-3xl" />, title: "Smart Scheduling", description: "AI-optimized posting times for maximum engagement.", color: "bg-blue-500", shadow: "shadow-blue-500/50" },
    { icon: <FaRobot className="text-white text-3xl" />, title: "Auto Posting", description: "Seamless automation across all platforms effortlessly.", color: "bg-green-500", shadow: "shadow-green-500/50" },
    { icon: <FaChartLine className="text-white text-3xl" />, title: "Analytics & Insights", description: "Real-time tracking and AI-powered recommendations.", color: "bg-orange-500", shadow: "shadow-orange-500/50" },
  ];

  const stepsData = [
    { step: 1, title: "Connect Accounts", description: "Sign up & link your social accounts seamlessly.", icon: <FaUserPlus className="text-white text-3xl" />, color: "bg-indigo-500" },
    { step: 2, title: "Create & Schedule", description: "Use AI to generate and schedule quality content.", icon: <FaCalendarCheck className="text-white text-3xl" />, color: "bg-teal-500" },
    { step: 3, title: "Track & Optimize", description: "Monitor performance and optimize with AI insights.", icon: <FaChartLine className="text-white text-3xl" />, color: "bg-pink-500" },
  ];

  const faqData = [
    { question: "What platforms does SocialSync support?", answer: "Facebook, Instagram, Twitter, LinkedIn, Pinterest, and TikTok. More coming soon!" },
    { question: "How does AI content generation work?", answer: "Our AI analyzes trends and your brand voice to create tailored posts. You can guide it or let it suggest ideas." },
    { question: "Can I schedule posts in advance?", answer: "Yes! Schedule weeks or months ahead. Our AI also suggests optimal posting times." },
//     { question: "Is there a free trial?", answer: "Absolutely! A 14-day free trial with full features, no credit card needed." }
  ];

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const popUpVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }
  };

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
     <div className="min-h-screen font-sans">
      <div className="bg-gray-50 text-gray-800"> {/* Main light theme background */}
        {/* Navbar */}
        <nav className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${scrollYState > 50 ? 'py-2 bg-white/90 backdrop-blur-lg shadow-lg' : 'py-4 bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex justify-between items-center h-16">
              <Link to="/#hero" className="flex items-center space-x-2 group"> {/* Landing page home */}
                <motion.img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
                  alt="SocialSync Logo"
                  className="h-10 w-auto"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">SocialSync</span>
              </Link>

              <div className="hidden md:flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={`/${link.href}`} // Ensure hash links on landing page work correctly from root
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="hidden md:flex items-center space-x-3">
                {/* MODIFIED HERE */}
                <Link to="/auth">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(101, 116, 205)" }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${scrollYState > 50 ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-white/70 text-slate-700 hover:bg-white'}`}
                  >
                    Sign In
                  </motion.button>
                </Link>
                {/* MODIFIED HERE */}
                <Link to="/auth">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2, boxShadow: "0px 5px 15px rgba(79, 70, 229, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Get Started Free
                  </motion.button>
                </Link>
              </div>

              <button
                className="md:hidden text-gray-700 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="md:hidden bg-white shadow-xl rounded-lg mt-2 overflow-hidden absolute left-0 right-0 mx-6"
                >
                  <div className="py-3 px-4 space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={`/${link.href}`} // Ensure hash links on landing page work correctly
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                  <div className="pt-2 pb-3 px-4 space-y-3 border-t border-gray-200">
                    {/* MODIFIED HERE */}
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <motion.button whileTap={{ scale: 0.95 }} className="w-full px-4 py-2 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-all">
                        Sign In
                      </motion.button>
                    </Link>
                    {/* MODIFIED HERE */}
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <motion.button whileTap={{ scale: 0.95 }} className="w-full px-4 py-2 text-base font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all shadow-sm">
                        Get Started Free
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
        {/* Hero Section */}
        <header id="hero" ref={heroRef} className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="heroGrid" patternUnits="userSpaceOnUse" width="40" height="40"><path d="M0 40V0h40" fill="none" stroke="rgba(203, 213, 225, 0.5)" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#heroGrid)"/></svg>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                className="text-center lg:text-left"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{ y: textY }}
              >
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight"
                >
                  <span className="block">Social Media Automation</span>
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mt-1">
                    Powered by AI
                  </span>
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0"
                >
                  Automate content creation, smart scheduling, and engagement tracking. Maximize your online presence with AI-powered efficiency and save valuable time.
                </motion.p>

                {/* CORRECTED BUTTONS CONTAINER */}
                <motion.div
                  variants={itemVariants}
                  className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
                >
                  <Link to="/auth">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2, boxShadow: "0px 8px 20px rgba(79, 70, 229, 0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform"
                      >
                        Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                      </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2, boxShadow: "0px 8px 20px rgba(100, 116, 139, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold bg-white text-indigo-600 rounded-lg shadow-lg hover:bg-gray-50 border border-gray-300 transition-all transform"
                    // Add onClick handler for demo if needed
                  >
                    Watch Demo
                  </motion.button>
                </motion.div>
                {/* END CORRECTED BUTTONS CONTAINER */}

                {/* Commented out section was moved out of the button container's parent */}
                <motion.div variants={itemVariants} className="mt-10 text-sm text-gray-500">
                  {/* No credit card required • Cancel anytime */}
                </motion.div>
              </motion.div> {/* End of text content div */}


              {/* Image Div - This should be the sibling to the text content div for lg:grid-cols-2 to work */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3, ease: "backOut" }}
                style={{ y: imageY }}
              >
                <div className="aspect-[4/3] md:aspect-[16/10] bg-slate-200 rounded-xl shadow-2xl overflow-hidden border-4 border-white">
                  <img
                    className="w-full h-full object-contain" // Changed to object-cover for better fitting, or object-contain if aspect ratio is critical
                    src={dashboardImageFromFile}
                    alt="SocialSync Dashboard Preview"
                  />
                </div>
                {/* ... (pop-up elements) ... */}
                <motion.div
                  variants={popUpVariants} initial="hidden" animate="visible" transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 15 }}
                  className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 bg-white p-3 sm:p-4 rounded-lg shadow-xl border border-gray-200"
                >
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-green-100 rounded-full">
                      <FaChartLine className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">300% Engagement</p>
                      <p className="text-xs text-gray-500">Increase in 30 days</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  variants={popUpVariants} initial="hidden" animate="visible" transition={{ delay: 1.0, type: "spring", stiffness: 200, damping: 15 }}
                  className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 bg-white p-3 sm:p-4 rounded-lg shadow-xl border border-gray-200"
                >
                   <div className="flex items-center space-x-2">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <FaMagic className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">AI Content</p>
                      <p className="text-xs text-gray-500">Generated in seconds</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div> {/* End of image content div */}

            </div> {/* End of lg:grid-cols-2 */}
          </div> {/* End of max-w-7xl */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0px]">
            <svg className="w-full h-[70px] sm:h-[100px] md:h-[120px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-current text-indigo-200"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-current text-indigo-200"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-current text-gray-50"></path>
            </svg>
          </div>
        </header>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.5 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Everything you need, <span className="text-indigo-600">nothing you don't.</span></h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Streamline your social media with our intelligent toolkit, designed for impact and ease of use.
              </p>
            </motion.div>
            <motion.div
              className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              initial="hidden"
              whileInView="visible"
              variants={containerVariants}
              viewport={{ once: true, amount: 0.2 }}
            >
              {featuresData.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="group relative bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 ${feature.color} flex items-center justify-center rounded-full shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="mt-8 text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-3 text-sm text-gray-500">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-28 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
             <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.5 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Get Started in <span className="text-indigo-600">3 Simple Steps</span></h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Effortlessly launch your AI-powered social media strategy.
              </p>
            </motion.div>
            <motion.div
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative"
              initial="hidden"
              whileInView="visible"
              variants={containerVariants}
              viewport={{ once: true, amount: 0.2 }}
            >
              {stepsData.map((step, index) => (
                <motion.div
                  key={step.step}
                  variants={itemVariants}
                  className="relative bg-white p-8 rounded-xl shadow-xl flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105"
                >
                  <div className={`absolute -top-5 w-12 h-12 ${step.color} text-white flex items-center justify-center rounded-full shadow-lg font-bold text-xl`}>
                    {step.step}
                  </div>
                  <div className={`w-20 h-20 ${step.color} flex items-center justify-center rounded-full shadow-lg mb-6 mt-4`}>
                    {React.cloneElement(step.icon, { className: "text-white text-4xl" })}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-3 text-sm text-gray-500">{step.description}</p>

                  {index < stepsData.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-1/3 h-1">
                      <svg width="100%" height="100%" viewBox="0 0 100 2" preserveAspectRatio="none" className="absolute top-1/2 -translate-y-1/2">
                        <line x1="0" y1="1" x2="100" y2="1" strokeDasharray="5,5" className="stroke-current text-indigo-300" strokeWidth="2"/>
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-gradient-to-r from-indigo-600 to-purple-700">
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
                Ready to Supercharge Your Social Media?
              </h2>
              <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-10">
                Join thousands of marketers who trust SocialSync to automate tasks, create stunning content, and drive real results.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link to="/auth">
                  <motion.button // Changed from motion.a to motion.button inside Link
                    whileHover={{ scale: 1.05, y: -2, boxShadow: "0px 10px 25px rgba(255, 255, 255, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold bg-white text-indigo-600 rounded-lg shadow-xl hover:bg-gray-50 transition-all transform"
                  >
                    Get Started Now
                  </motion.button>
                </Link>
                <motion.a
                  href="#" // Placeholder for demo link/modal
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white rounded-lg hover:bg-white/10 border-2 border-white/50 hover:border-white transition-all transform"
                >
                  Request a Demo
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-6 lg:px-12">
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.5 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Frequently Asked <span className="text-indigo-600">Questions</span></h2>
              <p className="mt-4 text-lg text-gray-600">
                Got questions? We've got answers. If you don't see your query here, feel free to contact us.
              </p>
            </motion.div>
            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full text-left p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-opacity-75"
                  >
                    <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                    <motion.div animate={{ rotate: openFaq === index ? 180 : 0 }}>
                      <ChevronDown className="w-6 h-6 text-indigo-600" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="px-6 pb-6"
                      >
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-800 text-gray-400 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
              <div className="lg:col-span-2">
                <Link to="/#hero" className="flex items-center space-x-2 mb-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="SocialSync Logo" className="h-8 w-auto filter brightness-0 invert"/>
                  <span className="text-xl font-bold text-white">SocialSync</span>
                </Link>
                <p className="text-sm mb-6 max-w-xs">
                  Elevate your social media presence with AI-driven automation, content creation, and analytics.
                </p>
                <div className="flex space-x-5">
                  {[
                    { icon: <FaTwitter />, href: "#", label: "Twitter" }, { icon: <FaFacebookF />, href: "#", label: "Facebook" },
                    { icon: <FaInstagram />, href: "#", label: "Instagram" }, { icon: <FaLinkedinIn />, href: "#", label: "LinkedIn" },
                  ].map((social) => (
                    <motion.a key={social.label} href={social.href} aria-label={social.label} whileHover={{ y: -2, color: "#818cf8" }} className="text-gray-400 hover:text-indigo-400 transition-colors">
                      {React.cloneElement(social.icon, {size: 20})}
                    </motion.a>
                  ))}
                </div>
              </div>
              {[
                { title: "Product", links: ["Features"] },
                { title: "Company", links: ["About Us", "Contact Us"] },
                { title: "Resources", links: ["Help Center", "Community"] },
              ].map(column => (
                <div key={column.title}>
                  <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-5">{column.title}</h3>
                  <ul className="space-y-3">
                    {column.links.map(link => (
                      <li key={link}>
                        <a href="#" className="text-sm hover:text-indigo-400 transition-colors">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-slate-700 text-center text-sm">
              <p>© {new Date().getFullYear()} SocialSync All rights reserved.</p>
              <p className="mt-1">
                <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a> • <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SocialSyncLanding;