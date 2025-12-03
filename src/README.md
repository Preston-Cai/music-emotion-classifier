# Source Code

Source code for feature engineering and model training and testing.

 - `main.py` iterates over audio dataset, saves a csv of extracted features and corresponding emotion-ids, splits train-test data, fits a random forest model, and tests the accuracy.
 - `extract_features.py` extracted key features from the audio.
 - `train_model.py` trains and saves a model in pickle format.

 - `waveform_spectrogram.py` generate visual representations of audio file. The resulting waveforms and spectrograms can be used to expand dataset for more advanced models such as CNN.