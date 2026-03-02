# Winosa ML — Data Analysis & Modeling

Folder ini berisi notebook EDA dan pipeline ML untuk analisis dan prediksi **subscriber retention** Winosa.

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

# 4. Buka notebook di VSCode atau Jupyter
jupyter notebook
```

## Struktur Folder

```
ml/
├── notebooks/
│   └── winosa_ml.ipynb    # EDA + training + simpan model (run all)
├── data/                  # Diisi otomatis saat notebook dijalankan
├── models/                # Diisi otomatis saat notebook dijalankan
├── requirements.txt
├── README.md
└── .gitignore
```

## Notebook

| File | Deskripsi |
|------|-----------|
| `winosa_ml.ipynb` | Generate data, EDA, train model, simpan `model_v1.pkl` |

## Model v1

| Model | Test AUC | Test Accuracy |
|-------|----------|---------------|
| LogisticRegression | 0.6124 | 0.6200 |
| **RandomForest** ✅ | **0.6198** | **0.7250** |

**Best model:** RandomForest → disimpan ke `models/model_v1.pkl`

> ⚠️ Dataset saat ini bersifat sintetis sebagai baseline. Akan disambungkan ke data produksi Winosa di v2.