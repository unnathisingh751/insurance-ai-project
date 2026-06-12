import pandas as pd
import joblib
import json
import sys

model = joblib.load("insurance_model.pkl")
encoders = joblib.load("encoders.pkl")

data = json.loads(sys.argv[1])
sample = {
    "age": data["age"],
    "gender": data["gender"],
    "pregnant": "Yes" if data.get("pregnancy", 0) == 1 else "No",
    "number_of_children": data.get("children", 0),
    "annual_income": data["income"],
    "occupation": data.get("occupation", "Student"),
    "smoking": "Yes" if data["smoking"] == 1 else "No",
    "alcohol": "Yes" if data["alcohol"] == 1 else "No",
    "diseases": "Yes" if data["diseases"] == 1 else "No",
    "family_size": data["family_size"],
    "dependents": data["dependents"],
    "vehicle_owner": "Yes" if data["vehicle_owner"] == 1 else "No",
    "vehicle_age": data["vehicle_age"],
    "travel_frequency": data["travel_frequency"],
    "property_owner": "Yes" if data["property_owner"] == 1 else "No",
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

        print("Encoding:", col)
        print("Value:", df[col].iloc[0])
        print("Allowed:", encoders[col].classes_)

        df[col] = encoders[col].transform(
            df[col].astype(str)
        )

prediction = model.predict(df)

result = encoders[
    "insurance_category"
].inverse_transform(prediction)

print(result[0])