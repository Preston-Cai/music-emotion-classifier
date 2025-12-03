# speech-emotion-classifier

A simple project for classifying speech emotion using audio features and machine learning.

## Features
- Extracts audio features (e.g., MFCC, chroma, spectral contrast)
- Trains and evaluates classifiers with Random Forest Classifier
- Inference pipeline for single-track emotion prediction
- Basic web app with Flask and Javascript with uploading/recording feature

## Requirements
- Python>=3.10, <3.14
- librosa, numpy, pandas, scikit-learn, matplotlib, flask, etc. See requirements.txt for details.


# Quick Start

## To Launch the Web App
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

## To train and test the model
1. Prepare audio dataset: create a directory containing subdirectories. Audio files need to in wav format and be put in the subdirectories. change folder path in   `src/main.py`. Example:
```bash
kaggle/actor_1  # put audio files inside /actor_1
```
2. Train and test model:
```bash
# Change directory:
cd src
# Run and visualize training result
python main.py
```

# Next Steps
1. Add command line tools for single audio emotion classification.
2. Improve web app interface style.


# Project Structure
```
speech-emotion-classifier/
├── .gitignore
├── legacy/
│   ├── js/
│   │   ├── bundle.js
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── rollup.config.mjs
│   │   └── script_new.js
│   ├── py/
│   │   ├── hello.py
│   │   ├── recorder.py
│   │   ├── test.py
│   │   └── use_mlp.py
│   └── README.md
├── model/
│   └── emotion_classifier.pkl
├── README.md
├── requirements.txt
├── src/
│   ├── extract_features.py
│   ├── main.py
│   ├── README.md
│   ├── train_model.py
│   └── waveform_spectrogram.py
└── web/
    ├── app.py
    ├── classify.py
    ├── static/
    │   ├── script.js
    │   └── style.css
    └── templates/
        └── index.html
```