require("dotenv").config();
const { PythonShell } = require("python-shell");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");


const AuthUser = require("./models/AuthUser");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const Insurance = require("./models/Insurance");

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

connectDB();

app.use(cors());
app.use(express.json());
const authRoutes =
  require("./routes/Auth");

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend Working");
});

// HEALTH INSURANCE
app.post("/health/recommend", async (req, res) => {
  try {
    const data = req.body;

    let score = 0;
    let riders = [];

    if (data.age > 50) score += 30;
    if (data.smoking) score += 40;
    if (data.alcohol) score += 20;
    if (data.diseases && data.diseases.length > 0) score += 30;
    if (data.occupation === "Driver")
  score += 20;

if (data.occupation === "Construction Worker")
  score += 30;

if (data.occupation === "Doctor")
  score += 10;

if (data.occupation === "Teacher")
  score += 5;
if (data.gender === "Female") {

  if (data.pregnancy === 1)
    score += 20;

  if (data.children >= 3)
    score += 10;
}
if (data.gender === "Male") {

  if (data.age > 55)
    score += 10;

  if (data.smoking)
    score += 15;
}
    let riskPercent = Math.min((score / 100) * 100, 100);
    let basePremium = 2000;
let premium = basePremium + (riskPercent * 80);
let maxCoverage = 1000000;

let coverage = maxCoverage - (riskPercent * 8000);

if (coverage < 100000) coverage = 100000;
let requiredCoverage = data.income * 10;

let insuranceGap =
  requiredCoverage - coverage;

if (insuranceGap < 0)
  insuranceGap = 0;
let claimSettlement;

if (riskPercent <= 30) {
  claimSettlement = "95%";
} else if (riskPercent <= 60) {
  claimSettlement = "85%";
} else {
  claimSettlement = "70%";
}

    let recommendation = "";

    if (score >= 70) {
      recommendation = "High Risk Health Insurance Plan";
    } else if (score >= 40) {
      recommendation = "Medium Risk Health Insurance Plan";
    } else {
      recommendation = "Low Risk Health Insurance Plan";
    }
    riders.push("Hospital Cash Rider");

if (data.age > 40)
  riders.push("Critical Illness Rider");

if (data.gender === "Female")
  riders.push("Maternity Rider");

if (data.smoking)
  riders.push("Cancer Care Rider");

if (data.diseases)
  riders.push("Pre-existing Disease Rider");

if (data.occupation === "Driver")
  riders.push("Accidental Cover Rider");

if (data.occupation === "Construction Worker")
  riders.push("Disability Cover Rider");

let readinessScore = 100 - riskPercent;

   const saved = await Insurance.create({
  insuranceType: "Health",
  formData: {
  ...data,
  riders
}, 




  premium,
  coverage,
  riskScore: score,
  riskPercent,
  claimSettlement,
  readinessScore,

  riders
});


if (data.age >= 25) readinessScore += 10;
if (data.income >= 500000) readinessScore += 15;
if (data.dependents > 0) readinessScore += 10;
if (data.property_owner) readinessScore += 5;
if (data.vehicle_owner) readinessScore += 5;
if (data.risk_preference === "High") readinessScore += 5;

if (readinessScore > 100)
  readinessScore = 100;
 res.json({
  ...saved._doc,
  riskScore: score,
  riskPercent,
  premium,
  coverage,
  readinessScore,
  requiredCoverage,
  insuranceGap,
  claimSettlement,
  riders
});
return;
} catch (error) {
  console.log(error);
  res.status(500).json({ error: error.message });
}
});


