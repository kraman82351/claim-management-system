//jshint esversion:6
require("dotenv").config();
const mongoose = require('mongoose');
const express = require("express");
const client = require('prom-client')
const cors = require("cors")
const jwt = require('jsonwebtoken')
const data = require('./database/SampleData.js')
const bodyParser = require("body-parser");
const connect = require('./database/conn.js');
const bcrypt = require('bcryptjs');
const swaggerui = require("swagger-ui-express")
const { v4: uuidv4 } = require('uuid'); // for unique ID generation

const app = express();
connect();
app.use(express.json());
app.use(cors());

const users = require('./model/userModel.js');
const availablePolicies = require('./model/availablePolicy.js');
const claims = require('./model/claimModel.js');
const policies = require('./model/policyModel.js');

const collectDefaultMetrics = client.collectDefaultMetrics

collectDefaultMetrics({register : client.register});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const swaggerDefinition = require('./swagger');

// Combine all Swagger routes into a single object
app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerDefinition));


//generate unique id
function generateUniqueId(req, res, next) {
    req.uniqueId = uuidv4(); // Generating a unique ID using uuidv4 and attaching it to the request object
    next(); 
}



//password verification
function passwordValidate(errors = {}, password){
    /* eslint-disable no-useless-escape */
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    errors = { message: "ok"};

    if(!password){
        errors.message = "Password Required...!";
    } else if(password.includes(" ")){
        errors.message = "Password must not contain spaces";
    }else if(password.length < 4){
        errors.message = "Password must be more than 4 characters long";
    }else if(!specialChars.test(password)){
        errors.message = "Password must have special character";
    }
    return errors;
}

//email validation
function emailValidate(error ={}, email){
    error.message = "ok";

    if(!email){
        error.message = "Email Required...!";
    }else if(email.includes(" ")){
        error.message = "Email should not include spaces";
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)){
        error.message = "Invalid email address...!";
    }

    return error;
}

//name validation
function isNameValid(name) {
    const digitRegex = /\d/;
    return !digitRegex.test(name);
}

