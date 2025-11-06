import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage/LandingPage"

function App() {
  return (
    <>
      <Routes>
        {/* TODO: после создания страницы аутентификации добавить рут на неё */}
        <Route path="/" element={<LandingPage/>} />
      </Routes>
    </>
  );
};

export default App;
