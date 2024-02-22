
const swaggerjsdoc = require("swagger-jsdoc")

const registerRoute = {
    "/register": {
      post: {
        summary: "Register a new user",
        description: "Register a new user with full name, address, email, and password.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  fullName: { type: "string" },
                  address: { type: "string" },
                  emailId: { type: "string" },
                  password: { type: "string" },
                },
                required: ["fullName", "address", "emailId", "password"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
          },
          400: {
            description: "Bad request or missing fields",
          },
          409: {
            description: "Email already in use or invalid data",
          },
          500: {
            description: "Server error",
          },
        },
      },
    },
  };
  

  const userLoginRoute = {

    "/userlogin": {
      post: {
        summary: "User Login",
        description: "Authenticate a user with email and password.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  emailId: { type: "string" },
                  password: { type: "string" },
                },
                required: ["emailId", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login Successful",
          },
          400: {
            description: "Bad request or missing fields",
          },
          401: {
            description: "Unauthorized - Invalid credentials",
          },
          500: {
            description: "Server Error",
          },
        },
      },
    },
  };
  
  const adminLoginRoute = {
    "/adminlogin": {
      post: {
        summary: "Admin Login",
        description: "Authenticate an admin with email and password.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  emailId: { type: "string" },
                  password: { type: "string" },
                },
                required: ["emailId", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Admin logged In",
          },
          400: {
            description: "Bad request or missing fields",
          },
          401: {
            description: "Unauthorized - Invalid credentials",
          },
          500: {
            description: "Server Error",
          },
        },
      },
    },
  };

  const adminRoutes = {
    "/admin/get_claims": {
      get: {
        summary: "Get all claim details",
        parameters: [
          {
            in: "query",
            name: "claimId",
            schema: {
              type: "string"
            },
            description: "ID of the claim to retrieve"
          }
        ],
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                    type: "object",
            properties: {
              claimId: { type: "string" },
              userId: { type: "string" },
              description: { type: "string" },
              amount: { type: "number" },
              status: { type: "string", enum: ["pending", "approved", "rejected"] }
            },
            required: ["claimId", "userId", "description", "amount", "status"]
                  },
              }
            }
          },
          400: {
            description: "Claim not found"
          },
          500: {
            description: "Server Error"
          }
        }
      }
    },
    "/admin/get_policies": {
      get: {
        summary: "Get all policy details",
        parameters: [
          {
            in: "query",
            name: "insuranceId",
            schema: {
              type: "string"
            },
            description: "ID of the policy to retrieve"
          }
        ],
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Policy"
                  }
                }
              }
            }
          },
          400: {
            description: "Policy not found"
          },
          500: {
            description: "Server Error"
          }
        }
      }
    },
    "/admin/pending_claims": {
        post: {
          summary: "Update status of a specific claim",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    claimId: { type: "string" },
                    status: { type: "string" }
                  },
                  required: ["claimId", "status"]
                }
              }
            }
          },
          responses: {
            200: {
              description: "Claim status updated successfully"
            },
            400: {
              description: "Bad request or missing fields"
            },
            404: {
              description: "Claim or policy not found"
            },
            500: {
              description: "Server Error"
            }
          }
        }
      },
      "/admin/add_policy": {
        post: {
          summary: "Add a new policy type",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    policyNumber: { type: "string" },
                    policyType: { type: "string" },
                    coverageAmount: { type: "number" },
                    premium: { type: "number" }
                  },
                  required: ["policyNumber", "policyType", "coverageAmount", "premium"]
                }
              }
            }
          },
          responses: {
            201: {
              description: "Policy added successfully"
            },
            400: {
              description: "Bad request or missing fields"
            },
            409: {
              description: "Policy Number is already in use"
            },
            500: {
              description: "Server Error"
            }
          }
        }
      },
      "/admin/delete_user": {
        delete: {
          summary: "Delete a particular user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    userId: { type: "string" }
                  },
                  required: ["userId"]
                }
              }
            }
          },
          responses: {
            200: {
              description: "User deleted successfully"
            },
            404: {
              description: "User not found"
            },
            500: {
              description: "Server Error"
            }
          }
        }
      }
    };

    const userRoutes = {
        "/user/{emailId}": {
          get: {
            summary: "Get particular user details",
            parameters: [
              {
                in: "path",
                name: "emailId",
                schema: {
                  type: "string"
                },
                required: true,
                description: "Email ID of the user to retrieve"
              }
            ],
            responses: {
              200: {
                description: "Success",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/User"
                    }
                  }
                }
              },
              400: {
                description: "Insurance not found"
              }
            }
          }
        },
        "/user/policies/{userId}": {
          get: {
            summary: "Get particular user's policies",
            parameters: [
              {
                in: "path",
                name: "userId",
                schema: {
                  type: "string"
                },
                required: true,
                description: "User ID of the user whose policies to retrieve"
              }
            ],
            responses: {
              200: {
                description: "Success",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Policy"
                      }
                    }
                  }
                }
              },
              400: {
                description: "No policies found"
              }
            }
          }
        },
        "/user/claims/{userId}": {
          get: {
            summary: "Get particular user's claims",
            parameters: [
              {
                in: "path",
                name: "userId",
                schema: {
                  type: "string"
                },
                required: true,
                description: "User ID of the user whose claims to retrieve"
              }
            ],
            responses: {
              200: {
                description: "Success",
                content: {
                  "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                          claimId: { type: "string" },
                          userId: { type: "string" },
                          description: { type: "string" },
                          amount: { type: "number" },
                          status: { type: "string", enum: ["pending", "approved", "rejected"] }
                        },
                        required: ["claimId", "userId", "description", "amount", "status"]
                    }
                  }
                }
              },
              400: {
                description: "No claims found"
              }
            }
          }
        },
        "/home/add_insurance": {
          get: {
            summary: "Show all available insurance policies",
            requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        userId: { type: "string" }
                      },
                      required: ["userId"]
                    }
                  }
                }
              },
            
            responses: {
              200: {
                description: "Success",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Policy"
                      }
                    }
                  }
                }
              }
            }
          },
          post: {
            summary: "Add selected insurance",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                          policyNumber: { type: "number" },
                          userId : {type: "string"}
                        },
                        required: ["policyNumber", "userId"]
                      }
                }
              }
            },
            responses: {
              201: {
                description: "Insurance added successfully"
              },
              400: {
                description: "Bad request or missing fields"
              },
              404: {
                description: "Policy not found"
              },
              500: {
                description: "Server Error"
              }
            }
          }
        },
        "/home/claim_insurance": {
            post: {
              summary: "Claim the insurance",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        insuranceId: {type : "string"},
                        userId :{type : "string"},
                        claimedAmount: {type : "number"},
                        reason: {type : "string"},

                      },
                      required: ["userId"]
                    }
                  }
                }
              },
              responses: {
                200: {
                  description: "User deleted successfully"
                },
                404: {
                  description: "User not found"
                },
                500: {
                  description: "Server Error"
                }
              }
            }
          }
        };
    
      
      

  
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Claim management System API Docs",
        version: "0.1",
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
      paths: {
        
        ...registerRoute,
        ...userLoginRoute,
        ...adminLoginRoute,
        ...adminRoutes,
        ...userRoutes
      }
    },
    apis: [], // Leave this empty as we're not directly referencing any specific file
    components: {
        schemas: {
          User: {
            type: "object",
            properties: {
              userId: { type: "string" },
              fullName: { type: "string" },
              email: { type: "string", format: "email" },
              address: { type: "string" },
              password: { type: "string", format: "password" }
            },
            required: ["userId", "fullName", "email", "address", "password"]
          },
          Claim: {
            type: "object",
            properties: {
              claimId: { type: "string" },
              userId: { type: "string" },
              description: { type: "string" },
              amount: { type: "number" },
              status: { type: "string", enum: ["pending", "approved", "rejected"] }
            },
            required: ["claimId", "userId", "description", "amount", "status"]
          },
          Policy: {
            type: "object",
            properties: {
              policyId: { type: "string" },
              userId: { type: "string" },
              type: { type: "string" },
              startDate: { type: "string", format: "date" },
              endDate: { type: "string", format: "date" },
              premium: { type: "number" }
            },
            required: ["policyId", "userId", "type", "startDate", "endDate", "premium"]
          }
        }
      }
  };
  
  const specs = swaggerjsdoc(options);
  module.exports = specs;