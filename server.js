//jshint esversion:6
require("dotenv").config();
const mongoose = require('mongoose');
const express = require("express");
const data = require('./database/SampleData.js')
const bodyParser = require("body-parser");
const connect = require('./database/conn.js');

const { v4: uuidv4 } = require('uuid'); // for unique ID generation

const app = express();
connect();
app.use(express.json());

const users = require('./model/userModel.js');
const availablePolicies = require('./model/availablePolicy.js');
const claims = require('./model/claimModel.js');
const policies = require('./model/policyModel.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



//generate unique id
function generateUniqueId(req, res, next) {
    req.uniqueId = uuidv4(); // Generating a unique ID using uuidv4 and attaching it to the request object
    next(); 
}

//root route the login page
app.get("/", function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//Customer home page
app.get("/home", function(req, res){
    res.sendFile(__dirname + '/home.html');
});

//Admin home page
app.get("/admin", function(req, res){
    res.sendFile(__dirname + '/admin_home.html');
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
            mongoose.connection.close();
        })
        .catch(error => {
            res.json(error);
            // Close the connection
            mongoose.connection.close();
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
            mongoose.connection.close();
        })
        .catch(error => {
            res.json(error);
            // Close the connection
            mongoose.connection.close();
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
            mongoose.connection.close();
        })
        .catch(error => {
            res.json(error);
            // Close the connection
            mongoose.connection.close();
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
            res.status(500).json({ error: "Internal server error" });
        });

});

//Admin updating the status of specific claim
app.post("/admin/pending_claims", function(req, res) {
    const claimId = req.body.claimId;
    const status = req.body.status;

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
    const availablePoliciesData = new availablePolicies({
        policyNumber: policyNumber,
        policyType: policyType,
        coverageAmount: coverageAmount,
        premium: premium
    });
    
    availablePoliciesData.save()
        .then(result => res.status(201).send({ msg: "Policy added Successfully"}))
        .catch(error => res.status(500).send({error}))
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
            res.status(500).json({ error: "Internal server error" });
        });

});

//register user 
app.post("/register", generateUniqueId, (req, res) =>{
    const userData = new users({
      userId: req.uniqueId,
      fullName: req.body.name,
      address: req.body.address,
      emailId: req.body.emailId,
      password: req.body.password,
      policies: [],
      claims: []
    });
  
    userData.save()
        .then(result => res.status(201).json("User Register Successfully"))
        .catch(error => res.status(500).json(error))


    //res.json("user has sucessfully registered");
  
});


//show all the available insurance policies
app.get("/home/add_insurance", function(req, res){

    availablePolicies.find({})
        .then(availablePolicies => {
            res.json(availablePolicies);
            // Close the connection
            mongoose.connection.close();
        })
        .catch(error => {
            res.json(error);
            // Close the connection
            mongoose.connection.close();
        });
    
    //res.json(availablePolicies);

});


//add the selected insurance 
app.post("/home/add_insurance", generateUniqueId ,(req, res) => {
    const policyNumber = req.body.policyNumber;
    const userId = req.body.userId;    

    availablePolicies.findOne({ policyNumber })
    .then(policy => {
        if (!policy) {
            return res.status(404).json({ error: "Couldn't Find the Policy" });
        }

        const start = new Date().toISOString().slice(0, 10);
        const end = new Date();
        end.setFullYear(end.getFullYear() + 1);

        const insurancePolicy = new policies({
            insuranceId: req.uniqueId,
            userId: userId,
            policyType: policy.policyType,
            coverageAmount: policy.coverageAmount,
            residualAmount: policy.coverageAmount,
            premium: policy.premium,
            startDate: start,
            endDate: end.toISOString().slice(0, 10)
        });

        insurancePolicy.save()
            .then(result => res.status(201).json("Policy added successfully"))
            .catch(error => res.status(500).json(error));
    })
    .catch(error => res.status(500).json("wrong policy number"));

    });


//post request made when the user click on claim request button
app.post("/home/claim_insurance", generateUniqueId, (req, res) => {
    const insuranceId = req.body.insuranceId;
    policies.findOne({insuranceId})
    .then(policyData => {

        if(req.body.claimedAmount <= policyData.residualAmount){

            const claimData = new claims({
                claimId: req.uniqueId,
                insuranceId: req.body.insuranceId,
                claimedAmount: req.body.claimedAmount,
                reason: req.body.reason,
                requestDate: (new Date()).toISOString().slice(0, 10),
                status: "Pending"
            });
            
            claimData.save()
                .then(result => res.status(201).json("Policy added successfully"))
                .catch(error => res.status(500).json(error));

            //res.json(claimData);
    
        }else{
            res.json("claimed Amount is more than the residual coverage amount");
        }  

    })
    .catch(error => res.status(500).json("wrong Insurance id"));
     

});


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
 