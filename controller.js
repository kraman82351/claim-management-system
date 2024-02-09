//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid'); // for unique ID generation

const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let availablePolicies = [
    {
        policyNumber: '1',
        policyType: 'accident',
        coverageAmount: '200000',
        residualAmount: '200000',
        premium: '8000'
    },
    {
        policyNumber: '2',
        policyType: 'job',
        coverageAmount: '100000',
        residualAmount: '100000',
        premium: '7000'
    },
    {
        policyNumber: '3',
        policyType: 'travel',
        coverageAmount: '80000',
        residualAmount: '80000',
        premium: '2000'
    },
    {
        policyNumber: '4',
        policyType: 'fire',
        coverageAmount: '120000',
        residualAmount: '120000',
        premium: '6000'
    }
];

let allPolicies = [{
    insuranceId: "21802de5-b1f4-4760-9e22-6b07abc66c56",
    userId: "d589c905-2eb3-4a7c-91a5-e31b9c85838b",
    policyType: "travel",
    coverageAmount: 80000,
    residualAmount: 80000,
    premium: 2000,
    startDate: "2024-02-08",
    endDate: "2025-02-08"
},{
    insuranceId: "dc554731-395b-48a5-9ae2-554df71e75d1",
    userId: "d589c905-2eb3-4a7c-91a5-e31b9c85838b",
    policyType: "accident",
    coverageAmount: 200000,
    residualAmount: 200000,
    premium: 8000,
    startDate: "2024-02-08",
    endDate: "2025-02-08"
},{
    insuranceId: "0ec2dd62-6e08-4e31-873b-c200bbb6f69c",
    userId: "d589c905-2eb3-4a7c-91a5-e31b9c85838b",
    policyType: "fire",
    coverageAmount: 120000,
    residualAmount: 120000,
    premium: 6000,
    startDate: "2024-02-08",
    endDate: "2025-02-08"
}];

let allUsers = [{
    userId: '9837e246-d2c6-444f-a34c-75342e61f14a',
    name: 'aman',
    address: 'abx j axj',
    emailId: 'jbakjx',
    password: 'baknj j',
    policies: [],
    claims: []
  },
  {
    userId: '4b5efae8-d7ca-46a0-8056-600726ba6bf5',
    name: 'Aryan',
    address: 'Delhi',
    emailId: 'kajag@gma',
    password: 'baknj j',
    policies: [],
    claims: []
  },
  {
    userId: 'f0719bda-033f-4c5b-88e6-8e102cf770f3',
    name: 'karan',
    address: 'Jamshedpur',
    emailId: 'kajag@gma',
    password: 'baknj j',
    policies: [],
    claims: []
  },
  {
    userId: 'edfafd86-80c4-4935-bfff-e5c6c923bb8c',
    name: 'umang',
    address: 'kolkata',
    emailId: 'kajag@gma',
    password: 'baknj j',
    policies: [],
    claims: []
  }
];

let allClaims = [{
    claimId: '4ca4853d-cfc0-4487-a264-8ad1d76ed8c8',
    insuranceId: 'vbljanvljknv',
    claimedAmount: 35000,
    reason: 'accident',
    requestDate: '12/12/12',
    status: 'Pending'
  },
  {
    claimId: 'f84f4dc9-5966-472e-bdf1-5ac64b17d244',
    insuranceId: 'cabjkbapicajb',
    claimedAmount: 55000,
    reason: 'cancer',
    requestDate: '10/11/24',
    status: 'Pending'
  },
  {
    claimId: '381e5614-4fcf-4598-86d5-b7d2a5a0e5ed',
    insuranceId: 'cabbbsjjjsn',
    claimedAmount: 155000,
    reason: 'cancer',
    requestDate: '23/08/21',
    status: 'Sucess'
  }
];

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
    
    res.json(allUsers);

});


//get all the claims details
app.get("/admin/get_claims", function(req, res) {
    
    res.json(allClaims);

});


//get all the insurance policies details
app.get("/admin/get_policies", function(req, res) {

    res.json(allPolicies);

});


//get all the pending claims details
app.get("/admin/pending_claims", function(req, res) {
    var pendingClaims = [];
    allClaims.forEach(claim => {
        if(claim.status == "Pending"){
            pendingClaims.push(claim);
        }
    });
    res.json(pendingClaims);

});

//Admin updating the status of specific claim
app.post("/admin/pending_claims", function(req, res) {
    const claimId = req.body.claimId;
    const status = req.body.status;
    var flag = 1;
    allClaims.forEach(claim => {
        if(claimId == claim.claimId){
            flag = 0;
            claim.status = status;
            if(claim.status == "Approved"){
                allPolicies.forEach(policy => {
                    if(policy.insuranceId == claim.insuranceId){
                        policy.residualAmount = policy.residualAmount - claim.claimedAmount;
                        return;
                    }
                });
                res.json("Claim approved");
                return;
            }
            res.json(`claimed insurance status is marked as ${status}`);
        }
        return;
    });

    if(flag){
        res.json("Wrong claimID");
    }

});



//register user 
app.post("/register", generateUniqueId, (req, res) =>{
    const userData = {
      userId: req.uniqueId,
      name: req.body.name,
      address: req.body.address,
      emailId: req.body.emailId,
      password: req.body.password,
      policies: [],
      claims: []
    };
  
    allUsers.push(userData);

    res.json("user has sucessfully registered");
  
});


//show all the available insurance policies
app.get("/home/add_insurance", function(req, res){
    
    res.json(availablePolicies);

});


//add the selected insurance 
app.post("/home/add_insurance", generateUniqueId ,(req, res) => {
    const policyNumber = req.body.policyNumber;
    const userId = req.body.userId;    
    var flag = 1;

    availablePolicies.forEach(policy =>{
        if(policy.policyNumber == policyNumber){
            flag = 0;
            const start= (new Date()).toISOString().slice(0, 10);
            var end = new Date();
            end.setFullYear(end.getFullYear() + 1);
            end = end.toISOString().slice(0, 10);

            const insurancePolicy = {
                insuranceId: req.uniqueId,
                userId: userId,
                policyType: policy.policyType,
                coverageAmount: policy.coverageAmount,
                residualAmount: policy.residualAmount,
                premium: policy.premium,
                startDate: start,
                endDate: end
            };

            allPolicies.push(insurancePolicy);
            res.json(insurancePolicy);
            
            return;
        }
    });

    if(flag){
        res.json("wrong policy number");
    }
    
});

//post request made when the user click on claim request button
app.post("/home/claim_insurance", generateUniqueId, (req, res) => {
    var policyData;
    let flag = 1;
    allPolicies.forEach(policy =>{
        if(policy.insuranceId == req.body.insuranceId){
            flag = 0;
            policyData = policy;
            return;
        }
    });

    if(flag){
        res.json("NOT a valid insurance ID");
    }
    
    if(req.body.claimedAmount <= policyData.residualAmount){

        const claimData = {
            claimId: req.uniqueId,
            insuranceId: req.body.insuranceId,
            claimedAmount: req.body.claimedAmount,
            reason: req.body.reason,
            requestDate: (new Date()).toISOString().slice(0, 10),
            status: "Pending"
        };
        
        allClaims.push(claimData);
        res.json(claimData);

    }else{
        res.json("claimed Amount is more than the residual coverage amount");
    }        

});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
