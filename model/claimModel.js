const mongoose = require("mongoose")

const claimSchema = new mongoose.Schema({

    claimId: {type: String},
    insuranceId: {type: String, required: true},
    claimedAmount: {type : Number, required: true},
    reason: {type: String, required: true},
    requestDate: {type : Date},
    status: {type: String}

})

module.exports = mongoose.model('claim', claimSchema);





// claimId: '4ca4853d-cfc0-4487-a264-8ad1d76ed8c8',
//     insuranceId: '21802de5-b1f4-4760-9e22-6b07abc66c56',
//     claimedAmount: 35000,
//     reason: 'accident',
//     requestDate: '12/12/12',
//     status: 'Pending'