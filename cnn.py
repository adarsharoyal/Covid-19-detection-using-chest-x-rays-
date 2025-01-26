import tensorflow as tf
import numpy as np
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from flask import Flask, request, render_template

from tensorflow.keras.preprocessing.image import img_to_array

app = Flask(__name__)

# Load the pre-trained model
model = load_model(r"C:\Users\adarsha\Desktop\covid-19\covid-19.h5", compile=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        f = request.files['image']
        basepath = os.path.dirname(__file__)
        filepath = os.path.join(basepath, 'uploads', f.filename)
        f.save(filepath)

        # Load the image and process it
        img = image.load_img(filepath, target_size=(224, 224)) 
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)  # Expand the dimensions to match the model input
        x = x / 255.0   
        # Make prediction
        y = model.predict(x)
        preds = np.argmax(y, axis=1)  # Get the predicted class index

        # Define class labels
        index = ['COVID-19', 'NORMAL', 'Pneumonia'  ]
        text = str(index[preds[0]])

        return text

if __name__ == '__main__':
    app.run(debug=False, threaded=False)