app.post("/life/recommend", async (req, res) => {

  const data = req.body;

  let riders = [];

  riders.push("Accidental Death Rider");

  if (data.age > 40)
    riders.push("Critical Illness Rider");

  if (data.children > 0)
    riders.push("Child Education Rider");

  if (data.income < 500000)
    riders.push("Waiver of Premium Rider");

  if (data.dependents > 2)
    riders.push("Income Benefit Rider");
  let readinessScore = 50;

if (data.age >= 25) readinessScore += 10;
if (data.income >= 500000) readinessScore += 15;
if (data.dependents > 0) readinessScore += 10;
if (data.property_owner) readinessScore += 5;
if (data.vehicle_owner) readinessScore += 5;
if (data.risk_preference === "High") readinessScore += 5;

if (readinessScore > 100)
  readinessScore = 100;
let riskScore = 20;

let riskPercent = 20;

let premium = 5000;

let coverage = 500000;

let claimSettlement = "95%";

let requiredCoverage =
  Number(data.income) * 10;

let insuranceGap =
  requiredCoverage - coverage;

if (insuranceGap < 0)
  insuranceGap = 0;

 res.json({
  riders,
  premium,
  coverage,
  claimSettlement,
  riskScore,
  riskPercent,
  readinessScore,
  requiredCoverage,
  insuranceGap
});

});
app.post("/vehicle/recommend", async (req, res) => {

  const data = req.body;

  let riders = [];

  riders.push("Roadside Assistance Rider");

  if (data.vehicle_age > 5)
    riders.push("Engine Protection Rider");

  if (data.vehicle_age < 2)
    riders.push("Zero Depreciation Rider");

  if (data.travel_frequency > 3)
    riders.push("Return To Invoice Rider");

  let riskScore = 25;

let riskPercent = riskScore;

let premium = 2500 + riskPercent * 40;

let coverage = 1000000 - riskPercent * 3000;
let requiredCoverage =
  Number(data.income) * 10;

let insuranceGap =
  requiredCoverage - coverage;

if (insuranceGap < 0)
  insuranceGap = 0;

let claimSettlement = "95%";
let readinessScore = 50;

if (data.age >= 25) readinessScore += 10;
if (data.income >= 500000) readinessScore += 15;
if (data.dependents > 0) readinessScore += 10;
if (data.property_owner) readinessScore += 5;
if (data.vehicle_owner) readinessScore += 5;
if (data.risk_preference === "High") readinessScore += 5;

if (readinessScore > 100)
  readinessScore = 100;

res.json({
  riders,
  premium,
  coverage,
  claimSettlement,
  riskScore,
  riskPercent,
  readinessScore,
  insuranceGap,
  requiredCoverage
});

});
app.post("/travel/recommend", async (req, res) => {

  const data = req.body;

  let riders = [];

  riders.push("Emergency Medical Rider");

  if (data.travel_frequency > 3)
    riders.push("Trip Cancellation Rider");

  if (data.travel_frequency > 2)
    riders.push("Flight Delay Rider");

  riders.push("Baggage Loss Rider");

 let riskScore = 15;

let riskPercent = riskScore;

let premium = 1500 + riskPercent * 30;

let coverage = 500000 - riskPercent * 1000;

let claimSettlement = "95%";
let readinessScore = 50;

if (data.age >= 25) readinessScore += 10;
if (data.income >= 500000) readinessScore += 15;
if (data.dependents > 0) readinessScore += 10;
if (data.property_owner) readinessScore += 5;
if (data.vehicle_owner) readinessScore += 5;
if (data.risk_preference === "High") readinessScore += 5;

if (readinessScore > 100)
  readinessScore = 100;
let requiredCoverage =
  Number(data.income) * 10;

let insuranceGap =
  requiredCoverage - coverage;

if (insuranceGap < 0)
  insuranceGap = 0;

res.json({
  riders,
  premium,
  coverage,
  claimSettlement,
  riskScore,
  riskPercent,
  readinessScore,
  requiredCoverage,
  insuranceGap
});

});
app.post("/home/recommend", async (req, res) => {

  const data = req.body;

  let riders = [];

  riders.push("Fire Protection Rider");

  if (data.property_owner)
    riders.push("Theft Protection Rider");

  riders.push("Flood Protection Rider");

  if (data.property_owner)
    riders.push("Earthquake Cover Rider");
let riskScore = 10;

let riskPercent = riskScore;

let premium = 4000 + riskPercent * 50;

let coverage = 2000000 - riskPercent * 5000;

let claimSettlement = "95%";
let readinessScore = 50;

if (data.age >= 25) readinessScore += 10;
if (data.income >= 500000) readinessScore += 15;
if (data.dependents > 0) readinessScore += 10;
if (data.property_owner) readinessScore += 5;
if (data.vehicle_owner) readinessScore += 5;
if (data.risk_preference === "High") readinessScore += 5;

if (readinessScore > 100)
  readinessScore = 100;
let requiredCoverage =
  Number(data.income) * 10;

let insuranceGap =
  requiredCoverage - coverage;

if (insuranceGap < 0)
  insuranceGap = 0;

res.json({
  riders,
  premium,
  coverage,
  claimSettlement,
  riskScore,
  riskPercent,
  readinessScore,
  requiredCoverage,
  insuranceGap
});

});


// GET ALL RECORDS
app.get("/all-insurance", async (req, res) => {
  try {
    const data = await Insurance.find().sort({
      createdAt: -1
    });

    res.json(data);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message
    });
  }
});

// DELETE
app.delete("/insurance/:id", async (req, res) => {
  try {
    await Insurance.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Deleted Successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message
    });
  }
});

// UPDATE
app.put("/insurance/:id", async (req, res) => {
  try {
    const updated =
      await Insurance.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updated);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message
    });
  }
});
app.post("/save-ai-recommendation", async (req, res) => {
  try {

    console.log("SAVE ROUTE BODY:");
    console.log(JSON.stringify(req.body, null, 2));

    const saved = await Insurance.create({
      insuranceType: req.body.insuranceType,
      recommendation: req.body.recommendation,

      formData: req.body.formData,

      premium: req.body.formData?.premium,
      coverage: req.body.formData?.coverage,
      riskScore: req.body.formData?.riskScore,
      riskPercent: req.body.formData?.riskPercent,
      claimSettlement: req.body.formData?.claimSettlement,

      riders: req.body.formData?.riders || [],
      requiredCoverage:
    req.body.formData?.requiredCoverage,
     insuranceGap:
    req.body.formData?.insuranceGap,
      readinessScore: 
      req.body.formData?.readinessScore,
    });

    res.json(saved);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message
    });
  }
});
app.post("/register", async (req, res) => {
  try {

    const { name, email, password } =
      req.body;

    const existing =
      await AuthUser.findOne({ email });

    if (existing) {
      return res.json({
        message: "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await AuthUser.create({
        name,
        email,
        password: hashedPassword
      });

    res.json({
      message: "Registration Successful"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await AuthUser.findOne({
      email
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET
    );

    res.json({
      token,
      name: user.name
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});
app.post("/ml-recommend", async (req, res) => {

  try {

    const data = req.body;

    const options = {
      mode: "text",
      pythonOptions: ["-u"],
      args: [JSON.stringify(data)]
    };

    PythonShell.run(
      "predict.py",
      options
    ).then(results => {

      res.json({
        recommendation: results[0]
      });

    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});
 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get("/count", async (req, res) => {
  try {
    const count = await Insurance.countDocuments();
    res.json({ totalRecords: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});