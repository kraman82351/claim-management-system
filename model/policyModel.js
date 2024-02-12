const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
    insuranceId: {type: String},
    userId: {
        type: String,
        required: true
    },
    policyType: {type: String},
    coverageAmount: {type: Number},
    residualAmount: {type: Number},
    premium: {type: Number},
    startDate: {type: Date},
    endDate: {type: Date}

})


module.exports = mongoose.model.allpolicies || mongoose.model('policy', policySchema);



