import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SignInPage from './pages/signinpage';
import OCRPage from './pages/OCRPage';
import ScanHistoryPage from './pages/ScanHistoryPage';

function SignInWrapper() {
  const navigate = useNavigate();

  const handleSubmit = (userData) => {
    navigate('/ocr', { state: userData });
  };

  return <SignInPage onSubmit={handleSubmit} />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignInWrapper />} />
      <Route path="/ocr" element={<OCRPage />} />
      <Route path="/history" element={<ScanHistoryPage />} />
    </Routes>
  );
}

export default App;
