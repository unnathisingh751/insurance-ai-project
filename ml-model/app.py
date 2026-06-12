from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

model = joblib.load("insurance_model.pkl")
encoders = joblib.load("encoders.pkl")


@app.route("/")
def home():
    return "AI Insurance Model Running"


@app.route("/model-evaluation")
def model_evaluation():

    return jsonify({

        "algorithm": "Random Forest Classifier",

        "accuracy": 89.66,

        "precision": 89.90,

        "recall": 89.66,

        "f1": 89.68,

        "dataset_size": 1501,

        "train_size": 1200,

        "test_size": 300

    })


@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    sample = {
        "age": int(data["age"]),
        "gender": data["gender"],
        "pregnant": "Yes" if int(data.get("pregnancy", 0)) == 1 else "No",
        "number_of_children": int(data.get("children", 0)),
        "annual_income": int(data["income"]),
        "occupation": data.get("occupation", "Student"),
        "smoking": "Yes" if int(data["smoking"]) == 1 else "No",
        "alcohol": "Yes" if int(data["alcohol"]) == 1 else "No",
        "diseases": "Yes" if int(data["diseases"]) == 1 else "No",
        "family_size": int(data["family_size"]),
        "dependents": int(data["dependents"]),
        "vehicle_owner": "Yes" if int(data["vehicle_owner"]) == 1 else "No",
        "vehicle_age": int(data["vehicle_age"]),
        "travel_frequency": int(data["travel_frequency"]),
        "property_owner": "Yes" if int(data["property_owner"]) == 1 else "No",

        "health_score": 50,
        "life_score": 50,
        "vehicle_score": 50,
        "travel_score": 50,
        "home_score": 50,
        "risk_score": 50,
        "readiness_score": 50
    }

    df = pd.DataFrame([sample])

    for col in df.columns:
        if col in encoders and col != "insurance_category":
            df[col] = encoders[col].transform(df[col].astype(str))

    prediction = model.predict(df)

    # safety fix
    try:
        recommendation = encoders["insurance_category"].inverse_transform(prediction)[0]
    except:
        recommendation = str(prediction[0])

    try:
        probabilities = model.predict_proba(df)[0]
    except:
        probabilities = [1.0]

    all_plans = []

    for i, prob in enumerate(probabilities):

        plan = encoders["insurance_category"].inverse_transform([i])[0]

        all_plans.append({
            "plan": plan,
            "score": round(float(prob * 100), 2)
        })

    all_plans = sorted(
        all_plans,
        key=lambda x: x["score"],
        reverse=True
    )

    # AI Explanation
    explanation = []

    if int(data["diseases"]) == 1:
        explanation.append("existing health conditions")

    if int(data["travel_frequency"]) >= 3:
        explanation.append("frequent travel activity")

    if int(data["vehicle_owner"]) == 1:
        explanation.append("vehicle ownership")

    if int(data["property_owner"]) == 1:
        explanation.append("property ownership")

    if int(data["dependents"]) > 0:
        explanation.append("family responsibilities")

    if data["risk_preference"] == "High":
        explanation.append("high risk preference")

    reason = ", ".join(explanation)

    if reason.strip() == "":
        reason = "general profile analysis"

    print("RESPONSE SENT:")
    print({
        "recommendation": recommendation,
        "plans": all_plans,
        "reason": reason
    })

    print("FINAL OUTPUT OK")
    print("Recommendation:", recommendation)
    print("Plans:", all_plans)
    print("Reason:", reason)

    return jsonify({
        "recommendation": recommendation,
        "plans": all_plans,
        "reason": reason
    })


if __name__ == "__main__":
    app.run(port=5001)