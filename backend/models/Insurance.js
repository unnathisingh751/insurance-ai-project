const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema({

  insuranceType: String,

  formData: Object,

  recommendation: String,

  premium: Number,

  coverage: Number,

  riskScore: Number,

  riskPercent: Number,
  requiredCoverage: Number,
  insuranceGap: Number,

  readinessScore: Number,

  claimSettlement: String,

   riders: [String],

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "Insurance",
  insuranceSchema
);