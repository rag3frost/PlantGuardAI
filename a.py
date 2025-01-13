from flask import Flask, render_template, request
from werkzeug.utils import secure_filename
import os
import tensorflow as tf
import numpy as np

app = Flask(__name__)

# Load the model
# Load the model with custom object scope
def load_model_with_custom_objects():
    try:
        # First attempt: Try loading with custom loss configuration
        with tf.keras.utils.custom_object_scope({'reduction': 'mean'}):
            return tf.keras.models.load_model('model.h5')
    except:
        # Second attempt: Try loading with compile=False and then recompile
        model = tf.keras.models.load_model('model.h5', compile=False)
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        return model

# Update the model loading
model = load_model_with_custom_objects()
class_names = ['Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy']
BATCH_SIZE = 32
IMAGE_SIZE = 255
CHANNEL = 3
EPOCHS = 20


# Function to preprocess and predict
def predict(img):
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)

    predictions = model.predict(img_array)

    predicted_class = class_names[np.argmax(predictions[0])]
    confidence = round(100 * (np.max(predictions[0])), 2)
    return predicted_class, confidence

# Route to the home page
@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        # Check if the post request has the file part
        if 'file' not in request.files:
            return render_template('index.html', message='No file part', active_section='classificationApp')

        file = request.files['file']

        if file.filename == '':
            return render_template('index.html', message='No selected file', active_section='classificationApp')

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join('static', filename)
            file.save(filepath)

            img = tf.keras.preprocessing.image.load_img(filepath, target_size=(IMAGE_SIZE, IMAGE_SIZE))
            predicted_class, confidence = predict(img)

            return render_template('index.html', 
                                image_path=filepath, 
                                actual_label=predicted_class, 
                                predicted_label=predicted_class, 
                                confidence=confidence,
                                active_section='classificationApp')

    return render_template('index.html', message='Upload an image', active_section='home')

# Function to check if the file has an allowed extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg'}

if __name__ == '__main__':
    app.run(debug=True)