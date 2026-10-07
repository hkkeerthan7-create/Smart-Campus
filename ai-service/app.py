from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "Smart Campus AI Service is running"
    })


@app.route("/health")
def health():
    return jsonify({
        "status": "healthy"
    })


@app.route("/analyze-issue", methods=["POST"])
def analyze_issue():

    data = request.json or {}

    title = data.get("title", "").lower()
    description = data.get("description", "").lower()

    text = title + " " + description

    # -------------------------
    # ELECTRICAL
    # -------------------------
    electrical_words = [
        "electricity",
        "electrical",
        "power",
        "light",
        "bulb",
        "fan",
        "switch",
        "socket",
        "plug",
        "current",
        "voltage",
        "wire",
        "wiring",
        "short circuit",
        "ac",
        "air conditioner"
    ]

    # -------------------------
    # INTERNET
    # -------------------------
    internet_words = [
        "wifi",
        "wi-fi",
        "internet",
        "network",
        "router",
        "connection",
        "no signal",
        "slow internet",
        "disconnect",
        "lan"
    ]

    # -------------------------
    # CLASSROOM
    # -------------------------
    classroom_words = [
        "classroom",
        "class room",
        "bench",
        "chair",
        "desk",
        "board",
        "blackboard",
        "projector",
        "smart board",
        "door",
        "window",
        "lecture hall"
    ]

    # -------------------------
    # HOSTEL
    # -------------------------
    hostel_words = [
        "hostel",
        "room",
        "bed",
        "mattress",
        "warden",
        "dormitory",
        "dorm",
        "bathroom",
        "toilet",
        "roommate",
        "hostel room"
    ]

    # -------------------------
    # CLEANING
    # -------------------------
    cleaning_words = [
        "clean",
        "cleaning",
        "dirty",
        "garbage",
        "waste",
        "dust",
        "dirt",
        "smell",
        "hygiene",
        "trash",
        "mosquito",
        "pest"
    ]

    # -------------------------
    # PLUMBING
    # -------------------------
    plumbing_words = [
        "water",
        "leak",
        "leaking",
        "tap",
        "pipe",
        "plumbing",
        "drain",
        "drainage",
        "faucet",
        "water supply",
        "water shortage",
        "water leakage"
    ]

    # -------------------------
    # DETECT CATEGORY
    # -------------------------

    if any(word in text for word in plumbing_words):
        category = "Plumbing"

    elif any(word in text for word in electrical_words):
        category = "Electrical"

    elif any(word in text for word in internet_words):
        category = "Internet"

    elif any(word in text for word in classroom_words):
        category = "Classroom"

    elif any(word in text for word in hostel_words):
        category = "Hostel"

    elif any(word in text for word in cleaning_words):
        category = "Cleaning"

    else:
        category = "Other"


    # -------------------------
    # DETECT PRIORITY
    # -------------------------

    high_priority_words = [
        "fire",
        "smoke",
        "spark",
        "shock",
        "electric shock",
        "short circuit",
        "flood",
        "major leak",
        "gas leak",
        "danger",
        "emergency",
        "broken wire",
        "no electricity",
        "power failure"
    ]

    medium_priority_words = [
        "leak",
        "leaking",
        "water shortage",
        "no water",
        "internet down",
        "wifi not working",
        "broken",
        "damaged",
        "not working",
        "problem",
        "issue",
        "dirty"
    ]

    if any(word in text for word in high_priority_words):
        priority = "High"

    elif any(word in text for word in medium_priority_words):
        priority = "Medium"

    else:
        priority = "Low"


    return jsonify({
        "category": category,
        "priority": priority
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )