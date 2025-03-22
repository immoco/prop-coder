import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VoiceRecognition from "./VoiceRecognition";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VoiceRecognition />} />
        <Route path="/nextpage" element={<h1>Next Page</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
