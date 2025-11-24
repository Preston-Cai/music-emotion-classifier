'''main app.
next step: change index.html so that it changes based on actions such as classify and upload;
add record feature (after a basic app can run)
'''


import os
from flask import Flask, flash, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename
from web.recorder import record_and_save
import web.classify as clf

app = Flask(__name__)

UPLOAD_FOLDER = 'web/uploads'
ALLOWED_EXTENSIONS = {'wav'}

@app.route('/')
def index():
    return render_template('index.html')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return render_template('index.html', uploaded=filename)

@app.route('/classify', methods=['POST'])
def classify():
        
        if os.listdir(UPLOAD_FOLDER) == []:
            flash('No file uploaded')
            return redirect(request.url)
        filename = os.listdir(UPLOAD_FOLDER)[0]
        emotion = clf.predict_emotion(
            clf.extract_features_from_file('web/uploads/' + filename)
            )
        
        if os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        return render_template('index.html', uploaded=filename, emotion=emotion)

@app.route('/back', methods=['GET'])
def back():
    return render_template('index.html')


if __name__ == '__main__':
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.secret_key = 'super secret key'
    app.run(debug=True)
