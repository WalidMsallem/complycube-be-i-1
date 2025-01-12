import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import generateTokenHandler from './api/generate-token.js'
import createClientHandler from './api/create-client.js'
import createClientAndReturnSDKTokenHandler from './api/create-client-and-return-sdk-token.js'
import createChecksHandler from './api/create-checks.js'
import getClientCheckListHandler from './api/client-checks-list.js'
import webhookHandler from './api/webhook.js'
import healthHandler from './api/health.js'
import identityCheckHandler from './api/identity-check.js'
import staggeredScreeningHandler from './api/staggered-screening.js'
import documentValidationHandler from './api/document-validation.js'
import ageRestrictionHandler from './api/age-restriction.js'


dotenv.config()

const app = express()
app.use(bodyParser.json())

app.options('*', cors())

// CORS configuration
app.use(
  cors({
    origin: [
      'http://localhost:3000', // Local React app
      'https://complycube-i-1.vercel.app', // Deployed React app on Vercel
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

const PORT = process.env.PORT || 5000

app.post('/api/token', (req, res) => generateTokenHandler(req, res))
app.post('/api/client', (req, res) => createClientHandler(req, res))
app.post('/api/client-token', (req, res) =>
  createClientAndReturnSDKTokenHandler(req, res)
)
// Create multiple checks for a client
app.post('/api/checks', (req, res) => createChecksHandler(req, res))
// Retrieve checks for a client
app.get('/api/checks', (req, res) => getClientCheckListHandler(req, res))

app.post('/api/webhook', (req, res) => webhookHandler(req, res))

app.post('/api/identity-check', async (req, res) => identityCheckHandler(req, res))
app.post('/api/document-validation', async (req, res) => documentValidationHandler(req, res))
app.post('/api/staggered-screening', async (req, res) => staggeredScreeningHandler(req, res))
app.post('/api/age-restriction', async (req, res) => ageRestrictionHandler(req, res))

app.get('/api/health', (req, res) => healthHandler(req, res))

app.listen(PORT, () => {
  console.log(`Server running locally on http://localhost:${PORT}`)
})
