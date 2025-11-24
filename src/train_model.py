import os
import pickle
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

def train_and_save_model():
    # Create model directory if it doesn't exist
    model_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model')
    os.makedirs(model_dir, exist_ok=True)
    
    # Path to save the model
    model_path = os.path.join(model_dir, 'emotion_classifier.pkl')
    
    try:
        # Try to load the features.csv file
        csv_path = r'src\features.csv'
        if not os.path.exists(csv_path):
            print(f"Error: {csv_path} not found. Please run main.py first to generate features.")
            return False
        
        # Load the data
        df = pd.read_csv(csv_path)
        print(f"Loaded data with shape: {df.shape}")
        
        # Split data and labels
        X = df[[f'f{i}' for i in range(df.shape[1] - 2)]].values
        y = df['emotion_id'].values
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train the model
        print("Training Random Forest classifier...")
        rf = RandomForestClassifier(n_estimators=100, random_state=3)
        rf.fit(X_train, y_train)
        
        # Save the model
        with open(model_path, 'wb') as f:
            pickle.dump(rf, f)
        
        print(f"Model saved to {model_path}")
        return True
    
    except Exception as e:
        print(f"Error training model: {e}")
        return False

if __name__ == "__main__":
    train_and_save_model()