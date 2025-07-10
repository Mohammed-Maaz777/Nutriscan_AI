// src/pages/ScanHistoryPage.jsx
import React, { useEffect, useState } from "react";

const ScanHistoryPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/scans")
      .then((res) => res.json())
      .then((data) => setLogs(data.logs || []))
      .catch((err) => console.error("Failed to fetch scans:", err));
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">📜 My Scan History</h1>
      <div className="space-y-4">
        {logs.length === 0 ? (
          <p className="text-gray-500">No scans found.</p>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
              <p><strong>Name:</strong> {log.name}</p>
              <p><strong>Email:</strong> {log.email}</p>
              <p><strong>Health Score:</strong> {log.health_score}</p>
              <p><strong>Warnings:</strong> {log.warnings.join(", ") || "None"}</p>
              <p><strong>Scan:</strong> <pre className="whitespace-pre-wrap">{log.scan_text}</pre></p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScanHistoryPage;
