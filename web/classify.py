'''webapp helper: feature extraction and prediction'''


import pickle
import librosa
import numpy

try:
    from src.extract_features import extract_features
except:
    print('import extract_features failed')


def extract_features_from_file(audio_file):
    y, sr = librosa.load(audio_file)
    features = extract_features(y, sr)
    return features.reshape(1, -1)


def predict_emotion(audio_features):
    
    with open('model\emotion_classifier.pkl', 'rb') as f:
        print(f.read(128))
        f.seek(0)
        model = pickle.load(f)

    emotions = {1: 'neutral', 2: 'calm', 3: 'happy', 4: 'sad', 
                5: 'angry', 6: 'fearful', 7: 'disgust', 8: 'surprised'}
    
    return emotions[model.predict(audio_features)[0]]

if __name__ == '__main__':
    print(
        predict_emotion(
            extract_features_from_file('web/uploads/audio.wav')
            )
        )