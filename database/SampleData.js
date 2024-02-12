
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
    insuranceId: '21802de5-b1f4-4760-9e22-6b07abc66c56',
    claimedAmount: 35000,
    reason: 'accident',
    requestDate: '12/12/12',
    status: 'Pending'
  },
  {
    claimId: 'f84f4dc9-5966-472e-bdf1-5ac64b17d244',
    insuranceId: '21802de5-b1f4-4760-9e22-6b07abc66c56',
    claimedAmount: 55000,
    reason: 'cancer',
    requestDate: '10/11/24',
    status: 'Pending'
  },
  {
    claimId: '381e5614-4fcf-4598-86d5-b7d2a5a0e5ed',
    insuranceId: '0ec2dd62-6e08-4e31-873b-c200bbb6f69c',
    claimedAmount: 155000,
    reason: 'cancer',
    requestDate: '23/08/21',
    status: 'Sucess'
  }
];

module.exports = {
    allUsers: allUsers,
    availablePolicies: availablePolicies,
    allClaims: allClaims,
    allPolicies: allPolicies
};