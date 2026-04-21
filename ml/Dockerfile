# Gunakan Python 3.9
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install dependencies sistem (untuk scikit-learn dsb)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copy all files
COPY . .

# Set environment variables
ENV PORT=7860
EXPOSE 7860

# Jalankan dengan Gunicorn (lebih stabil untuk production)
# HF akan otomatis mengarahkan traffic ke port 7860
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "app:app"]
