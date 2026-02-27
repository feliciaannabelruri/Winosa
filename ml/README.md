# Winosa ML — Data Analysis & Modeling

Folder ini berisi notebook EDA dan pipeline ML untuk data dari Winosa backend.

## Setup

```bash
# 1. Buat virtual environment
python -m venv venv

# 2. Aktifkan venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Jalankan Jupyter
jupyter notebook
```

## Struktur Folder

```
ml/
├── notebooks/
│   └── eda.ipynb          # Exploratory Data Analysis
├── data/                  # Output charts & CSV (gitignored)
├── requirements.txt
├── README.md
└── .gitignore
```

## Notebook

| File | Deskripsi |
|------|-----------|
| `eda.ipynb` | EDA: distribusi data, missing values, trend subscriber, analisis kontak |