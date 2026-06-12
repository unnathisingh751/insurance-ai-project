const User = require('../models/User');

const getRecommendation = async (req, res) => {

    try {

        const {

            name,
            age,
            gender,
            income,
            occupation,
            diseases,
            smoking,
            alcohol,
            familySize,
            vehicleDetails,
            travelFrequency,
            riskPreference

        } = req.body;

        let plan = '';

        let score = 0;

        if (income > 100000) {
            score += 20;
        }

        if (smoking === 'No') {
            score += 15;
        }

        if (alcohol === 'No') {
            score += 15;
        }

        if (riskPreference === 'Low') {
            score += 20;
        }

        if (travelFrequency === 'High') {
            score += 10;
        }

        if (age > 45) {
            score += 10;
        }

        if (diseases === '') {
            score += 10;
        }

        if (score >= 70) {

            plan = 'Premium Insurance Plan';

        } else if (score >= 40) {

            plan = 'Standard Insurance Plan';

        } else {

            plan = 'Basic Insurance Plan';

        }

        const accuracy = `${score}%`;

        const user = await User.create({

            name,
            age,
            gender,
            income,
            occupation,
            diseases,
            smoking,
            alcohol,
            familySize,
            vehicleDetails,
            travelFrequency,
            riskPreference,
            recommendedPlan: plan,
            accuracy

        });

        res.json({

            success: true,
            user

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });

    }
};

module.exports = {
    getRecommendation
};