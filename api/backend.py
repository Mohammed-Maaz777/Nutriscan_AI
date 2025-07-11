import os
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from PIL import Image
import pytesseract

app = FastAPI()

# 🌐 CORS settings
origins = [
    "https://nutriscan-ai-dun.vercel.app",  # your actual Vercel frontend
    "http://localhost:3000",                # local testing (optional)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📁 Ensure images directory exists
os.makedirs("images", exist_ok=True)

# 🏠 Home endpoint
@app.get("/", response_class=HTMLResponse)
async def read_items():
    return HTMLResponse(
        content="""
        <html>
            <head><title>FastAPI</title></head>
            <body>
                <h1>Server is Running</h1>
            </body>
            <footer>
                <p style="text-align: center">&#169; csgeek</p>
            </footer>
        </html>
        """,
        status_code=200,
    )

# 📤 Upload image and perform OCR using Tesseract
@app.post("/upload")
async def create_upload_file(
    file: UploadFile = File(...),
    lang: str = Form("eng")  # default to English (Tesseract lang code)
):
    try:
        print(f"Received file: {file.filename} with lang: {lang}")
        file_location = f"images/{file.filename}"
        with open(file_location, "wb+") as file_object:
            file_object.write(await file.read())

        # 🧠 Use pytesseract for OCR
        image = Image.open(file_location)
        extracted_text = pytesseract.image_to_string(image, lang=lang)

        return {"text": extracted_text.strip()}

    except Exception as e:
        return {"error": str(e)}


# 🖼️ OCR from stream (optional)
@app.post("/uploadstream")
async def read_image(file: UploadFile = File(...)):
    try:
        content = await file.read()
        image = Image.open(io.BytesIO(content))
        extracted_text = pytesseract.image_to_string(image)
        return {"text": extracted_text.strip()}
    except Exception as e:
        return {"error": str(e)}

# 🧾 Scan log model
class ScanData(BaseModel):
    name: str
    email: str
    scan_text: str
    health_score: int
    warnings: list

# 💾 Save scan logs
@app.post("/log_scan")
async def log_scan(data: ScanData):
    try:
        log_entry = f"{data.name} | {data.email} | Score: {data.health_score} | Warnings: {', '.join(data.warnings)}\n"
        with open("user_scans.log", "a") as f:
            f.write(log_entry)
        return {"message": "Scan logged successfully"}
    except Exception as e:
        return {"error": str(e)}

# 📜 Retrieve scan logs
@app.get("/scans")
async def get_scans():
    logs_file = "user_scans.log"
    if not os.path.exists(logs_file):
        return JSONResponse(content={"logs": []})

    logs = []
    with open(logs_file, "r") as f:
        for line in f:
            try:
                parts = line.strip().split('|')
                name = parts[0].strip()
                email = parts[1].strip()
                score_part = parts[2].strip()
                warnings_part = parts[3].strip() if len(parts) > 3 else "Warnings: None"

                health_score = int(score_part.replace("Score:", "").strip())
                warnings = warnings_part.replace("Warnings:", "").strip()
                warnings_list = [w.strip() for w in warnings.split(",")] if warnings else []

                logs.append({
                    "name": name,
                    "email": email,
                    "health_score": health_score,
                    "warnings": warnings_list,
                    "scan_text": "Full scan text not saved"
                })
            except:
                continue

    return {"logs": logs}