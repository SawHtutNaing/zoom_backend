// require('dotenv').config();
// const express = require("express");
// const router = express.Router();
// const { connect } = require("getstream");
//
// // Load environment variables
// const api_key = process.env.STREAM_API_KEY;
// const api_secret = process.env.STREAM_API_SECRET;
// const app_id = process.env.STREAM_APP_ID;
//
// // Validate environment variables
// if (!api_key || !api_secret || !app_id) {
//     console.error("Missing required environment variables.");
//     process.exit(1); // Exit if any key is missing
// }
//
// router.post("/", async (req, res) => {
//     const { userId, name } = req.body;
//
//     // Validate required fields in the request
//     if (!userId || !name) {
//         return res.status(400).json({ error: "UserId and Name are required" });
//     }
//
//     try {
//         // Initialize feedClient with environment variables
//         const feedClient = connect(api_key, api_secret, app_id, {
//             location: "singapore",
//         });
//
//         // Generate a user token
//         const feeToken = feedClient.createUserToken(userId);
//
//         // Send the token in the response
//         res.status(200).json({ success: true, feeToken });
//     } catch (error) {
//         console.error("Error generating token:", error.message);
//         res.status(500).json({ success: false, message: "Server Error" });
//     }
// });
//
// module.exports = router;

require('dotenv').config();
const express = require("express");
const router = express.Router();
const { StreamChat } = require("stream-chat");

// Load environment variables
const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

// Validate environment variables
if (!api_key || !api_secret || !app_id) {
    console.error("Missing required environment variables.");
    process.exit(1); // Exit if any key is missing
}

router.post("/", async (req, res) => {
    const { userId, name } = req.body;

    // Validate required fields in the request
    if (!userId || !name) {
        return res.status(400).json({ error: "UserId and Name are required" });
    }

    try {
        // Initialize StreamChat client
        const streamClient = new StreamChat(api_key, api_secret);

        // Generate a user token
        const token = streamClient.createToken(userId);

        // Send the token in the response
        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error("Error generating token:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
