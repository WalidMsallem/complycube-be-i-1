const { EventVerifier } = require("@complycube/api");

// Webhook secret from environment variables
const webhookSecret = process.env.COMPLYCUBE_WEBHOOK_SECRET;
const eventVerifier = new EventVerifier(webhookSecret);

export default async function handler(req, res) {
    const signature = req.headers["complycube-signature"];

    let event;
    try {
      // Verify and construct the event
      event = eventVerifier.constructEvent(JSON.stringify(req.body), signature);
    } catch (err) {
      console.error("Webhook verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    console.log("Webhook received:", event);
  
    // Process event types
    try {
      switch (event.type) {
        case "check.completed": {
          const checkId = event.payload.id;
          const outcome = event.payload.result?.outcome || "unknown";
          console.log(`Check ${checkId} completed with outcome: ${outcome}`);
          // TODO: we can add some business logic here example send email to CS team
          break;
        }
        case "check.pending": {
          const checkId = event.payload.id;
          console.log(`Check ${checkId} is pending`);
          // TODO: same here we can business logic here example send email to CS team
          break;
        }
        // Handle other event types as needed
        default: {
          console.warn(`Unhandled event type: ${event.type}`);
        }
      }
  
      // Respond with success
      res.json({ received: true });
    } catch (error) {
      console.error("Error processing event:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }