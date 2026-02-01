from flask import Flask, jsonify, request, send_from_directory
import json
import os

app = Flask(__name__, static_folder="../frontend", static_url_path="")

# Charger data.json
DATA_PATH = os.path.join(os.path.dirname(__file__), "data.json")
with open(DATA_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

@app.route("/search")
def search():
    q = request.args.get("q", "").lower()
    t = request.args.get("type", "all")

    filtered = []
    for item in data:
        if t != "all" and item["type"] != t:
            continue
        if q and q not in item["nom"].lower():
            continue
        filtered.append(item)
    return jsonify(filtered)

# Servir index.html
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run()