//prometheius
app.get("/metrics", async (req, res) =>{
    res.setHeader("Comntent-Type", client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
})

//register user 
app.post("/register", generateUniqueId, (req, res) =>{
    const { fullName, address, emailId, password} = req.body;

    if( !fullName || !address || !emailId || !password){
        return res.status(400).json({
            status: 400,
            message : "All fields are mandatory" 
        });
    }

    if(!isNameValid(fullName)){
        return res.status(400).json({
            status: 400,
            message : "Name should not contain numbers" 
        });
    }

    //email validation
    const emailError = emailValidate({}, emailId);
    if(emailError.message != "ok"){
        return res.status(400).send({status: 409, message: emailError.message});
    }

    //password validation
    const passwordError = passwordValidate({}, password);
    if(passwordError.message != "ok"){
        return res.status(400).send({status: 409, message: passwordError.message});
    }
    users.findOne({emailId })
        .then( user =>{
            if(user){
                return res.status(409).json({
                    status: 409,
                    message : "Email already in use" 
                })
            }
            bcrypt.hash(password, 10)
                .then(hassedPassword => {
                    userData = new users({
                        userId: req.uniqueId,
                        fullName: fullName,
                        address: address,
                        emailId: emailId,
                        password: hassedPassword,
                        policies: [],
                        claims: []
                    });
                    
                    userData.save()
                        .then(result => res.status(201).json({
                            status: 200,
                            response : userData,
                            message:"User Register Successfully"}))
                        .catch(error => res.status(500).json({
                            status: 500,
                            message: "Registration failed. Try again later"
                        }))
                })
                .catch(error => {
                    return res.status(500).send({
                        error : "Enable to hashed password"
                    })
                })

        });
  
});

//user login
app.post("/userlogin", function(req, res){
    const {emailId, password} = req.body;

    if(!emailId || !password){
        return res.status(400).json({
            status: 400,
            message : "All fields are mandatory" 
        });
    }

    users.findOne({emailId})
        .then(user => {
            if(!user){
                return res.status(409).json({
                    status: 409,
                    message : "Email Id not registered" 
                })
            }
            bcrypt.compare(password, user.password)
                .then(passwordCheck =>{
                    if(!passwordCheck) return res.status(400).send({ message: "Don't have Password"});

                    const token = jwt.sign({
                        userId: user._id,
                    }, process.env.JWT_SECRET , { expiresIn : "24h"});

                    return res.status(200).send({
                        status: 200,
                        message: "Login Successful...!",
                        userId: user.userId,
                        token
                    }); 

                })
                .catch(error =>{
                    return res.status(400).send({ message: "Password does not Match"})
                })
        })
        .catch(error => res.status(500).json({message:"Server Error"}));
})

//admin login
app.post("/adminlogin", function(req, res){
    const { emailId, password } = req.body;

    if (!emailId || !password) {
        return res.status(400).json({
            status: 400,
            message: "All fields are mandatory" 
        });
    }

    const adminData = data.adminData.find(admin => admin.emailId === emailId && admin.password === password);

    if (adminData) {
        // If credentials match, send a JSON response with a success message
        res.json({ status: 200, message: "Admin logged In" });
    } else {
        // If credentials don't match, send a JSON response with an error message
        res.status(400).json({
            status: 400,
            message: "Wrong credentials" 
        });
    }
    
})



//get count 
app.get("/admin/getcount", async (req, res) => {
    try {
        const totalUsers = await users.countDocuments();
        const totalPolicies = await policies.countDocuments();
        const totalClaims = await claims.countDocuments();

        // Sending the counts as JSON response
        res.json({
            totalUsers,
            totalPolicies,
            totalClaims
        });
    } catch(error) {
        // Sending an error response if there's an error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//get all the users details
app.get("/admin/get_users", function(req, res) {

    const userId = req.query.userId;

    if(userId){
        users.findOne({userId})
            .then(user => {
                res.json(user);
            })
            .catch(error => {
                res.status(400).json({ error: "Insurance not found" });
            })
    }else{
        users.find({})
        .then(user => {
            res.json(user);
            // Close the connection
        })
        .catch(error => {
            res.json(error);
            // Close the connection
        });
    }

});


//get all the claims details
app.get("/admin/get_claims", function(req, res) {

    const claimId = req.query.claimId;

    if(claimId){
        claims.findOne({claimId})
            .then(claim => {
                res.json(claim);
            })
            .catch(error => {
                res.status(400).json({ error: "claim not found" });
            })
    }else{
        claims.find({})
        .then(claim => {
            res.json(claim);
            // Close the connection
        })
        .catch(error => {
            res.json(error);
            // Close the connection
        });
    }

});


//get all the insurance policies details
app.get("/admin/get_policies", function(req, res) {

    const insuranceId = req.query.insuranceId;

    if(insuranceId){
        policies.findOne({insuranceId})
            .then(insurance => {
                res.json(insurance);
            })
            .catch(error => {
                res.status(400).json({ error: "Insurance not found" });
            })
    }else{
        policies.find({})
        .then(policy => {
            res.json(policy);
            // Close the connection
        })
        .catch(error => {
            res.json(error);
            // Close the connection
        });
    }

});


//get all the pending claims details
app.get("/admin/pending_claims", function(req, res) {
    claims.find({ status: "Pending" })
        .then(pendingClaims => {
            res.json(pendingClaims);
        })
        .catch(error => {
            console.error("Error retrieving pending claims:", error);
            res.status(500).json({ error: "Error retrieving pending claims" });
        });

});

//Admin updating the status of specific claim
app.post("/admin/pending_claims", function(req, res) {
    const {claimId, status} = req.body;

    if(!claimId || !status){
        return res.status(400).json({
            statusCode: 400,
            message : "All fields are mandatory" 
        });
    }

    // Find the claim by claimId
    claims.findOne({ claimId })
        .then(claim => {
            if (!claim) {
                return res.status(404).json({ error: "Claim not found" });
            }else{
                claim.status = status;
                claim.save();   
                if (status === "Approved") {
                    // Find the associated policy
                    return policies.findOne({ insuranceId: claim.insuranceId })
                        .then(policy => {
                            if (!policy) {
                                return res.status(404).json({ error: "Policy not found" });
                            }else{
                                policy.residualAmount -= claim.claimedAmount;
                                policy.save();
                                return res.json("Claim approved");
                            }
    
                        });
                } else {
                    return res.json(`Claim status updated to ${status}`);
                }
            }          
            
        })

});

//add new policy type
app.post("/admin/add_policy", function(req, res){
    const {policyNumber, policyType, coverageAmount, premium} = req.body;
    if(!policyNumber || !policyType || !coverageAmount || !premium){
        return res.status(400).json({
            statusCode: 400,
            message : "All fields are mandatory" 
        });
    }

    availablePolicies.findOne({policyNumber})
        .then( policy =>{
            if(policy){
                return res.status(409).json({
                    statusCode: 409,
                    message : "Policy Number is already in use" 
                })
            }

            const availablePoliciesData = new availablePolicies({
                policyNumber: policyNumber,
                policyType: policyType,
                coverageAmount: coverageAmount,
                premium: premium
            });
            
            availablePoliciesData.save()
                .then(result => res.status(201).send({ msg: "Policy added Successfully"}))
                .catch(error => res.status(500).json({
                        statusCode: 500,
                        message: "Addition of policy failed. Try again later"
                    }))

        })
});


//delete a particular user
app.delete("/admin/delete_user", function(req, res){

    const userId = req.body.userId;

    users.deleteOne({ userId })
        .then(result => {
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json({ message: "User deleted successfully" });
        })
        .catch(error => {
            console.error("Error deleting user:", error);
            res.status(500).json({
                statusCode: 500,
                message: "Deletion failed. Try again later"
            });
        });

});


//get particular user details
app.get("/user/:emailId", function(req, res) {

    const {emailId} = req.params;

    users.findOne({emailId})
        .then(user =>{
            res.json(user);
        })
        .catch(error => {
            res.status(400).json({ error: "Insurance not found" });
        })

});


//get particular user details
app.get("/user/policies/:userId", function(req, res) {

    const {userId} = req.params;

    policies.find({userId})
        .then(policy =>{
            res.json(policy);
        })
        .catch(error => {
            res.status(400).json({ error: "No policies Found" });
        })

});

//get particular user details
app.get("/user/claims/:userId", function(req, res) {

    const {userId} = req.params;

    claims.find({userId})
        .then(claim =>{
            res.json(claim);
        })
        .catch(error => {
            res.status(400).json({ error: "No Claims found" });
        })

});


//show all the available insurance policies
app.get("/home/add_insurance", function(req, res){

    availablePolicies.find({})
        .then(availablePolicies => {
            res.json(availablePolicies);
            // Close the connection
        })
        .catch(error => {
            res.json(error);
            // Close the connection
        });
    
    //res.json(availablePolicies);

});


//add the selected insurance 
app.post("/home/add_insurance", generateUniqueId ,(req, res) => {
     
    const {policyNumber, userId} = req.body;

    if(!policyNumber || !userId){
        return res.status(400).json({
            statusCode: 400,
            message : "All fields are mandatory" 
        });
    }
    availablePolicies.findOne({ policyNumber })
    .then(policy => {
        if (!policy) {
            return res.status(404).json({ 
                statusCode: 404,
                error: "Couldn't Find the Policy" });
        }

        const start = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
        const end = new Date();
        end.setFullYear(end.getFullYear() + 1); // Set end date to one year from now

        const insurancePolicy = new policies({
            insuranceId: req.uniqueId,
            userId: userId,
            policyType: policy.policyType,
            coverageAmount: policy.coverageAmount,
            residualAmount: policy.coverageAmount,
            premium: policy.premium,
            startDate: start,
            endDate: end.toISOString().slice(0, 10) // Convert end date to YYYY-MM-DD format
        });

        insurancePolicy.save()
            .then(result => res.status(201).json({
                status: 200,
                response : insurancePolicy,
                message:"Insurance added"}))
            .catch(error => res.status(500).json({
                statusCode: 500,
                message: "Policy addition failed."
            }));
    })
    .catch(error => res.status(500).json("wrong policy number"));

    });


//post request made when the user click on claim request button
app.post("/home/claim_insurance", generateUniqueId, (req, res) => {
    const {insuranceId, claimedAmount, reason} = req.body;
    if(!insuranceId || !claimedAmount || !reason){
        return res.status(400).json({
            statusCode: 400,
            message : "All fields are mandatory" 
        });
    }

    policies.findOne({insuranceId})
    .then(policyData => {

        if(req.body.claimedAmount <= policyData.residualAmount){
            const claimData = new claims({
                userId: policyData.userId,
                claimId: req.uniqueId,
                insuranceId: insuranceId,
                claimedAmount: claimedAmount,
                reason: reason,
                requestDate: (new Date()).toISOString().slice(0, 10),
                status: "Pending"
            });
            
            claimData.save()
                .then(result => res.status(200).json({
                    status: 200,
                    response : claimData,
                    message:"Claim sent Successfully"}))
                .catch(error => res.status(500).json({
                    status: 500,
                    error: "Claim request failed due to server error."
                }));

            //res.json(claimData);
    
        }else{
            res.json({
                statusCode: 400,
                message: "claimed Amount is more than the residual coverage amount"
            });
        }  

    })
    .catch(error => res.status(500).json("wrong Insurance id"));
     

});

// const options = {
//     definition: {
//         openapi: "3.0.0",
//         info : {
//             title: "Claim management System api docs",
//             version: "0.1"
//         },
//         servers: [
//             {
//                 url: "http://localhost:3000"
//             },
//         ],
//     },
//     apis: ["server.js"]
// };

// const spacs = swaggerjsdoc(options)
// app.use(
//     "/api-docs",
//     swaggerui.serve,
//     swaggerui.setup(spacs)
// )

const port = 3000;
connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`)
        })
    } catch (error) {
        console.log("Cannot connect to the server");
    }
}).catch(error => {
    console.log("Invalid Database Connection");
})
 

