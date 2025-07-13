# 🧠 NutriScan AI — OCR Food Label Scanner

NutriScan AI is a full-stack AI-powered scanner that analyzes food labels and provides personalized health scores and intelligent suggestions. Users upload images of food ingredients, and the app flags harmful substances and allergens based on their health profile.

---

## 🔗 Live Demo

👉 [NutriScan AI on Vercel (Frontend)](https://nutriscan-ai-dun.vercel.app)

---

## 📲 App Flow

### 1. 👤 Sign In Page (`/signin`)
- Users enter:
  - **Name & Email** (for logging scans)
  - **Allergies** (e.g. `milk, peanuts`)
  - **Health Conditions** (e.g. `diabetes`)
- Data is used to personalize ingredient analysis.

### 2. 🖼️ OCR Page (`/ocr`)
- Upload an image of a food label or ingredients list.
- Text is extracted using **pytesseract** via a FastAPI backend.
- Analyzes for:
  - Sugar, palm oil, preservatives (E-numbers)
  - User-defined allergens (with synonyms)

### 3. 🤖 AI Recommendations
- Displays:
  - ✅ Health Score (0–100)
  - ⚠️ Detected risks or allergens
  - 💡 Personalized food suggestions

---

## ⚙️ Deployment Details

| Layer     | Platform      | Notes                                         |
|-----------|---------------|-----------------------------------------------|
| Frontend  | Vercel        | Deployed React app at Vercel with animations  |
| Backend   | Render        | FastAPI server runs on Render infrastructure  |
| Container | Docker        | Backend is containerized using Docker for consistent builds |

---

## 🧠 Features

- 📷 OCR ingredient scanning
- ✅ Personalized health scoring
- ⚠️ Allergy detection (with synonyms)
- 💬 Smart suggestions and alternatives
- 🎨 Responsive UI with animations (Framer Motion)
- 🌙 Dark mode
- 📦 PWA-ready frontend (planned)

---

## 🛠️ Tech Stack

| Layer      | Tech Used                                 |
|------------|--------------------------------------------|
| Frontend   | React, Tailwind CSS, Framer Motion, Vite   |
| Backend    | FastAPI, Python, pytesseract               |
| AI Logic   | Rule-based logic (keyword + allergy match) |
| Container  | Docker (for backend)                       |
| Hosting    | Vercel (frontend) • Render (backend)       |

---

## 📁 Folder Structure

NutriScan_AI/
├── /api (FastAPI backend - Dockerized)
├── /src/pages
│ ├── SignInPage.jsx
│ ├── OCRPage.jsx
│ └── ScanHistoryPage.jsx
└── /components
├── UploadCard.jsx
└── ResultCard.jsx


---

## ✅ Example Allergens Detected

| Allergy   | Detected Terms                       |
|-----------|--------------------------------------|
| Dairy     | milk, butter, cream, yogurt, cheese  |
| Nuts      | almond, peanut, cashew, walnut       |
| Gluten    | wheat, barley, malt, rye             |
| Soy       | soy, soya, soybean                   |
| Egg       | egg, albumen                         |
| Shellfish | shrimp, prawn, crab, lobster         |
| Fish      | salmon, tuna, cod, trout             |

---

## 🔮 Future Enhancements

- JWT authentication system
- AI-based ingredient classification (ML)
- Full scan history with analytics
- **Offline support with full PWA integration**
- Multilingual OCR support

---

## 👨‍💻 Developer

**Mohammed Maaz**  
🔗 [GitHub: @Mohammed-Maaz777](https://github.com/Mohammed-Maaz777)

---

## 📃 License

This project is licensed under the **MIT License** — free to use for personal and educational purposes.
