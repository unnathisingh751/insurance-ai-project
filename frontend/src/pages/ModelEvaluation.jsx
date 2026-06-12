import { useEffect, useState } from "react";
import axios from "axios";

function ModelEvaluation() {

  const [data, setData] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5001/model-evaluation")
      .then(res => {
        console.log(res.data);
        setData(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Model Evaluation</h1>

      <h3>Algorithm: {data.algorithm}</h3>
      <h3>Accuracy: {data.accuracy}%</h3>
      <h3>Precision: {data.precision}%</h3>
      <h3>Recall: {data.recall}%</h3>
      <h3>F1 Score: {data.f1}%</h3>
    </div>
  );
}

export default ModelEvaluation;