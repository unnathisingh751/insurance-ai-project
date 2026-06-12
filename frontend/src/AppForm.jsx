import { useState } from "react";
import axios from "axios";

function AIForm() {

  const [form, setForm] = useState({
    age: "",
    smoking: false,
    alcohol: false,
    diseases: false,
    dependents: ""
  });

  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      "http://127.0.0.1:5001/predict",
      form
    );

    console.log("FULL RESPONSE:", response.data);

    setRecommendation(response.data.recommendation);
    setPlans(response.data.plans);
    setReason(response.data.reason);

  } catch (error) {
    console.error("ERROR:", error);
    alert("Error getting recommendation");
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Insurance Predictor</h1>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Age"
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />

        <br /><br />

        <label>
          <input type="checkbox"
            onChange={(e) => setForm({ ...form, smoking: e.target.checked })}
          /> Smoking
        </label>

        <br />

        <label>
          <input type="checkbox"
            onChange={(e) => setForm({ ...form, alcohol: e.target.checked })}
          /> Alcohol
        </label>

        <br />

        <label>
          <input type="checkbox"
            onChange={(e) => setForm({ ...form, diseases: e.target.checked })}
          /> Diseases
        </label>

        <br /><br />

        <input
          placeholder="Dependents"
          onChange={(e) => setForm({ ...form, dependents: e.target.value })}
        />

        <br /><br />

        <button type="submit">Get AI Prediction</button>

      </form>

      <h2>{result}</h2>
    </div>
  );
}

export default AIForm;