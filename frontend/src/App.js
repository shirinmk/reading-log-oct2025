

// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import {Navigate } from "react-router-dom";
// // import HomePage from "./pages/HomePage";
// // import Signup from "./pages/Signup";
// // import Dashboard from "./pages/Dashboard";
// // import SignIn from "./pages/SignIn";
// // import AuthProvider from "./context/AuthContext";
// // import ProtectedRoutes from "./components/ProtectedRoutes";

// // import ReaderForm from "./components/ReaderForm";
// // import ReaderProfile from "./pages/ReaderProfile";
// // import BadgesPage from "./pages/BadgesPage";
// // import AdminReports from "./pages/AdminReports";
// // import AdminLogin from "./pages/AdminLogin";
// // import ForgotPassword from "./pages/ForgotPassword";
// // import ResetPassword from "./pages/ResetPassword";
// // import ForgotUsername from "./pages/ForgotUsername";
// // import ContactSupport from "./pages/ContactSupport";
// // import VerifyPage from "./pages/VerifyPage";
// // import ResendVerification from "./pages/ResendVerification";
// // import EditReaderPage from "./pages/EditReaderPage";
// // import AdminLibraryDashboard from "./pages/AdminLibraryDashboard";
// // import SelectSchoolPage from "./pages/SelectSchoolPage";
// // import AdminDashboard from "./pages/AdminDashboard"; // ✅ new unified dashboard


// // function App() {
// //   //  const selectedSchool = localStorage.getItem("schoolId");
// //   //  const schoolId = localStorage.getItem("schoolId");

// //   return (
// //     <AuthProvider>
// //       <Router>
// //         <Routes>
// //           {/* Public Routes */}
// //           {/* <Route path="/select-school" element={<SelectSchoolPage />} />
// //           <Route path="/" element={<HomePage />} /> */}
// //            <Route
// //         path="/"
// //         element={
// //           selectedSchool ? <HomePage /> : <Navigate to="/select-school" />
// //         }
// //       />

// //       <Route path="/select-school" element={<SelectSchoolPage />} />
// //       <Route path="/sign-in" element={<SignIn />} />

// //       {/* Optional fallback */}
// //       <Route path="*" element={<Navigate to="/" />} />
// //           <Route path="/sign-in" element={<SignIn />} />
// //           <Route path="/signup" element={<Signup />} />

// //           {/* Reader Profile */}
// //           <Route path="/profile/:id" element={<ReaderProfile />} />

// //           {/* Protected Routes */}
// //           <Route
// //             path="/dashboard"
// //             element={
// //               <ProtectedRoutes>
// //                 <Dashboard />
// //               </ProtectedRoutes>
// //             }
// //           />
// //           <Route
// //             path="/add-reader"
// //             element={
// //               <ProtectedRoutes>
// //                 <ReaderForm />
// //               </ProtectedRoutes>
// //             }
// //           />
// //           <Route path="/readers/:id/badges" element={<BadgesPage />} />
// //           {/* <Route path="/admin/reports" element={<AdminReports />} /> */}
// //           <Route path="/admin/login" element={<AdminLogin />} />
// //           <Route path="/forgot-password" element={<ForgotPassword />} />
// //           <Route path="/reset-password/:token" element={<ResetPassword />} />
// //           <Route path="/forgot-username" element={<ForgotUsername />} />
// //           <Route path="/contact-support" element={<ContactSupport />} />
// //           <Route path="/verify" element={<VerifyPage />} />
// //           <Route path="/resend-verification" element={<ResendVerification />} />
// //           <Route path="/edit-reader/:id" element={<EditReaderPage />} />

// //           {/* Admin - Librarian page */}
// //         {/* <Route path="/admin/library" element={<AdminLibraryDashboard />} /> */}
// //         <Route
// //   path="/admin/dashboard"
// //   element={
// //     <ProtectedRoutes>
// //       <AdminDashboard />
// //     </ProtectedRoutes>
// //   }
// // />

// //         </Routes>
// //       </Router>
// //     </AuthProvider>
// //   );
// // }

// // export default App;


// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import SignIn from "./pages/SignIn";
// import AuthProvider from "./context/AuthContext";
// import ProtectedRoutes from "./components/ProtectedRoutes";

