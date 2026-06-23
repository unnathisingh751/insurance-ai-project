import { useState } from "react";
import axios from "axios";

function AIForm() {

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    income: "",
    smoking: 0,
    alcohol: 0,
    diseases: 0,
    occupation: "",
pregnancy: 0,
children: "",
exercise: "",
    family_size: "",
    dependents: "",
    vehicle_owner: 0,
    vehicle_age: "",
    travel_frequency: "",
    property_owner: 0,
    risk_preference: "Low"
  });

  const [recommendation, setRecommendation] = useState("");
const [plans, setPlans] = useState([]);
const [reason, setReason] = useState("");
const [riders, setRiders] = useState([]);
const [result, setResult] = useState("");
const [analysis, setAnalysis] = useState({});

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
   "https://insurance-ai-project-5.onrender.com/predict",
      {
        age: Number(form.age),
        gender: form.gender,
        income: Number(form.income),
        smoking: Number(form.smoking),
        alcohol: Number(form.alcohol),
        diseases: Number(form.diseases),
        family_size: Number(form.family_size),
        dependents: Number(form.dependents),
        vehicle_owner: Number(form.vehicle_owner),
        vehicle_age: Number(form.vehicle_age),
        travel_frequency: Number(form.travel_frequency),
        property_owner: Number(form.property_owner),
        risk_preference: form.risk_preference
      }
    );

console.log("FLASK RESPONSE:", res.data);

let route = "health";
if (
  res.data.recommendation
    .toLowerCase()
    .includes("life")
) {
  route = "life";
}
else if (
  res.data.recommendation
    .toLowerCase()
    .includes("vehicle")
) {
  route = "vehicle";
}
else if (
  res.data.recommendation
    .toLowerCase()
    .includes("travel")
) {
  route = "travel";
}
else if (
  res.data.recommendation
    .toLowerCase()
    .includes("home")
) {
  route = "home";
}

const nodeRes = await axios.post(
  `https://insurance-ai-project-y80e.onrender.com/${route}/recommend`,
  {
    age: Number(form.age),
    gender: form.gender,
    income: Number(form.income),
    smoking: Number(form.smoking),
    alcohol: Number(form.alcohol),
    diseases: Number(form.diseases),
    occupation: form.occupation,
    pregnancy: Number(form.pregnancy),
    children: Number(form.children),
    dependents: Number(form.dependents),
    vehicle_age: Number(form.vehicle_age),
    travel_frequency: Number(form.travel_frequency),
    property_owner: Number(form.property_owner)
  }
);
console.log(nodeRes.data);

setResult(res.data.recommendation);
setPlans(res.data.plans || []);
setReason(res.data.reason || "");
setRiders(nodeRes.data.riders || []);
setAnalysis(nodeRes.data);

console.log("Plans:", res.data.plans);
console.log("Reason:", res.data.reason);

setForm((prev) => ({
  ...prev,

  premium: nodeRes.data.premium,
  coverage: nodeRes.data.coverage,

  riskScore: nodeRes.data.riskScore,
  riskPercent: nodeRes.data.riskPercent,

  readinessScore: nodeRes.data.readinessScore,

  requiredCoverage:
    nodeRes.data.requiredCoverage,

  insuranceGap:
    nodeRes.data.insuranceGap,

  claimSettlement:
    nodeRes.data.claimSettlement
}));
// SAVE TO DATABASE
console.log({
  insuranceType: res.data.recommendation,
recommendation: res.data.recommendation,
 formData: {
  ...form,
  premium: nodeRes.data.premium,
  coverage: nodeRes.data.coverage,
  riskScore: nodeRes.data.riskScore,
  riskPercent: nodeRes.data.riskPercent,
  claimSettlement: nodeRes.data.claimSettlement,
  riders: nodeRes.data.riders,
  readinessScore:
  nodeRes.data.readinessScore,

requiredCoverage:
  nodeRes.data.requiredCoverage,

insuranceGap:
  nodeRes.data.insuranceGap,
},
});
await axios.post(
  "https://insurance-ai-project-y80e.onrender.com/save-ai-recommendation",
  {
    insuranceType: res.data.recommendation,

   formData: {
  ...form,
  premium: nodeRes.data.premium,
  coverage: nodeRes.data.coverage,
  riskScore: nodeRes.data.riskScore,
  riskPercent: nodeRes.data.riskPercent,
  readinessScore: nodeRes.data.readinessScore,
  requiredCoverage: nodeRes.data.requiredCoverage,
  insuranceGap: nodeRes.data.insuranceGap,
  status: nodeRes.data.status,
  claimSettlement: nodeRes.data.claimSettlement,
  riders: nodeRes.data.riders
},
    recommendation: res.data.recommendation
  }
);
    } catch (err) {
  console.log("FULL ERROR:");
  console.log(err);

  if (err.response) {
    console.log("Response Data:", err.response.data);
    console.log("Status:", err.response.status);
  }

  setResult("Error getting recommendation");
}
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Insurance Recommendation System</h1>

      <form onSubmit={handleSubmit}>

<input
  placeholder="Full Name"
  value={form.name}
  onChange={(e) =>
    setForm({
      ...form,
      name: e.target.value
    })
  }
/>

