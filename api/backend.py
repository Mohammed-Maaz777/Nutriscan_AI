import os
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from PIL import Image
import pytesseract

# ✅ Set Tesseract path (required for Render.com)
pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"

app = FastAPI()

# 🌐 CORS configuration to allow frontend access
origins = [
    "https://nutriscan-ai-dun.vercel.app",  # Deployed frontend (Vercel)
    "http://localhost:3000",                # Local frontend (development)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📁 Create image storage folder if it doesn't exist
os.makedirs("images", exist_ok=True)

# 🏠 Basic health check endpoint
@app.get("/", response_class=HTMLResponse)
async def read_items():
    return HTMLResponse(
        content="""
        <html>
            <head><title>FastAPI</title></head>
            <body>
                <h1>✅ NutriScan OCR Backend is Running</h1>
            </body>
            <footer>
                <p style="text-align: center">&#169; csgeek</p>
            </footer>
        </html>
        """,
        status_code=200,
    )


@app.post("/upload")
async def create_upload_file(
    file: UploadFile = File(...),
    lang: str = Form("eng")  # default to English (Tesseract lang code)
):
    try:
        print(f"📥 Received file: {file.filename} with lang: {lang}")
        file_location = f"images/{file.filename}"
        
        # Save uploaded image
        with open(file_location, "wb+") as file_object:
            file_object.write(await file.read())

        # 🧠 Open and preprocess image
        image = Image.open(file_location).convert("RGB")
        extracted_text = pytesseract.image_to_string(image, lang=lang).strip()

        print("📄 Extracted text:", extracted_text or "[No text found]")

        return {"text": extracted_text} if extracted_text else {
            "text": "",
            "message": "⚠️ No text found in the image."
        }

    except Exception as e:
        print("❌ Error in /upload:", str(e))
        return JSONResponse(content={"error": "OCR processing failed", "details": str(e)}, status_code=500)


# 🖼️ OCR directly from image stream (optional fallback route)
@app.post("/uploadstream")
async def read_image(file: UploadFile = File(...)):
    try:
        content = await file.read()
        image = Image.open(BytesIO(content)).convert("RGB")
        extracted_text = pytesseract.image_to_string(image).strip()

        return {"text": extracted_text} if extracted_text else {
            "text": "",
            "message": "⚠️ No text found in image stream."
        }

    except Exception as e:
        print("❌ Error in /uploadstream:", str(e))
        return JSONResponse(content={"error": "Stream OCR failed", "details": str(e)}, status_code=500)


# 🧾 Scan log model
class ScanData(BaseModel):
    name: str
    email: str
    scan_text: str
    health_score: int
    warnings: list[str]


# 💾 Save scan logs
@app.post("/log_scan")
async def log_scan(data: ScanData):
    try:
        log_entry = f"{data.name} | {data.email} | Score: {data.health_score} | Warnings: {', '.join(data.warnings)}\n"
        with open("user_scans.log", "a") as f:
            f.write(log_entry)
        return {"message": "✅ Scan logged successfully"}
    except Exception as e:
        print("❌ Error in /log_scan:", str(e))
        return JSONResponse(content={"error": "Log writing failed", "details": str(e)}, status_code=500)


# 📜 Retrieve scan logs
@app.get("/scans")
async def get_scans():
    logs_file = "user_scans.log"
    if not os.path.exists(logs_file):
        return {"logs": []}

    logs = []
    try:
        with open(logs_file, "r") as f:
            for line in f:
                parts = line.strip().split('|')
                if len(parts) < 3:
                    continue

                name = parts[0].strip()
                email = parts[1].strip()
                score_part = parts[2].strip()
                warnings_part = parts[3].strip() if len(parts) > 3 else "Warnings: None"

                health_score = int(score_part.replace("Score:", "").strip())
                warnings_text = warnings_part.replace("Warnings:", "").strip()
                warnings_list = [w.strip() for w in warnings_text.split(",")] if warnings_text else []

                logs.append({
                    "name": name,
                    "email": email,
                    "health_score": health_score,
                    "warnings": warnings_list,
                    "scan_text": "Full scan text not saved"
                })
    except Exception as e:
        print("❌ Error in /scans:", str(e))

    return {"logs": logs}