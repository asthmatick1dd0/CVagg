import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage/LandingPage"
import LoginPage from "./pages/Auth/LoginPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage />} />
        {/* TODO (Настя): после создания страницы регистрации добавить рут на неё */}
      </Routes>
    </>
  );
};

export default App;
