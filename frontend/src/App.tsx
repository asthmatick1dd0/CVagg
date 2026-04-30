import { Routes, Route, Navigate } from "react-router-dom"
import LandingPage from "./pages/LandingPage/LandingPage"
import DashboardPage from "./pages/Dashboard/DashboardPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegistrationPage from "./pages/Auth/RegistrationPage";
import EditorPage from "./pages/EditorPage/EditorPage";
import { useAuth } from "./contexts/AuthContext";
import { ResumeProvider } from "./contexts/ResumeContext";
import UserPage from "./pages/UserPage/UserPage";

function App() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ResumeProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/profile" replace />} />
        <Route path="/landing" element={<LandingPage />} />
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
        <Route
          path="/profile"
          element={
            <UserPage
              currentUser={{
                id: user?.id ?? "1",
                name: (user as any)?.name ?? (user as any)?.username ?? user?.email ?? "Name Surname",
                email: user?.email ?? "example@your.mail",
                resumeCount: 0,
              }}
              onLogout={logout}
              onSettings={() => {}}
            />
          }
        />
      </Routes>
    </ResumeProvider>
  );
}

export default App;
