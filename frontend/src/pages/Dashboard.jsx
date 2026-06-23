import { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [editId, setEditId] = useState(null);
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState({});
  // 📊 STATS CALCULATION

const healthCount = records.filter(i => i.insuranceType === "Health").length;
const lifeCount = records.filter(i => i.insuranceType === "Life").length;
const vehicleCount = records.filter(i => i.insuranceType === "Vehicle").length;
const travelCount = records.filter(i => i.insuranceType === "Travel").length;
const homeCount = records.filter(i => i.insuranceType === "Home").length;

const maleUsers = records.filter(
  item => item.formData?.gender === "Male"
).length;

const femaleUsers = records.filter(
  item => item.formData?.gender === "Female"
).length;

const averageAge =
  records.length > 0
    ? (
        records.reduce(
          (sum, item) => sum + Number(item.formData?.age || 0),
          0
        ) / records.length
      ).toFixed(1)
    : 0;

const insuranceCounts = {
  Health: healthCount,
  Life: lifeCount,
  Vehicle: vehicleCount,
  Travel: travelCount,
  Home: homeCount
};

const mostRecommended =
  Object.keys(insuranceCounts).reduce((a, b) =>
    insuranceCounts[a] > insuranceCounts[b] ? a : b
  );
const [form, setForm] = useState({
  insuranceType: "",
  recommendation: ""
});
const generatePDF = () => {
  window.print();
};

  // FETCH DATA
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://insurance-ai-project-5.onrender.com/all-insurance");
      setRecords(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {

  const token =
    localStorage.getItem("token");

  if (!token) {

    alert("Please Login First");

    window.location.href =
      "/login";

    return;
  }

  fetchRecords();

}, []);  

  // DELETE
  const deletePolicy = async (id) => {
    const ok = window.confirm("Delete this record?");
    if (!ok) return;

    await axios.delete(`https://insurance-ai-project-y80e.onrender.com/insurance/${id}`);
    setRecords((prev) => prev.filter((i) => i._id !== id));
  };

  // EDIT
  const startEdit = (item) => {
    setEditId(item._id);
    setForm({
      insuranceType: item.insuranceType,
      recommendation: item.recommendation
    });
  };

  // UPDATE
  const handleUpdate = async () => {
    await axios.put(
      `https://insurance-ai-project-y80e.onrender.com/insurance/${editId}`,
      form
    );

    setEditId(null);
    fetchRecords();
  };

  // FILTER
  const filteredRecords = records.filter((item) =>
    item.formData?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // STATS
  const health = records.filter(i => i.insuranceType === "Health").length;
  const life = records.filter(i => i.insuranceType === "Life").length;
  const vehicle = records.filter(i => i.insuranceType === "Vehicle").length;
  const travel = records.filter(i => i.insuranceType === "Travel").length;
  const home = records.filter(i => i.insuranceType === "Home").length;

  const chartData = {
  labels: ["Health", "Life", "Vehicle", "Travel", "Home"],
  datasets: [
    {
      label: "Policies",
      data: [
        healthCount,
        lifeCount,
        vehicleCount,
        travelCount,
        homeCount
      ],

      backgroundColor: [
        "#10B981", // Health - Green
        "#3B82F6", // Life - Blue
        "#F59E0B", // Vehicle - Orange
        "#8B5CF6", // Travel - Purple
        "#EF4444"  // Home - Red
      ],

      borderColor: [
        "#059669",
        "#2563EB",
        "#D97706",
        "#7C3AED",
        "#DC2626"
      ],

      borderWidth: 2,
      borderRadius: 10
    }
  ]
};
const options = {
  responsive: true,

  plugins: {
    legend: {
      labels: {
        color: "#000",
        font: {
          size: 16,
          weight: "bold"
        }
      }
    },

    title: {
      display: true,
      text: "Insurance Policies Distribution",
      color: "#000",
      font: {
        size: 28,
        weight: "bold"
      },
      padding: {
  top: 10,
  bottom: 25
}
    }
  },

  scales: {
    x: {
      ticks: {
        color: "#000",
        font: {
          size: 18,
          weight: "bold"
        }
      },

      title: {
        display: true,
        text: "Insurance Types",
        color: "#000",
        font: {
          size: 18,
          weight: "bold"
        }
      }
    },

    y: {
      beginAtZero: true,

      ticks: {
        color: "#000",
        font: {
          size: 18,
          weight: "bold"
        }
      },

      title: {
        display: true,
        text: "Number of Policies",
        color: "#000",
        font: {
          size: 18,
          weight: "bold"
        }
      }
    }
  }
};


  return (
    <div style={{ padding: "20px" }}>
    <button
  onClick={() => {

    localStorage.removeItem(
      "token"
    );

    window.location.href =
      "/login";

  }}
  style={{
    float: "right",
    padding: "10px 20px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }}
>
  Logout
</button> 
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>

  <div>Male Users: {maleUsers}</div>
  <div>Female Users: {femaleUsers}</div>
  <div>Average Age: {averageAge}</div>
  <div>Most Recommended: {mostRecommended}</div>

</div>

      <h1
  style={{
    textAlign: "center",
    color: "#1e3a8a",
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "25px"
  }}
>
  📊 Insurance Analytics Dashboard
</h1>
      {loading && <h3>Loading...</h3>}

      {/* SEARCH */}
      <input
        placeholder="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "10px", marginBottom: "15px" }}
      />

      {/* TABLE */}
      <div
  style={{
    overflowX: "auto",
    background: "white",
    borderRadius: "15px",
    padding: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
  }}
>
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse"
    }}
  >
       <thead>
<tr>
  <th>Name</th>
  <th>Age</th>
  <th>Gender</th>
  <th>Type</th>
  <th>Plan</th>
  <th>Premium</th>
  <th>Coverage</th>
  <th>Risk Score</th>
  <th>Claim %</th>
  <th>Occupation</th>
  <th>Riders</th>
  <th>Readiness</th>
  <th>Date</th>
  <th>Required Coverage</th>
  <th>Current Coverage</th>
  <th>Insurance Gap</th>
  <th>Status</th>
  <th>Actions</th>
</tr>
</thead>

        <tbody>
          {filteredRecords.map((item) => {

            const claim = parseInt(item.claimSettlement || 0);

            return (
              <tr
  key={item._id}
  style={{
    borderBottom: "1px solid #ddd"
  }}
>
  <td style={{ padding: "10px" }}>
  {item.formData?.name}
</td>

  <td>{item.formData?.age}</td>

  <td>{item.formData?.gender}</td>

  <td>{item.insuranceType}</td>

  <td>{item.recommendation}</td>

  <td>₹{item.premium || 0}</td>

  <td>₹{item.coverage || 0}</td>

  <td
    style={{
      color:
        item.riskScore > 70
          ? "red"
          : item.riskScore > 40
          ? "orange"
          : "green",
      fontWeight: "bold"
    }}
  >
    {item.riskScore || 0}
  </td>

  <td
    style={{
      color:
        parseInt(item.claimSettlement) >= 90
          ? "green"
          : parseInt(item.claimSettlement) >= 80
          ? "orange"
          : "red",
      fontWeight: "bold"
    }}
  >
    {item.claimSettlement || "0%"}
  </td>
  

  <td>{item.formData?.occupation || "N/A"}</td>
  <td>
  {
    item.riders?.length > 0
      ? item.riders.join(", ")
      : "No Riders"
  }
</td>

<td>
  {item.readinessScore || "N/A"}
</td>
<td>
  {item.createdAt
    ? new Date(item.createdAt).toLocaleDateString()
    : "N/A"}
</td>
<td>
  ₹{item.requiredCoverage || 0}
</td>

<td>
  ₹{item.coverage || 0}
</td>

<td>
  ₹{item.insuranceGap || 0}
</td>

<td>
  {item.insuranceGap > 0
    ? "Underinsured"
    : "Adequately Covered"}
</td>
  <td>
    <button onClick={() => startEdit(item)}>
      Edit
    </button>

    <button onClick={() => deletePolicy(item._id)}>
      Delete
    </button>
  </td>
</tr>
            );
          })}
        </tbody>
      </table>
      </div>

      {/* CHART */}
      <div
  style={{
    width: "900px",
    marginTop: "30px",
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
  }}
>
  <Bar data={chartData} options={options} />
</div>

      {/* CSV EXPORT */}
      <CSVLink data={records} filename="insurance.csv">
        <button style={{ marginTop: "20px", padding: "10px" }}>
          Export CSV
        </button>
      </CSVLink>
    <button
  onClick={generatePDF}
  style={{
    marginTop: "20px",
    marginLeft: "10px",
    padding: "10px"
  }}
>
  Export PDF
</button>  

      {/* EDIT FORM */}
      {editId && (
        <div style={{ marginTop: "20px" }}>
          <h3>Edit</h3>

          <input
            value={form.insuranceType}
            onChange={(e) =>
              setForm({ ...form, insuranceType: e.target.value })
            }
          />

          <input
            value={form.recommendation}
            onChange={(e) =>
              setForm({ ...form, recommendation: e.target.value })
            }
          />

          <button onClick={handleUpdate}>Update</button>
        </div>
      )}

    </div>
  );
}

export default Dashboard;