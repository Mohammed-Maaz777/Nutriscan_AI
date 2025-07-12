# Use official Python image
FROM python:3.10-slim

# Install Tesseract and required system libraries
RUN apt-get update && \
    apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    poppler-utils \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy all files into the image
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port (optional but good practice)
EXPOSE 10000

# Run FastAPI server
CMD ["uvicorn", "backend:app", "--host", "0.0.0.0", "--port", "10000"]
