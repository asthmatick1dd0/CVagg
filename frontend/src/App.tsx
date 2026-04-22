import { Routes, Route, Navigate } from "react-router-dom"
import LandingPage from "./pages/LandingPage/LandingPage"
import DashboardPage from "./pages/Dashboard/DashboardPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegistrationPage from "./pages/Auth/RegistrationPage";
import EditorPage from "./pages/EditorPage/EditorPage";
import { useAuth } from "./contexts/AuthContext";
import { ResumeProvider } from "./contexts/ResumeContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ResumeProvider>
      <Routes>
        <Route path="/login" element={<EditorPage />} />
        <Route path="/" element={<LandingPage/>} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/registration"
          element={user ? <Navigate to="/editor/:id" replace /> : <RegistrationPage />}
        />
        <Route
          path="/dashboard"
          element={user ? <DashboardPage /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </ResumeProvider>
  );
};

export default App;