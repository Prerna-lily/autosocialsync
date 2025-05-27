// // // // import React from "react";
// // // // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // // // import Dashboard from "./pages/Dashboard";
// // // // import CalendarPage from "./pages/CalendarPage";
// // // // import ContentCalendar from "./pages/ContentCalendar";
// // // // import CreateCampaign from "./pages/CreateCampaign";
// // // // import CampaignPage from './pages/CampaignPage';
// // // // import CreatePost from "./pages/CreatePost";
// // // // import ChatSupport from "./pages/ChatSupport";
// // // // import SocialDashboard from "./pages/SocialDashboard"; // Make sure this import exists
// // // // import Library from './pages/Library';
// // // // import Sidebar from "./components/Sidebar"
// // // // import SavedCampaigns from './pages/SavedCampaigns';
// // // //
// // // // const App = () => {
// // // //   return (
// // // //     <Router>
// // // //       <Routes>
// // // //         <Route path="/" element={<Dashboard />} />
// // // //         <Route path="/calendar" element={<CalendarPage />} />
// // // //         <Route path="/content-calendar" element={<ContentCalendar />} />
// // // //         <Route path="/create-campaign" element={<CreateCampaign />} />
// // // //         <Route path="/campaign" element={<CampaignPage />} />
// // // //         <Route path="/saved-campaigns" element={<SavedCampaigns />} />
// // // //         <Route path="/campaign/:campaignId" element={<CampaignPage />} />
// // // //         <Route path="/create-post" element={<CreatePost />} />  {/* Add this route */}
// // // //         <Route path="/chat-support" element={<ChatSupport />} />
// // // //         <Route path="library" element={<Library />} />
// // // //         <Route path="/social-dashboard" element={<SocialDashboard />} />
// // // //       </Routes>
// // // //     </Router>
// // // //   );
// // // // };
// // // //
// // // // export default App;
// // //
// // //
// // //
// // //
// // // import React from "react";
// // // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // // import Dashboard from "./pages/Dashboard";
// // // import CalendarPage from "./pages/CalendarPage";
// // // import ContentCalendar from "./pages/ContentCalendar";
// // // import CreateCampaign from "./pages/CreateCampaign";
// // // import CampaignPage from './pages/CampaignPage';
// // // import CreatePost from "./pages/CreatePost";
// // // import ChatSupport from "./pages/ChatSupport";
// // // import SocialDashboard from "./pages/SocialDashboard";
// // // import DraftsPage from './pages/DraftsPage';
// // // import Accounts from './pages/Accounts';
// // // import SavedCampaigns from './pages/SavedCampaigns';
// // //
// // // const App = () => {
// // //   return (
// // //     <Router>
// // //       <Routes>
// // //         <Route path="/" element={<SocialDashboard />} />
// // //         <Route path="/calendar" element={<CalendarPage />} />
// // //         <Route path="/content-calendar" element={<ContentCalendar />} />
// // //         <Route path="/create-campaign" element={<CreateCampaign />} />
// // //         <Route path="/campaign" element={<CampaignPage />} />
// // //         <Route path="/saved-campaigns" element={<SavedCampaigns />} />
// // //         <Route path="/campaign/:campaignId" element={<CampaignPage />} />
// // //         <Route path="/create-post" element={<CreatePost />} />
// // //         <Route path="/chat-support" element={<ChatSupport />} />
// // //         <Route path="/drafts-page" element={<DraftsPage />} />
// // //         <Route path="/accounts" element={<Accounts />} />
// // //         <Route path="/social-dashboard" element={<SocialDashboard />} />
// // //       </Routes>
// // //     </Router>
// // //   );
// // // };
// // //
// // // export default App;
// // //
// // //
// // //
// // //
// // // frontend/src/App.js
// // import React from "react";
// // import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// //
// // // Import your page components
// // import AuthPage from "./pages/AuthPage";
// // import SocialDashboard from "./pages/SocialDashboard";
// // import Dashboard from "./pages/Dashboard"; // Assuming this is a different dashboard
// // import CalendarPage from "./pages/CalendarPage";
// // import ContentCalendar from "./pages/ContentCalendar";
// // import CreateCampaign from "./pages/CreateCampaign";
// // import CampaignPage from './pages/CampaignPage';
// // import CreatePost from "./pages/CreatePost";
// // import ChatSupport from "./pages/ChatSupport";
// // import DraftsPage from './pages/DraftsPage';
// // import Accounts from './pages/Accounts';
// // import SavedCampaigns from './pages/SavedCampaigns';
// //
// // // A mock function for checking authentication status.
// // // Replace this with your actual auth state management (e.g., context, Redux, Zustand).
// // const useAuth = () => {
// //   // Example: Check if a user token exists in localStorage
// //   // const token = localStorage.getItem('authToken');
// //   // return { isAuthenticated: !!token };
// //   return { isAuthenticated: false }; // Default to not authenticated for this example
// // };
// //
// // // ProtectedRoute component (basic example)
// // const ProtectedRoute = ({ children }) => {
// //   const { isAuthenticated } = useAuth(); // This will need to be reactive in a real app
// //   if (!isAuthenticated) {
// //     // If not using a reactive auth state, this might not re-render correctly
// //     // after login unless the app reloads or auth state is managed globally.
// //     // For now, navigation from AuthPage handles the redirect.
// //     // return <Navigate to="/auth" replace />;
// //   }
// //   return children;
// // };
// //
// // const App = () => {
// //   return (
// //     <Router>
// //       <Routes>
// //         {/* Authentication Route */}
// //         <Route path="/auth" element={<AuthPage />} />
// //
// //         {/* Application Routes */}
// //         {/* Redirect to /auth if trying to access root and not authenticated */}
// //         {/* For now, we directly navigate from AuthPage on login success. */}
// //         <Route path="/" element={<Navigate to="/auth" replace />} />
// //
// //         {/* Social Dashboard - assuming this is the main page after login */}
// //         <Route
// //           path="/social-dashboard"
// //           element={
// //             // <ProtectedRoute> // Wrap with ProtectedRoute once auth state is robust
// //               <SocialDashboard />
// //             // </ProtectedRoute>
// //           }
// //         />
// //
// //         {/* Other application routes */}
// //         <Route path="/dashboard" element={<Dashboard />} />
// //         <Route path="/calendar" element={<CalendarPage />} />
// //         <Route path="/content-calendar" element={<ContentCalendar />} />
// //         <Route path="/create-campaign" element={<CreateCampaign />} />
// //         <Route path="/campaign" element={<CampaignPage />} />
// //         <Route path="/saved-campaigns" element={<SavedCampaigns />} />
// //         <Route path="/campaign/:campaignId" element={<CampaignPage />} />
// //         <Route path="/create-post" element={<CreatePost />} />
// //         <Route path="/chat-support" element={<ChatSupport />} />
// //         <Route path="/drafts-page" element={<DraftsPage />} />
// //         <Route path="/accounts" element={<Accounts />} />
// //
// //         {/* Fallback for old login/register paths to the new auth page */}
// //         <Route path="/login" element={<Navigate to="/auth" replace />} />
// //         <Route path="/register" element={<Navigate to="/auth" replace />} />
// //
// //         {/* You might want a 404 Not Found page as well */}
// //         {/* <Route path="*" element={<NotFoundPage />} /> */}
// //       </Routes>
// //     </Router>
// //   );
// // };
// //
// // export default App;
//
// // frontend/src/App.js
// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
//
// // Import your page components
// import SocialSyncLanding from "./pages/SocialSyncLanding"; // <--- IMPORT LANDING PAGE
// import AuthPage from "./pages/AuthPage";
// import SocialDashboard from "./pages/SocialDashboard";
// import Dashboard from "./pages/Dashboard";
// import CalendarPage from "./pages/CalendarPage";
// import ContentCalendar from "./pages/ContentCalendar";
// import CreateCampaign from "./pages/CreateCampaign";
// import CampaignPage from './pages/CampaignPage';
// import CreatePost from "./pages/CreatePost";
// import ChatSupport from "./pages/ChatSupport";
// import DraftsPage from './pages/DraftsPage';
// import Accounts from './pages/Accounts';
// import SavedCampaigns from './pages/SavedCampaigns';
//
// // A mock function for checking authentication status.
// // Replace this with your actual auth state management (e.g., context, Redux, Zustand).
// const useAuth = () => {
//   // Example: Check if a user token exists in localStorage
//   // For a real app, this should come from your auth context or state.
//   // const token = localStorage.getItem('authToken');
//   // return { isAuthenticated: !!token };
//   return { isAuthenticated: false }; // Default to not authenticated for this example
// };
//
// // ProtectedRoute component (basic example)
// // In a real app, isAuthenticated would come from a context/state manager
// // and this component would reactively re-render.
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   // If you implement real auth, uncomment this and ensure useAuth is reactive
//   // if (!isAuthenticated) {
//   //   return <Navigate to="/auth" replace />;
//   // }
//   return children;
// };
//
// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         {/* Landing Page Route - Make this the default route */}
//         <Route path="/" element={<SocialSyncLanding />} /> {/* <--- ADDED LANDING PAGE ROUTE */}
//
//         {/* Authentication Route */}
//         <Route path="/auth" element={<AuthPage />} />
//
//         {/* Social Dashboard - assuming this is the main page after login */}
//         <Route
//           path="/social-dashboard"
//           element={
//             // For a real app, you'd wrap this with ProtectedRoute
//             // <ProtectedRoute>
//               <SocialDashboard />
//             // </ProtectedRoute>
//           }
//         />
//
//         {/* Other application routes (can also be protected) */}
//         <Route path="/dashboard" element={<Dashboard />} /> {/* Example, protect if needed */}
//         <Route path="/calendar" element={<CalendarPage />} />
//         <Route path="/content-calendar" element={<ContentCalendar />} />
//         <Route path="/create-campaign" element={<CreateCampaign />} />
//         <Route path="/campaign" element={<CampaignPage />} />
//         <Route path="/saved-campaigns" element={<SavedCampaigns />} />
//         <Route path="/campaign/:campaignId" element={<CampaignPage />} />
//         <Route path="/create-post" element={<CreatePost />} />
//         <Route path="/chat-support" element={<ChatSupport />} />
//         <Route path="/drafts-page" element={<DraftsPage />} />
//         <Route path="/accounts" element={<Accounts />} />
//
//         {/* Fallback for old login/register paths to the new auth page */}
//         <Route path="/login" element={<Navigate to="/auth" replace />} />
//         <Route path="/register" element={<Navigate to="/auth" replace />} />
//
//         {/* Optional: Catch-all for 404 Not Found page */}
//         {/* <Route path="*" element={<NotFoundPage />} /> */}
//       </Routes>
//     </Router>
//   );
// };
//
// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import page components
import SocialSyncLanding from "./pages/SocialSyncLanding";
import AuthPage from "./pages/AuthPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SocialDashboard from "./pages/SocialDashboard";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/CalendarPage";
import ContentCalendar from "./pages/ContentCalendar";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignPage from "./pages/CampaignPage";
import CreatePost from "./pages/CreatePost";
import ChatSupport from "./pages/ChatSupport";
import DraftsPage from "./pages/DraftsPage";
import Accounts from "./pages/Accounts";
import SavedCampaigns from "./pages/SavedCampaigns";

