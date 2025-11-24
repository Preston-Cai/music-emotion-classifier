import os
import pandas as pd
import librosa
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix
import pylab as pl
from dataclasses import dataclass

import extract_features as ef

# filename = librosa.example('nutcracker')
# y, sr = librosa.load(filename)

@dataclass
class TrainTestData:
    X_train: np.array
    X_test: np.array
    y_train: np.array
    y_test: np.array

def save_csv():
    folder_path = '../kaggle' # fill in the folder path here
    data = []

    # loading each files in the dir, extract features, and generate the dataset
    for subfolder in os.listdir(folder_path):
        subfolder_path = os.path.join(folder_path, subfolder)

        if not os.path.isdir(subfolder_path):
            continue
        for filename in os.listdir(subfolder_path):
            if filename.endswith('.wav'):
                file_path = os.path.join(subfolder_path, filename)

                y, sr = librosa.load(file_path)
                
                feature_vector = ef.extract_features(y, sr)
                emotion_id = int(filename.split('-')[2])

                data.append([filename] + list(feature_vector) + [emotion_id])
                 
    columns = ['filename'] + [f'f{i}' for i in range(len(feature_vector))] + ['emotion_id']
    df = pd.DataFrame(data, columns=columns)
    df.to_csv('features.csv', index=False)
    print('Saved features.csv')


def create_df():
    df = pd.read_csv('features.csv')
    print(df.shape)
    # print(df.head())
    # print(df['emotion_id'].value_counts())
    return df


def split_data(df):
    # split data and labels
    X = df[[f'f{i}' for i in range(df.shape[1] - 2)]].values
    y = df['emotion_id'].values
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    tt_data = TrainTestData(X_train, X_test, y_train, y_test)
    # print('X train:', tt_data.X_train)
    # print('X test:', tt_data.X_test)
    # print('y train:', tt_data.y_train)
    # print('y test:', tt_data.y_test)
    print('train data shape:', tt_data.X_train.shape)
    print('train data type:', tt_data.X_train.dtype)
    return tt_data


def use_rf(tt_data):
    # fit and test the model
    rf = RandomForestClassifier(n_estimators=100, random_state=3)

    rf.fit(tt_data.X_train, tt_data.y_train)

    y_pred = rf.predict(tt_data.X_test)

    acc = accuracy_score(tt_data.y_test, y_pred)

    cm = confusion_matrix(tt_data.y_test, y_pred)
    
    print('accuracy score:', acc)
    print('confusion matrix:', cm)

    pl.matshow(cm)
    pl.title('Confusion matrix of the classifier')
    pl.colorbar()
    pl.show()

    # df_compare = pd.DataFrame({'predicted': y_pred, 'actual': tt_data.y_test})
    # print(df_compare.head(10))


save_csv()
df = create_df()
tt_data = split_data(df)
use_rf(tt_data)
