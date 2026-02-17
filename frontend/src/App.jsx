import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import Footer from "./components/footer";

import Home from "./pages/home";
import Text from "./pages/text";
import Url from "./pages/url";
import Voice from "./pages/voice";
import Logs from "./pages/logs";
import About from "./pages/about";

export default function App() {
  return (
    <BrowserRouter>
      {/* Background layers */}
      <div className="bgLayer"></div>
      <div className="noise"></div>
      <div className="vignette"></div>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/text" element={<Text />} />
        <Route path="/url" element={<Url />} />
        <Route path="/voice" element={<Voice />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
