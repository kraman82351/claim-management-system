const mongoose = require( "mongoose");

const policySchema = new mongoose.Schema({
    insuranceId: {type: String},
    endDate: {type: String}
});

const claimSchema = new mongoose.Schema({
    claimId: {type: String},
    claimAmount: {type: String}
});

const UserSchema = new mongoose.Schema({
    userId : {
        type: String,
        required: true,
        unique: true
    },
    fullName : {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: [true, "email is already in use"]
    }, 
    password: {
        type: String,
        required: true
    },
    policies: { type: Array , default: []},
    claims: {type: Array , default: []}

});

module.exports = mongoose.model.allUsers || mongoose.model('User', UserSchema);









