import os
import base64
import traceback
import numpy as np
import cv2
import easyocr
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

print("🐞 Starting OCR service...")

# Initialize EasyOCR
try:
    print("🖼️ Loading OCR model...")
    reader = easyocr.Reader(["en"])
    print("✅ OCR ready")
except Exception as e:
    print(f"🔴 OCR init failed: {str(e)}")
    exit(1)

NODEJS_BACKEND_URL = "https://expresspap.onrender.com"  # Your Render URL

def process_base64(image_data):
    try:
        npimg = np.frombuffer(base64.b64decode(image_data), np.uint8)
        return cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    except Exception as e:
        print(f"📷 Base64 error: {str(e)}")
        raise

def process_file(file):
    try:
        npimg = np.frombuffer(file.read(), np.uint8)
        return cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    except Exception as e:
        print(f"📁 File error: {str(e)}")
        raise

def ocr_processing(img):
    # Simple image processing
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    results = reader.readtext(gray)
    return [text[1].upper().replace(' ', '') for text in results]

@app.route("/upload", methods=["POST"])
def upload_image():
    print("\n📨 New request received")
    
    try:
        # Handle both JSON and file uploads
        if request.is_json:
            data = request.get_json()
            if "image" not in data:
                return jsonify({"status": "error", "message": "No image data"}), 400
            img = process_base64(data["image"])
        else:
            if 'image' not in request.files:
                return jsonify({"status": "error", "message": "No file uploaded"}), 400
            img = process_file(request.files['image'])

        print("🔍 Processing image...")
        plates = ocr_processing(img)
        print(f"🔑 Detected: {plates}")

        if not plates:
            return jsonify({"status": "error", "message": "No plate found"}), 400

        print(f"📤 Sending to {NODEJS_BACKEND_URL}...")
        response = requests.post(
            f"{NODEJS_BACKEND_URL}/verify",
            json={"licensePlate": plates[0]},
            timeout=10
        )

        return jsonify(response.json()), response.status_code

    except requests.exceptions.RequestException as e:
        print(f"🔴 Connection error: {str(e)}")
        return jsonify({"status": "error", "message": "Backend unavailable"}), 503
    except Exception as e:
        print(f"🔥 Error: {str(e)}")
        traceback.print_exc()
        return jsonify({"status": "error", "message": "Processing failed"}), 500

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    print(f"🚀 Running on port {port}")
    app.run(host="0.0.0.0", port=port)