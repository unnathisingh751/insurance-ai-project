const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

 name: String,

  email: String,

  password: String,


age: Number,

gender: String,

income: Number,

occupation: String,

diseases: String,

smoking: String,

alcohol: String,

familySize: Number,

vehicleDetails: String,

travelFrequency: String,

riskPreference: String,

recommendedPlan: String,

accuracy: String

});

module.exports = mongoose.model('User', userSchema);