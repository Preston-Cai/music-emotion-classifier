from sklearn.neural_network import MLPClassifier # multi-layer perceptron model

from sklearn.metrics import accuracy_score, confusion_matrix
import pylab as pl

import main


def use_mlp(tt_data):
    # best model, determined by a grid search
    model_params = {
        'alpha': 0.01,
        'batch_size': 256,
        'epsilon': 1e-08, 
        'hidden_layer_sizes': (300,), 
        'learning_rate': 'adaptive', 
        'max_iter': 500, 
    }

    # initialize Multi Layer Perceptron classifier
    # with best parameters ( so far )
    mlp = MLPClassifier(**model_params)
    mlp.fit(tt_data.X_train, tt_data.y_train)
    y_pred = mlp.predict(tt_data.X_test)

    acc = accuracy_score(y_true=tt_data.y_test, y_pred=y_pred)
    cm = confusion_matrix(y_true=tt_data.y_test, y_pred=y_pred)

    print('accuracy:', acc)
    print('confusion_matrix:', cm)

    # pl.matshow(cm)
    # pl.title('Confusion matrix of the classifier')
    # pl.colorbar()
    # pl.show()


df = main.create_df()
tt_data = main.split_data(df)
use_mlp(tt_data)



