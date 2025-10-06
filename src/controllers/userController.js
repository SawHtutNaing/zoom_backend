const DB = require("../models/User");
const Helper = require('../utils/helper');
const Gallery = require('../utils/gallery');
const { StreamChat } = require("stream-chat");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

// Initialize StreamChat client
const streamClient = new StreamChat(api_key, api_secret);


// Helper Function to Generate Unique Meeting ID
function generateUniqueMeetingID(id) {
    const userId = id.toString();
    const timestamp = Date.now().toString();
    
    const hash = crypto.createHash('md5').update(userId + timestamp).digest('hex');
    const numericID = BigInt('0x' + hash).toString(); // Convert hex to decimal
    return numericID.slice(0, 10); // Return first 11 digits
}

const getUser = async (req,res,next) =>{
    // let token = req.body.token;
    // console.log(req)

    // const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode
    // console.log("Verified and Decoded Payload:", decoded);
    Helper.fMsg(res,"User info Success!",req.user);

    // return decoded;


}

const register = async (req, res, next) => {
    try {
        // Check for duplicate email or phone
        let dbEmailUser = await DB.findOne({ email: req.body.email });
        if (dbEmailUser) {
            const error = new Error('Email already exists');
            error.status = 409;
            return next(error);
        }

        let dbPhoneUser = await DB.findOne({ phone: req.body.phone });
        if (dbPhoneUser) {
            const error = new Error('Phone already exists');
            error.status = 409;
            return next(error);
        }

        // Hash the password
        req.body.password = Helper.encode(req.body.password);

        // Save the new user
        let newUser = await new DB(req.body).save();

        // Generate and assign a unique meeting ID
        let uniqueID;
        let isUnique = false;

        while (!isUnique) {
            uniqueID = generateUniqueMeetingID(newUser._id);
            let count = await DB.countDocuments({ permanentMeetingId: uniqueID });
            if (count === 0) {
                isUnique = true;
            }
        }

        // Assign the unique ID to the user and save
        newUser.permanentMeetingId = uniqueID;
        await newUser.save();
        // console.log(newUser)
        // Respond with success
        Helper.fMsg(res, "Register successfully", newUser);
    } catch (error) {
        next(error);
    }
};


const login = async (req, res, next) => {
    let dbUser = await DB.findOne({ phone: req.body.phone }).populate("roles permits").select('-__v');

    if (dbUser) {
        if (Helper.comparePass(req.body.password, dbUser.password)) {
            let user = dbUser.toObject();
            delete user.password;

            // Fixing Stream token generation
            // try {
            //     let streamToken = Helper.makeStreamToken(user._id.toString());
            //     user.streamToken = streamToken;
            //     // console.log('Stream token created:', streamToken);
            // } catch (error) {
            //     console.log('Error creating Stream token:', error.message);
            //     return next(new Error("Stream token creation failed"));
            // }


            // Fixing JWT token creation
            try {
                user.token = Helper.makeToken(user); // Ensure this is an object payload
            } catch (error) {
                return next(new Error("JWT token creation failed"));
            }

            // const streamUser = {
            //     id: user._id.toString(), // User ID (unique identifier for user)
            //     name: user.name, // User's name
            // };

            // const createdUser = await streamClient.upsertUser(streamUser);


            


        //    -------------------
        // const jwtToken = Helper.makeToken(user); // Create JWT token

        //     // // Set the cookie
        //     res.cookie("authToken", jwtToken, {
        //         httpOnly: true,       // Prevent JavaScript access
        //         secure: false,         // Use HTTPS (only for production)
        //         // sameSite: "strict",   // Prevent CSRF attacks
        //         sameSite: "lax", // For local development

        //         maxAge: 60 * 60 * 1000, // 1-hour expiry (milliseconds)
        //     });
            // ----------------

                    // Store user data in Redis or respond with user data
            await Helper.set(user._id.toString(), user);
            // console.log(res);
            Helper.fMsg(res, "Login success!", user);
        } else {
            next(new Error(`Password is not match`));
        }
    } else {
        next(new Error(`Credential Error`));
    }
};

const logout = async (req,res,next)=>{
    let dbUser = await DB.findOne({ _id: req.body.id });

    if(!dbUser){
            next(new Error(`User Not Found!`));
            return;
    }

    Helper.drop(dbUser._id);
    Helper.fMsg(res,"Logout success!",dbUser);


}



const addRole = async (req,res,next)=>{
    let dbUser = await DB.findById(req.body.userId);
    let dbRole = await roleDB.findById(req.body.roleId);

    let foundRole = dbUser.roles.find(rid=> rid.equals(dbRole._id));
    if(foundRole){
        next(new Error("Role already exist"));

    }else{
        await DB.findByIdAndUpdate(dbUser.id,{$push:{roles:dbRole._id}});

        let user = await DB.findById(dbUser._id);
        Helper.fMsg(res,"Added role to user",user);
    }

}


const removeRole = async (req,res,next)=>{
    let dbUser = await DB.findById(req.body.userId);

    // console.log(dbUser)
    let foundRole = dbUser.roles.find(rid=> rid.equals(req.body.roleId));
    if(foundRole){
        await DB.findByIdAndUpdate(dbUser.id,{ $pull : {roles : req.body.roleId }});
        let user = await DB.findById(dbUser._id).populate('roles');

        Helper.fMsg(res,"Remove Role",user);

    }else{
        next(new Error("Role doesn't exist"));

    }

}



const addPermit = async (req,res,next)=>{
    let dbUser = await DB.findById(req.body.userId);
    let dbPermit = await permitDB.findById(req.body.permitId);

    let foundPermit = dbUser.permits.find(rid=> rid.equals(dbPermit._id));
    if(foundPermit){
        next(new Error("Permit already exist"));

    }else{
        await DB.findByIdAndUpdate(dbUser._id,{$push:{permits:dbPermit._id}});

        let user = await DB.findById(dbUser._id);
        Helper.fMsg(res,"Added permit to user",user);
    }

}


const removePermit = async (req,res,next)=>{
    let dbUser = await DB.findById(req.body.userId);

    // console.log(dbUser)
    let foundPermit = dbUser.permits.find(rid=> rid.equals(req.body.permitId));
    if(foundPermit){
        await DB.findByIdAndUpdate(dbUser.id,{ $pull : {permits : req.body.permitId }});
        let user = await DB.findById(dbUser._id).populate('permits');

        Helper.fMsg(res,"Remove Permit",user);

    }else{
        next(new Error("Permit doesn't exist"));

    }

}

const profileUpdate = async (req,res,next)=>{
    // console.log(req);
    const userDB = await DB.findById(req.user._id);

    if(userDB){
        await DB.findByIdAndUpdate(userDB._id,{profileImg: req.body.image});
        Helper.fMsg(res,"Update success!",req.body);

    }else{
        
        return next(new Error('image error'))
    }
}



module.exports = {
    register,
    login,
    logout,
    getUser,
    addRole,
    removeRole,
    addPermit,
    removePermit,
    profileUpdate
}
