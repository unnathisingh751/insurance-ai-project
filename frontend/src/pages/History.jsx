import { useEffect, useState } from "react";
import axios from "axios";

function History() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const res = await axios.get(
      "http://localhost:5000/all-insurance"
    );

    setRecords(res.data);
  };

  return (
    <div>
      <h2>Prediction History</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Insurance</th>
            <th>Premium</th>
            <th>Coverage</th>
            <th>Risk %</th>
          </tr>
        </thead>

        <tbody>
          {records.map((item) => (
            <tr key={item._id}>
              <td>{item.insuranceType}</td>
              <td>{item.premium}</td>
              <td>{item.coverage}</td>
              <td>{item.riskPercent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;