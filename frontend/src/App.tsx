import { Routes, Route, Navigate } from "react-router-dom"
// import LandingPage from "./pages/LandingPage/LandingPage"
import DashboardPage from "./pages/Dashboard/DashboardPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegistrationPage from "./pages/Auth/RegistrationPage";
import EditorPage from "./pages/EditorPage/EditorPage";
import { useAuth } from "./contexts/AuthContext";
import { ResumeProvider } from "./contexts/ResumeContext";
import { ThemeToggle } from "./components/ThemeToggle";

function App() {
  const { user } = useAuth();

  return (
    <>
      <ResumeProvider>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route
            path="/dashboard"
            element={user ? <DashboardPage /> : <Navigate to="/login" replace />}
          />
          <Route 
          path="/editor/:id" 
          element={user ? <EditorPage /> : <Navigate to="/login" replace />} 
          /> 
        </Routes>
      </ResumeProvider>
      <ThemeToggle/>
    </>
  );
}

export default App;
