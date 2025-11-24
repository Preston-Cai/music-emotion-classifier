# music-emotion-classifier

A simple project for classifying music emotion using audio features and machine learning.

## Features
- Extracts audio features (e.g., MFCC, chroma, spectral contrast)
- Trains and evaluates classifiers (e.g. Random Forest, MLP)
- Inference pipeline for single-track emotion prediction
- Basic web app for uploading audio files and getting predictions

## Requirements
- Python 3.8+
- librosa, numpy, pandas, scikit-learn, matplotlib, flask

## set up virtual env
- in the cmd terminal, in the repo directory, run  ```venv\Scripts\activate```

## project structure
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