# Winosa ML Service v2.0 — Advanced NLP Engine
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source
COPY . .

# HuggingFace Spaces uses port 7860
ENV PORT=7860
EXPOSE 7860

# Run with Gunicorn — production-grade WSGI server
# --timeout 120 to allow model training on cold start
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--workers", "1", "--timeout", "120", "app:app"]
