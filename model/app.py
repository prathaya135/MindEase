from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import tensorflow as tf
import os

# Correct paths
model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'model.h5'))
cascade_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'haarcascade_frontalface_default.xml'))

# Rebuild model architecture
def build_model():
    model = tf.keras.models.Sequential()
    model.add(tf.keras.layers.Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=(48, 48, 1)))
    model.add(tf.keras.layers.Conv2D(64, kernel_size=(3, 3), activation='relu'))
    model.add(tf.keras.layers.MaxPooling2D(pool_size=(2, 2)))
    model.add(tf.keras.layers.Dropout(0.25))

    model.add(tf.keras.layers.Conv2D(128, kernel_size=(3, 3), activation='relu'))
    model.add(tf.keras.layers.MaxPooling2D(pool_size=(2, 2)))
    model.add(tf.keras.layers.Conv2D(128, kernel_size=(3, 3), activation='relu'))
    model.add(tf.keras.layers.MaxPooling2D(pool_size=(2, 2)))
    model.add(tf.keras.layers.Dropout(0.25))

    model.add(tf.keras.layers.Flatten())
    model.add(tf.keras.layers.Dense(1024, activation='relu'))
    model.add(tf.keras.layers.Dropout(0.5))
    model.add(tf.keras.layers.Dense(7, activation='softmax'))

    return model

# Load model
model = build_model()
model.load_weights(model_path)

# Load face detection model
face_cascade = cv2.CascadeClassifier(cascade_path)

# Emotion labels
emotion_labels = ['Angry', 'Disgusted', 'Fearful', 'Happy', 'Neutral', 'Sad', 'Surprised']

# Initialize Flask
app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}})

# Preprocess face for prediction
def preprocess_face(face_img):
    gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, (48, 48))
    normalized = resized / 255.0
    reshaped = np.reshape(normalized, (1, 48, 48, 1))
    return reshaped

# API endpoint
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    img_array = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    faces = face_cascade.detectMultiScale(img, 1.3, 5)
    if len(faces) == 0:
        return jsonify({'error': 'No face detected'}), 400

    x, y, w, h = faces[0]
    face = img[y:y+h, x:x+w]
    processed_face = preprocess_face(face)

    predictions = model.predict(processed_face)
    emotion = emotion_labels[np.argmax(predictions)]

    return jsonify({'emotion': emotion})

# Start server
if __name__ == '__main__':
    app.run(debug=True,port=4000)
