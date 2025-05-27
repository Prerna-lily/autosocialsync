import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUser, FiMail, FiLock, FiBriefcase, FiLogIn, FiUserPlus, FiLoader, FiEye, FiEyeOff } from "react-icons/fi"; // Added FiEye, FiEyeOff

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/auth";

const AuthPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organizationName: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 30, scale: 0.98 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      overflow: 'hidden',
      transition: { duration: 0.2 }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const toggleMode = (mode) => {
    if (mode === isLoginMode) return; // Avoid re-render if already in the target mode
    setIsLoginMode(mode);
    setFormData({
      fullName: "",
      email: mode ? formData.email : "", // Keep email if switching from register to login
      organizationName: "",
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { fullName, email, organizationName, password } = formData;

    if (isLoginMode) {
      if (!email || !password) {
        toast.error("Email and Password are required for login.");
        triggerShake();
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
        toast.success(response.data.message || "Login successful!");
        // Store token or user info if necessary
        // e.g., localStorage.setItem('token', response.data.token);
        setTimeout(() => {
          navigate("/social-dashboard");
        }, 1500);
      } catch (err) {
        toast.error(err.response?.data?.detail || "Login failed. Please check your credentials.");
        triggerShake();
      }
    } else { // Registration mode
      if (!fullName || !email || !organizationName || !password) {
        toast.error("All fields are required for registration.");
        triggerShake();
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        triggerShake();
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.post(`${API_BASE_URL}/register`, {
          full_name: fullName,
          email,
          organization_name: organizationName,
          password,
        });
        toast.success("Registration successful! Please login to continue.");
        setIsLoginMode(true); // Switch to login mode
        setFormData({ // Clear form, keeping email for convenience
          fullName: "",
          email: email,
          organizationName: "",
          password: "",
        });
      } catch (err) {
        toast.error(err.response?.data?.detail || "Registration failed. Please try again.");
        triggerShake();
      }
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-100 to-indigo-100 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white"
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        className={`w-full max-w-md ${shake ? "animate-form-shake" : ""}`}
      >
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/70">
          <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500"></div>

          <div className="relative flex items-center justify-center py-5 px-4">
            <div className="relative w-72 h-12 bg-indigo-50 rounded-full p-1 flex items-center">
              <motion.div
                className="absolute top-1 left-1 w-1/2 h-10 rounded-full bg-indigo-600 shadow-md"
                animate={isLoginMode ? { x: 0 } : { x: "100%" }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
              <button
                type="button"
                className={`relative flex-1 h-full rounded-full text-sm font-medium z-10 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-50 ${
                  isLoginMode ? "text-white" : "text-indigo-700 hover:text-indigo-900"
                }`}
                onClick={() => toggleMode(true)}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`relative flex-1 h-full rounded-full text-sm font-medium z-10 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-50 ${
                  !isLoginMode ? "text-white" : "text-indigo-700 hover:text-indigo-900"
                }`}
                onClick={() => toggleMode(false)}
              >
                Register
              </button>
            </div>
          </div>

          <div className="px-8 pb-8 pt-2">
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800">
                {isLoginMode ? "Welcome Back!" : "Create Account"}
              </h2>
              <p className="text-slate-500 mt-2 text-sm">
                {isLoginMode
                  ? "Sign in to access your SocialSync dashboard."
                  : "Join SocialSync and streamline your social media."}
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="popLayout">
                {!isLoginMode && (
                  <motion.div
                    key="fullName"
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <div className="relative">
                      <FiUser className="absolute top-1/2 left-3.5 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        required={!isLoginMode}
                        value={formData.fullName}
                        onChange={handleChange}
                        className="pl-11 w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 placeholder-slate-400"
                        placeholder="Full Name"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="popLayout">
                {!isLoginMode && (
                  <motion.div
                    key="organizationName"
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <div className="relative">
                      <FiBriefcase className="absolute top-1/2 left-3.5 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        id="organizationName"
                        name="organizationName"
                        type="text"
                        autoComplete="organization"
                        required={!isLoginMode}
                        value={formData.organizationName}
                        onChange={handleChange}
                        className="pl-11 w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 placeholder-slate-400"
                        placeholder="Organization Name"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={itemVariants}>
                <div className="relative">
                  <FiMail className="absolute top-1/2 left-3.5 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-11 w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 placeholder-slate-400"
                    placeholder="Email address"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative">
                  <FiLock className="absolute top-1/2 left-3.5 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isLoginMode ? "current-password" : "new-password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-11 pr-10 w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 placeholder-slate-400"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {isLoginMode && (
                <motion.div variants={itemVariants} className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-1 rounded"
                  >
                    Forgot password?
                  </button>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white
                    ${ isLoginMode
                      ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                      : "bg-sky-600 hover:bg-sky-700 focus:ring-sky-500"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2
                    transition-all duration-200 ease-in-out transform hover:scale-[1.02]
                    ${isLoading ? "opacity-70 cursor-not-allowed" : "active:scale-[0.98]"}`}
                >
                  {isLoading ? (
                    <>
                      <FiLoader className="animate-spin mr-2.5 h-5 w-5" />
                      {isLoginMode ? "Signing In..." : "Creating Account..."}
                    </>
                  ) : (
                    <>
                      {isLoginMode ? (
                        <>
                          <FiLogIn className="mr-2.5 h-5 w-5" />
                          Sign In
                        </>
                      ) : (
                        <>
                          <FiUserPlus className="mr-2.5 h-5 w-5" />
                          Create Account
                        </>
                      )}
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-slate-500">
                    {isLoginMode ? "New to SocialSync?" : "Already have an account?"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleMode(!isLoginMode)}
                className="mt-4 w-full text-center py-2.5 px-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 rounded-lg"
              >
                {isLoginMode ? "Create your SocialSync account" : "Sign in to your account"}
              </button>
            </motion.div>
          </div>
        </div>

        <motion.div variants={itemVariants} className="mt-8 text-center text-xs text-slate-500">
          <p>
            By continuing, you agree to our{" "}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </motion.div>
      </motion.div>

      {/* This style tag is for the custom shake animation.
          Ideally, this would be in your global CSS or tailwind.config.js */}
      <style>
        {`
          @keyframes formShake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
            20%, 40%, 60%, 80% { transform: translateX(6px); }
          }
          .animate-form-shake {
            animation: formShake 0.4s cubic-bezier(.36,.07,.19,.97) both;
          }
        `}
      </style>
    </motion.div>
  );
};

export default AuthPage;