import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Story from "./pages/story";
import Chat from "./pages/chat";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story/:id" element={<Story />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}