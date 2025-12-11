import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import LoginPage from "./pages/LoginPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";

// Layout & Pages Baru
import MainLayout from "./layouts/MainLayout";
import AnalyticsPage from "./pages/AnalyticsPage";
import LeadsDataPage from "./pages/LeadsDataPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const handleLoginSuccess = (userName) => {
    console.log("Login Berhasil! User:", userName);
  };

  return (
    <ThemeProvider>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />

        <Route path="/dashboard" element={<MainLayout />}>
          <Route
            index
            element={<Navigate to="/dashboard/leads" replace />}
          />

          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="leads" element={<LeadsDataPage />} />
          <Route path="leads/:id" element={<CustomerDetailPage />} />

          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
