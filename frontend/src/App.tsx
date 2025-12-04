import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage/LandingPage"
import DashboardPage from "./pages/Dashboard/DashboardPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegistrationPage from "./pages/Auth/RegistrationPage";
import EditorPage from "./pages/EditorPage/EditorPage";
import { ResumeProvider } from "./contexts/ResumeContext";

function App() {
  return (
    <>
    <ResumeProvider>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/resume" element={<EditorPage/>} />
      </Routes>
    </ResumeProvider>
    </>
  );
};

export default App;
