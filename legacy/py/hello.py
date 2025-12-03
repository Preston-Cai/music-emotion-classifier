'''for experiment purpose only'''

from flask import Flask, render_template
from waitress import serve

app = Flask(__name__)

@app.route('/')
@app.route('/index')
def index():
    return render_template('hello.html')

@app.route("/hello")
def hello():
    return "<p>Hello, World!</p>"

if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=8000)