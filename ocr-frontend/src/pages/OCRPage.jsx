import React, { useState, useEffect } from 'react';
import { CloudUpload, Loader2, ScanLine, Moon, Sun, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const getHealthScore = (text, allergies = []) => {
  let score = 100;
  const lowerText = text.toLowerCase();

  if (lowerText.includes("sugar")) score -= 30;
  if (lowerText.includes("palm")) score -= 20;
  if (lowerText.match(/e\d+/)) score -= 10;

  allergies.forEach((allergy) => {
    if (lowerText.includes(allergy)) {
      score -= 30;
    }
  });

  return Math.max(0, score);
};

const OCRPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState("");

  const { state: userData } = useLocation();
  const allergyList = typeof userData?.allergies === "string"
    ? userData.allergies.toLowerCase().split(",").map((a) => a.trim())
    : Array.isArray(userData?.allergies)
      ? userData.allergies
      : [];

  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file first");

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const extractedText = data.text || JSON.stringify(data);
      setText(extractedText);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // Static recommendation (replacing AI)
      setAiRecommendation("🔄 Try sugar-free or allergy-friendly alternatives.");

      const healthScore = getHealthScore(extractedText, allergyList);
      const warnings = analyzeIngredients(extractedText);

      if (userData?.name && userData?.email) {
        await fetch("http://127.0.0.1:8000/log_scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            scan_text: extractedText,
            health_score: healthScore,
            warnings: warnings,
          }),
        });
      }

    } catch (error) {
      console.error("Upload Error:", error);
      setText("Error: " + error.message);
    }

    setLoading(false);
  };

  const analyzeIngredients = (text) => {
    const warnings = [];
    const lowerText = text.toLowerCase();

    if (lowerText.includes("sugar")) warnings.push("⚠️ High sugar content");
    if (lowerText.includes("palm")) warnings.push("⚠️ Contains palm oil");
    if (lowerText.match(/e\d+/)) warnings.push("⚠️ Additives present (E-numbers)");

    if (userData?.diabetes && lowerText.includes("sugar")) {
      warnings.push("⚠️ Not suitable for diabetics");
    }

    if (userData?.allergies) {
      const rawAllergies = Array.isArray(userData.allergies)
        ? userData.allergies
        : userData.allergies.split(',');

      rawAllergies.forEach((allergy) => {
        const a = allergy.toLowerCase().trim();
        if (lowerText.includes(a)) {
          warnings.push(`⚠️ Contains allergen: ${a}`);
        }
      });
    }

    return warnings;
  };
const getRecommendations = (text, userData = {}) => {
  const recs = [];
  const lowerText = text.toLowerCase();

  const allergiesRaw = Array.isArray(userData.allergies)
    ? userData.allergies
    : (userData.allergies || "").split(",");

  const allergyMatch = allergiesRaw.some((a) =>
    lowerText.includes(a.trim().toLowerCase())
  );

  if (userData.diabetes && lowerText.includes("sugar")) {
    recs.push("🔄 Try sugar-free alternatives or low-GI snacks.");
  }

  if (lowerText.includes("palm")) {
    recs.push("🌱 Choose olive/sunflower oil over palm oil.");
  }

  if (lowerText.match(/e\d+/)) {
    recs.push("🍏 Avoid additives. Go for whole foods.");
  }

  if (allergyMatch) {
    recs.push("🚫 Contains allergens you've listed.");
  }

  if (recs.length === 0) {
    recs.push("✅ This item looks safe for you.");
  }

  return recs;
};

return (
  <motion.div className="min-h-screen p-4 sm:p-6">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto bg-white dark:bg-gray-900 dark:text-white rounded-3xl shadow-2xl p-6 sm:p-10 grid md:grid-cols-2 gap-8"
    >
      {/* Header */}
      <div className="col-span-2 flex justify-between items-center mb-6">
        <motion.h1
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold flex items-center gap-2 text-indigo-700 dark:text-indigo-300"
        >
          <ScanLine className="w-6 h-6" /> OCR Food Label Scanner
        </motion.h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition"
          title="Toggle Dark Mode"
        >
          {darkMode ? (
            <Sun className="text-yellow-400" />
          ) : (
            <Moon className="text-gray-800" />
          )}
        </motion.button>
      </div>

      {/* File Upload */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col"
      >
        <label
          htmlFor="file-upload"
          className="cursor-pointer w-full px-4 py-2 mb-4 border border-dashed border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-center hover:border-indigo-500"
        >
          {selectedFile ? selectedFile.name : "Click to select image"}
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUpload}
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <CloudUpload className="w-5 h-5" />
          )}
          {loading ? "Scanning..." : "Upload & Scan"}
        </motion.button>
{/* 🖼️ Image Preview */}
{preview && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="mt-6"
  >
    <h2 className="font-semibold mb-2">Preview:</h2>
    <img
      src={preview}
      alt="Uploaded preview"
      className="rounded-xl border shadow w-full object-cover max-h-64 transition-transform duration-300 hover:scale-105"
    />
  </motion.div>
)}

</motion.div>

{/* 🧾 Results Display */}
<motion.div
  initial={{ x: 50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ delay: 0.4 }}
>
  {text ? (
    <>
      <h2 className="text-xl font-semibold mb-4">Extracted Text:</h2>
      <motion.ul
        layout
        className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scroll"
      >
        <AnimatePresence>
          {text.split('\n').map((line, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="bg-indigo-50 dark:bg-gray-700 border dark:border-gray-600 p-3 rounded-xl shadow-sm flex items-start gap-2 hover:scale-[1.02] transition-transform"
            >
              <span className="text-indigo-600 dark:text-indigo-300 font-bold">•</span>
              <span>{line}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {/* Warnings Section */}
      {analyzeIngredients(text).length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">
            ⚠️ Warnings:
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {analyzeIngredients(text).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Health Score */}
      <div className="mt-6">
        <h2 className="font-semibold mb-2">
          Health Score: {getHealthScore(text, allergyList)} / 100
        </h2>
        <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              getHealthScore(text, allergyList) > 70
                ? 'bg-green-500'
                : getHealthScore(text, allergyList) > 40
                ? 'bg-yellow-400'
                : 'bg-red-500'
            }`}
            style={{ width: `${getHealthScore(text, allergyList)}%` }}
          />
        </div>
      </div>

      {/* AI ChatGPT Suggestion */}
      {aiRecommendation && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-indigo-700 dark:text-indigo-300">
            🤖 AI Health Suggestion:
          </h2>
          <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
            {aiRecommendation}
          </p>
        </div>
      )}

      {/* Rule-Based Recommendations */}
      <div className="mt-6">
        <h2 className="font-semibold mb-2">AI Recommendations:</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-green-700 dark:text-green-400">
          {getRecommendations(text, userData).map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </>
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="text-gray-400 italic text-center mt-16"
    >
      Results will appear here after scanning
    </motion.div>
  )}
</motion.div>
</motion.div>

{/* Toast Notification */}
<AnimatePresence>
  {showToast && (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2"
    >
      <CheckCircle className="w-5 h-5" /> Scanned successfully!
    </motion.div>
  )}
</AnimatePresence>
</motion.div>
);
};

export default OCRPage;
