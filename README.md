# speech-emotion-classifier

A simple project for classifying speech emotion using audio features and machine learning.

## Features
- Extracts audio features (e.g., MFCC, chroma, spectral contrast)
- Trains and evaluates classifiers (e.g. Random Forest, MLP)
- Inference pipeline for single-track emotion prediction
- Basic web app with Flask and Javascript
- App features include uploading/recording audio files and getting predictions

## Requirements
- Python>=3.10, <3.14
- librosa, numpy, pandas, scikit-learn, matplotlib, flask, etc.


# Quick Start

1. Set up virtual env:
```bash
# create
python -m venv /path/to/new/virtual/environment
# activate (for windows)
venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```
3. Run web app:
```bash
python -m web.app
```

# project structure
```
├─ .gitignore
├─ README.md
├─ requirements.txt
├─ src
│  ├─ extract_features.py
│  ├─ main.py
│  ├─ train_model.py
│  ├─ use_mlp.py
│  └─ waveform_spectrogram.py
└─ web
   ├─ app.py
   ├─ classify.py
   ├─ hello.py
   ├─ recorder.py
   ├─ static
   │  └─ style.css
   └─ templates
      ├─ index.html
      └─ index_by_trae.html
```