// Mock auth function - replace with real auth state management (e.g., context, Redux, Zustand)
const useAuth = () => {
  // Example: Check if a user token exists in localStorage
  // const token = localStorage.getItem('authToken');
  // return { isAuthenticated: !!token };
  return { isAuthenticated: false }; // Default to not authenticated
};

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  // Uncomment when real auth is implemented
  // if (!isAuthenticated) {
  //   return <Navigate to="/auth" replace />;
  // }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page - Default route */}
        <Route path="/" element={<SocialSyncLanding />} />

        {/* Authentication Routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/social-dashboard"
          element={
            <ProtectedRoute>
              <SocialDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/content-calendar"
          element={
            <ProtectedRoute>
              <ContentCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-campaign"
          element={
            <ProtectedRoute>
              <CreateCampaign />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaign"
          element={
            <ProtectedRoute>
              <CampaignPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-campaigns"
          element={
            <ProtectedRoute>
              <SavedCampaigns />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaign/:campaignId"
          element={
            <ProtectedRoute>
              <CampaignPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat-support"
          element={
            <ProtectedRoute>
              <ChatSupport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drafts-page"
          element={
            <ProtectedRoute>
              <DraftsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <Accounts />
            </ProtectedRoute>
          }
        />

        {/* Redirects for legacy paths */}
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth" replace />} />

        {/* Optional: Catch-all for 404 */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
};

export default App;