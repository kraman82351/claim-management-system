const mongoose = require("mongoose")

const claimSchema = new mongoose.Schema({

    claimId: {type: String, required: true},
    insuranceId: {type: String, required: true},
    claimedAmount: {type : Number, required: true},
    reason: {type: String, required: true},
    requestDate: {type : Date},
    status: {type: String}

})

module.exports = mongoose.model('claim', claimSchema);

