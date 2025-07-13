#!/bin/bash

echo "📦 Installing Tesseract runtime dependencies..."
apt-get update && apt-get install -y tesseract-ocr

echo "🚀 Starting FastAPI app..."
uvicorn backend:app --host=0.0.0.0 --port=10000
