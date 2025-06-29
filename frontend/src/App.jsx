import Home from './pages/Home';
import UploadTest from './pages/UploadTest';
//import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload-test" element={<UploadTest />} />
      </Routes>
    </Router>
  );
}

export default App;