// import ReaderForm from "./components/ReaderForm";
// import ReaderProfile from "./pages/ReaderProfile";
// import BadgesPage from "./pages/BadgesPage";
// import AdminReports from "./pages/AdminReports";
// import AdminLogin from "./pages/AdminLogin";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
// import ForgotUsername from "./pages/ForgotUsername";
// import ContactSupport from "./pages/ContactSupport";
// import VerifyPage from "./pages/VerifyPage";
// import ResendVerification from "./pages/ResendVerification";
// import EditReaderPage from "./pages/EditReaderPage";
// import AdminLibraryDashboard from "./pages/AdminLibraryDashboard";
// import SelectSchoolPage from "./pages/SelectSchoolPage";
// import AdminDashboard from "./pages/AdminDashboard"; // ✅ new unified dashboard

// function App() {
//   // ✅ Retrieve school selection from localStorage
//   const selectedSchool = localStorage.getItem("schoolId");

//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* ==================== PUBLIC ROUTES ==================== */}
//           <Route
//             path="/"
//             element={
//               selectedSchool ? <HomePage /> : <Navigate to="/select-school" replace />
//             }
//           />
//           <Route path="/select-school" element={<SelectSchoolPage />} />
//           <Route path="/sign-in" element={<SignIn />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password/:token" element={<ResetPassword />} />
//           <Route path="/forgot-username" element={<ForgotUsername />} />
//           <Route path="/contact-support" element={<ContactSupport />} />
//           <Route path="/verify" element={<VerifyPage />} />
//           <Route path="/resend-verification" element={<ResendVerification />} />

//           {/* ==================== PROTECTED USER ROUTES ==================== */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoutes>
//                 <Dashboard />
//               </ProtectedRoutes>
//             }
//           />
//           <Route
//             path="/add-reader"
//             element={
//               <ProtectedRoutes>
//                 <ReaderForm />
//               </ProtectedRoutes>
//             }
//           />
//           <Route path="/profile/:id" element={<ReaderProfile />} />
//           <Route path="/readers/:id/badges" element={<BadgesPage />} />
//           <Route path="/edit-reader/:id" element={<EditReaderPage />} />

//           {/* ==================== ADMIN ROUTES ==================== */}
//           <Route path="/admin/login" element={<AdminLogin />} />
//           <Route
//             path="/admin/dashboard"
//             element={
//               <ProtectedRoutes>
//                 <AdminDashboard />
//               </ProtectedRoutes>
//             }
//           />
//           <Route
//             path="/admin/library"
//             element={
//               <ProtectedRoutes>
//                 <AdminLibraryDashboard />
//               </ProtectedRoutes>
//             }
//           />

//           {/* ==================== FALLBACK ==================== */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import AuthProvider from "./context/AuthContext";
import ProtectedRoutes from "./components/ProtectedRoutes";

import ReaderForm from "./components/ReaderForm";
import ReaderProfile from "./pages/ReaderProfile";
import BadgesPage from "./pages/BadgesPage";
import AdminReports from "./pages/AdminReports";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ForgotUsername from "./pages/ForgotUsername";
import ContactSupport from "./pages/ContactSupport";
import VerifyPage from "./pages/VerifyPage";
import ResendVerification from "./pages/ResendVerification";
import EditReaderPage from "./pages/EditReaderPage";
import AdminLibraryDashboard from "./pages/AdminLibraryDashboard";
import SelectSchoolPage from "./pages/SelectSchoolPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [schoolId, setSchoolId] = useState(localStorage.getItem("schoolId"));

  // ✅ Listen for localStorage changes (e.g., after selecting a school)
  useEffect(() => {
    const handleStorageChange = () => {
      setSchoolId(localStorage.getItem("schoolId"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route
            path="/"
            element={
              schoolId ? <HomePage /> : <Navigate to="/select-school" replace />
            }
          />
          <Route path="/select-school" element={<SelectSchoolPage setSchoolId={setSchoolId} />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-username" element={<ForgotUsername />} />
          <Route path="/contact-support" element={<ContactSupport />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/resend-verification" element={<ResendVerification />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/add-reader"
            element={
              <ProtectedRoutes>
                <ReaderForm />
              </ProtectedRoutes>
            }
          />
          <Route path="/profile/:id" element={<ReaderProfile />} />
          <Route path="/readers/:id/badges" element={<BadgesPage />} />
          <Route path="/edit-reader/:id" element={<EditReaderPage />} />

          {/* ADMIN ROUTES */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoutes>
                <AdminDashboard />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/admin/library"
            element={
              <ProtectedRoutes>
                <AdminLibraryDashboard />
              </ProtectedRoutes>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
