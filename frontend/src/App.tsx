import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage/LandingPage"
import DashboardPage from "./pages/Dashboard/DashboardPage";

function App() {
  return (
    <>
      <Routes>
        {/* TODO: после создания страницы аутентификации добавить рут на неё */}
        <Route path="/" element={<DashboardPage/>} />
      </Routes>
    </>
  );
};

export default App;