<br /><br />
        <input
          placeholder="Age"
          value={form.age}
          onChange={(e) =>
            setForm({ ...form, age: e.target.value })
          }
        />

        <br /><br />

        <select
          value={form.gender}
          onChange={(e) =>
            setForm({ ...form, gender: e.target.value })
          }
        >
          <option>Male</option>
          <option>Female</option>
        </select>
{form.gender === "Female" && (
  <>
    <br /><br />

    <label>Pregnant:</label>

    <select
      value={form.pregnancy}
      onChange={(e) =>
        setForm({
          ...form,
          pregnancy: e.target.value
        })
      }
    >
      <option value="0">No</option>
      <option value="1">Yes</option>
    </select>

    <br /><br />

    <input
      placeholder="Number of Children"
      value={form.children}
      onChange={(e) =>
        setForm({
          ...form,
          children: e.target.value
        })
      }
    />
  </>
)}
        <br /><br />

        <input
          placeholder="Annual Income"
          value={form.income}
          onChange={(e) =>
            setForm({ ...form, income: e.target.value })
          }
        />
        <label>Occupation:</label>

<select
  value={form.occupation}
  onChange={(e) =>
    setForm({
      ...form,
      occupation: e.target.value
    })
  }
>
  <option value="">Select</option>
  <option value="Student">Student</option>
  <option value="IT Employee">IT Employee</option>
  <option value="Teacher">Teacher</option>
  <option value="Driver">Driver</option>
  <option value="Doctor">Doctor</option>
  <option value="Construction Worker">
    Construction Worker
  </option>
</select>

        <br /><br />

        <label>Smoking:</label>
        <select
  value={form.smoking}
  onChange={(e) =>
    setForm({ ...form, smoking: e.target.value })
  }
>
        
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <br /><br />

        <label>Alcohol:</label>
        <select
          onChange={(e) =>
            setForm({ ...form, alcohol: e.target.value })
          }
        >
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <br /><br />

        <label>Diseases:</label>
        <select
          onChange={(e) =>
            setForm({ ...form, diseases: e.target.value })
          }
        >
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <br /><br />

        <input
          placeholder="Family Size"
          value={form.family_size}
          onChange={(e) =>
            setForm({ ...form, family_size: e.target.value })
          }
        />

        <br /><br />

        <input
          placeholder="Dependents"
          value={form.dependents}
          onChange={(e) =>
            setForm({ ...form, dependents: e.target.value })
          }
        />

        <br /><br />

        <label>Vehicle Owner:</label>
        <select
          onChange={(e) =>
            setForm({ ...form, vehicle_owner: e.target.value })
          }
        >
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <br /><br />

        <input
          placeholder="Vehicle Age"
          value={form.vehicle_age}
          onChange={(e) =>
            setForm({ ...form, vehicle_age: e.target.value })
          }
        />

        <br /><br />

        <input
          placeholder="Travel Frequency (1-5)"
          value={form.travel_frequency}
          onChange={(e) =>
            setForm({ ...form, travel_frequency: e.target.value })
          }
        />

        <br /><br />

        <label>Property Owner:</label>
        <select
          onChange={(e) =>
            setForm({ ...form, property_owner: e.target.value })
          }
        >
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <br /><br />

        <label>Risk Preference:</label>
        <select
          value={form.risk_preference}
          onChange={(e) =>
            setForm({
              ...form,
              risk_preference: e.target.value
            })
          }
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <br /><br />

        <button type="submit">
          Get Insurance Recommendation
        </button>

      </form>

      <br />
<h2>Recommended Insurance</h2>

<h3>
  🏆 Best Match: {result}
</h3>
<div style={{ marginTop: "10px", padding: "10px", border: "1px solid black" }}>
  <h3>💰 Premium: ₹{form.premium}</h3>
  <h3>🛡 Coverage: ₹{form.coverage}</h3>
  <h3>📄 Claim Settlement: {form.claimSettlement}</h3>
<h3>Recommended Riders</h3>

{
  riders.length > 0 ? (
    <ul>
      {riders.map((rider, index) => (
        <li key={index}>
          {rider}
        </li>
      ))}
    </ul>
  ) : (
    <p>No Riders Available</p>
  )
}
  <p>Risk Score: {form.riskScore}</p>
  <p>Risk Percent: {form.riskPercent}%</p>
  <p>
   


<p>
  Current Coverage:
  ₹{form.coverage}
</p>
   
  Required Coverage:
  ₹{form.requiredCoverage}

<p>
  Insurance Gap:
  ₹{form.insuranceGap}
</p>

<p>
  Status:
  {
    form.insuranceGap > 0
      ? " Underinsured"
      : " Adequately Insured"
  }
</p>
 
</p>

 
  


  <p>
  Insurance Readiness Score:
  <strong> {form.readinessScore}/100</strong>
</p>
</div>
<div
  style={{
    marginTop: "15px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "10px"
  }}
>
  <h3>🤖 AI Explanation</h3>

  <p>
    This recommendation was generated based on:
    <strong> {reason}</strong>.
  </p>
</div>

<br />

<h2>All Recommended Plans</h2>

{(plans || []).map((plan, index) => (
  <div
    key={index}
    style={{
      padding: "15px",
      marginBottom: "15px",
      borderRadius: "12px",
      border: "1px solid #ddd",
      backgroundColor: "#f9f9f9"
    }}
  >
    <h3>
      #{index + 1} {plan.plan} Insurance
    </h3>

    <p>
      Match Score: <strong>{plan.score}%</strong>
    </p>

    <div
      style={{
        width: "100%",
        height: "20px",
        backgroundColor: "#ddd",
        borderRadius: "10px",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          width: `${plan.score}%`,
          height: "100%",
          backgroundColor:
            plan.score >= 70
              ? "green"
              : plan.score >= 40
              ? "orange"
              : "red"
        }}
      />
    </div>
  </div>
))}

    </div>
  );
}

export default AIForm;