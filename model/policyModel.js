const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
    insuranceId: {type: String, required: true},
    userId: {
        type: String,
        required: true
    },
    policyType: {type: String, required: true},
    coverageAmount: {type: Number, required: true},
    residualAmount: {type: Number, required: true},
    premium: {type: Number},
    startDate: {type: Date},
    endDate: {type: Date}

})


module.exports = mongoose.model.allpolicies || mongoose.model('policy', policySchema);



