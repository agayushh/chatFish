import { Route, Routes, BrowserRouter} from "react-router-dom"
import "./App.css";
import LandingPage from "./LandingPage";
import ChatRoom from "./components/ChatRoom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat/:roomId" element={<ChatRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
