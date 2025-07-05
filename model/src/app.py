from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import tensorflow as tf
import os

# Load the model and cascade
model = tf.keras.models.load_model(os.path.join(os.path.dirname(__file__), '..', '\src\model.h5'))
face_cascade = cv2.CascadeClassifier(os.path.join(os.path.dirname(__file__), 'haarcascade_frontalface_default.xml'))

# Emotion labels
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

app = Flask(__name__)
CORS(app)

def preprocess_face(face_img):
    gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, (48, 48))
    normalized = resized / 255.0
    reshaped = np.reshape(normalized, (1, 48, 48, 1))
    return reshaped

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

if __name__ == '__main__':
    app.run(debug=True, port=3005, host='0.0.0.0')
