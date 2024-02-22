const mongoose = require( "mongoose");

const availablePoliciesSchema = new mongoose.Schema({
    policyNumber: {
        type: Number,
        required: true,
        unique: [true, "policy number is already in use"] 
    },
    policyType: {type: String, required: true},
    coverageAmount: {type: Number, required: true},
    premium: {type: Number, required: true}
},{timestamps: true})


module.exports = mongoose.model('availablePolicy',availablePoliciesSchema); 

