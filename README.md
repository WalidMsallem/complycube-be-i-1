# ComplyCube Backend Demonstration

This is a backend project to demonstrate how to use the ComplyCube API for compliance workflows. It handles generating tokens for the ComplyCube Web SDK, running checks, and listing check results. This backend is designed to complement the frontend demonstration available here ( https://github.com/WalidMsallem/complycube-i-1 )


## Features

1- Generate Client Tokens
- Accepts user data (email, first name, last name) and creates a client in ComplyCube.
- Generates a token to initialize the ComplyCube Web SDK modal.


2- Run Verification Checks
- Processes predefined checks based on the data captured from the Web SDK modal.
- Examples of checks:
   Proof of Address Check: For verifying address-related documents.
   Document Check: For validating document authenticity.
   Extensive Screening Check: For detailed compliance checks.

These checks are triggered based on the captured data. However, ComplyCube supports many more check types. For a full list of available checks, please refer to the ComplyCube documentation.


3- List Check Results
- Fetches and lists all checks run for a specific client, including details like:
- Check type.
 Status (e.g., pending, complete).
 Outcome (e.g., clear, failed).

These checks are triggered based on the captured data. However, ComplyCube supports many more check types. For a full list of available checks, please refer to the ComplyCube documentation.

4- Handle Webhooks
- Listens for events like check.completed or check.pending from ComplyCube.
- Verifies webhook signatures to ensure security.

## How to Use

 ##### 1- Lunch
- Clone the repository and Install dependencies using: npm install

- Set up the required environment variables in a .env file : COMPLYCUBE_API_KEY=your_complycube_api_key ( Get this from your ComplyCube Sandbox account. )
COMPLYCUBE_WEBHOOK_SECRET=your_webhook_secret ( Configure this in your ComplyCube account to verify webhooks. )
 
- Start the application:  npm start npm start


# 2- Hosted Examples
Backend: https://complycube-be-i-1.onrender.com

Note: The hosted backend runs on a free instance that may spin down due to inactivity. This can cause delays of up to 50 seconds or more when restarting. For faster responses, use a locally hosted backend.

Frontend: https://complycube-i-1.vercel.app/

# 2- Endpoints

1- Generate Client Token:
- POST :  /api/client-token
- Request : 
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com"
}
```
- Response : 
```json
{
  "token": "generated_token",
  "clientId": "client_id"
}
```

2- Run/Create Checks

- POST : /api/checks
- Request : 
```json
{
  "clientId": "client_id",
  "checks": [
    { "type": "proof_of_address_check", "documentId": "doc_id" },
    { "type": "document_check", "documentId": "doc_id" }
  ]
}
```
- Response : 
```json
{
  "results": [
    { "id": "check_id_1", "status": "pending" },
    { "id": "check_id_2", "status": "complete" }
  ]
}
```

3- List Checks for a client
- GET : /api/checks
- Request's Query : 
```json
{
  "clientId": "client_id",
  "page": 1,
  "pageSize": 10
}
```
- Response's Query : 
```json
{
  "page": 1,
  "pageSize": 10,
  "totalItems": 25,
  "pages": 3,
  "checks": [
    {
            "success": true,
        "data": {
            "id": "check_id_1",
            "entityName": "the company",
            "type": "document_check",
            "clientConsent": false,
            "clientId": "client_id",
            "documentId": "document_od",
            "status": "pending",
            "updatedAt": "2025-01-11T10:03:13.148Z",
            "createdAt": "2025-01-11T10:03:13.148Z"
        }
    },
    {
      "success": true,
        "data": {
            "id": "check_id_2",
            "entityName": "the company",
            "type": "document_check",
            "clientConsent": false,
            "clientId": "client_id",
            "documentId": "document_od",
            "status": "pending",
            "updatedAt": "2025-01-11T10:03:13.148Z",
            "createdAt": "2025-01-11T10:03:13.148Z"
        }
    }
  ]
}
```
4- Webhook
- POST api/webhook
- Handles events like:
 check.completed
 check.pending
  Verifies webhook signatures using the COMPLYCUBE_WEBHOOK_SECRET.