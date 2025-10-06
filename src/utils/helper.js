const bcrypt = require('bcryptjs');
const Redis = require('async-redis').createClient();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const StreamChat = require('stream-chat').StreamChat;
const { connect } = require("getstream");



// Load environment variables
const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

if (!api_key || !api_secret || !app_id) {
    console.error("Missing required environment variables.");
    process.exit(1); // Exit if any key is missing
}
const streamClient = new StreamChat(api_key, api_secret);
        const feedClient = connect(api_key, api_secret, app_id, {
            location: "singapore",
        });
module.exports = {
    encode : payload => bcrypt.hashSync(payload),
    comparePass : (plain,hash)=> bcrypt.compareSync(plain,hash),
    fMsg : (res,msg="",result=[]) => res.status(200).json({con:true,msg,result}),
    set :async (id,value) => await Redis.set(id.toString(),JSON.stringify(value)),
    get: async (id) => JSON.parse(await Redis.get(id.toString())),
    drop: async (id) => await Redis.del(id.toString()),
    // makeToken : (payload)=> jwt.sign(payload, process.env.JWT_SECRET,{expiresIn: '1h' }),
    makeToken : (payload)=> jwt.sign(payload, process.env.JWT_SECRET),
    // makeStreamToken: (payload) => streamClient.createToken(payload),
    makeStreamToken: (payload) => feedClient.createUserToken(payload),
}
