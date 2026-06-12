import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
data = pd.read_csv("insurance_dataset.csv")

# Features and Target
X = data.drop(
    ["insurance_category", "full_name", "premium", "coverage"],
    axis=1
)

y = data["insurance_category"]

encoders = {}

for column in X.columns:

    if X[column].dtype == "object" or str(X[column].dtype) == "str":

        le = LabelEncoder()

        X[column] = le.fit_transform(
            X[column].astype(str)
        )

        encoders[column] = le

# Encode target column
target_encoder = LabelEncoder()
y = target_encoder.fit_transform(y)

encoders["insurance_category"] = target_encoder

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

precision = precision_score(
    y_test,
    y_pred,
    average='weighted'
)

recall = recall_score(
    y_test,
    y_pred,
    average='weighted'
)

f1 = f1_score(
    y_test,
    y_pred,
    average='weighted'
)

cm = confusion_matrix(y_test, y_pred)

print("Accuracy:", accuracy)
print("Precision:", precision)
print("Recall:", recall)
print("F1 Score:", f1)
print("Confusion Matrix:")
print(cm)

# Check accuracy
predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("Accuracy:", accuracy)

# Train on full dataset before saving
model.fit(X, y)

joblib.dump(model, "insurance_model.pkl")
joblib.dump(encoders, "encoders.pkl")

print("Model Trained Successfully")