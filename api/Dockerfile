# Use official Python image
FROM python:3.10

# Install system dependencies
RUN apt-get update && \
    apt-get install -y tesseract-ocr libtesseract-dev libleptonica-dev pkg-config poppler-utils && \
    apt-get clean

# Set workdir
WORKDIR /app

# Copy app files
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Run the FastAPI app
CMD ["uvicorn", "backend:app", "--host", "0.0.0.0", "--port", "10000"]
