import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/Landingpage";
import About from "../pages/About";
import Pricing from "../components/Pricing";
import BlogsList from "../waruziko/BlogsList";      // Add BlogsList import
import BlogDetail from "../waruziko/BlogDetail";   // Add BlogDetail import
import FlightTicketing from "../pages/FlightTicketing";
import LogisticsQuotation from "../pages/LogisticsQuotation";
import SubmissionsDashboard from "../pages/SubmissionsDashboard";
import SubmissionDetail from "../pages/SubmissionDetail";

const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/flight-ticketing" element={<FlightTicketing />} />
        <Route path="/logistics-quotation" element={<LogisticsQuotation />} />
        <Route path="/admin/submissions" element={<SubmissionsDashboard />} />
        <Route path="/admin/submissions/:formType/:id" element={<SubmissionDetail />} />
        
        {/* Add Blog Routes */}
        <Route path="/blogs" element={<BlogsList />} />           {/* List of all blogs */}
        <Route path="/blogs/:id" element={<BlogDetail />} />      {/* Individual blog detail */}
        
        {/* Optional: Redirect for invalid routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AllRoutes;