import matplotlib.pyplot as plt
import numpy as np
import librosa
import librosa.display

file_path = 'sample_audio/03-01-01-01-01-01-01.wav' 
y, sr = librosa.load(file_path)


def extract_features(y, sr) -> np.array:

    # extract MFCCs
    mfccs = librosa.feature.mfcc(y=y, sr=sr)
    # plt.figure(figsize=(10, 4))
    # librosa.display.specshow(mfccs, x_axis='time', sr=sr)
    # plt.colorbar()
    # plt.title('MFCC')
    # plt.tight_layout()
    # plt.show()
    # print('shape of mfccs:', mfccs.shape)

    # extract chroma feature
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    # plt.figure(figsize=(10, 4))
    # librosa.display.specshow(chroma, y_axis='chroma', x_axis='time', sr=sr)
    # plt.colorbar()
    # plt.title('Chroma Feature')
    # plt.show()
    # print('shape of chroma:', chroma.shape)

    # extract spectral centroids
    spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    # plt.figure(figsize=(10, 4))
    # plt.semilogy(spectral_centroids, label="Spectral Centroids")
    # plt.title("Spectral Centroids Over Time")
    # plt.xlabel("frame")
    # plt.ylabel("Hz")
    # plt.legend()
    # plt.show()
    # print('shape of spectral centroids:', spectral_centroids.shape)

    # extract rms
    rms = librosa.feature.rms(y=y)[0]


    # vectorize features
    # 1.mean
    mfccs_mean = np.mean(mfccs, axis=1)
    chroma_mean = np.mean(chroma, axis=1)
    spectral_centroids_mean = np.mean(spectral_centroids)
    rms_mean = np.mean(rms)
    # print('mfcc mean:', mfccs_mean)
    # print('chroma mean:', chroma_mean)
    # print('spectral centroids mean:', spectral_centroids_mean)

    # 2.standard deviation
    mfccs_std = np.std(mfccs, axis=1)
    chroma_std = np.std(chroma, axis=1)
    spectral_centroids_std = np.std(spectral_centroids)
    rms_std = np.std(rms)
    # print('mfccs std:', mfccs_std)
    # print('chroma std:', chroma_std)
    # print('spectral centroids std:', spectral_centroids_std)

    feature_vector = np.concatenate(
        [mfccs_mean, chroma_mean, [spectral_centroids_mean], [rms_mean],
         mfccs_std, chroma_std, [spectral_centroids_std], [rms_std]]
         )
    # print('feature vector:', feature_vector)
    print('Feature vector shape:', feature_vector.shape)
    return feature_vector


extract_features(y, sr)