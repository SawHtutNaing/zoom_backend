const DB = require('../models/Room');
const userDB = require('../models/User')
const permitDB = require('../models/Permit');
const Helper = require('../utils/helper');

const startRoom = async (req, res, next) => {
    const hostId = await DB.findOne({ hostId: req.body.hostId });

    console.log(req.body);

    if (!hostId) {
        req.body.userId = req.user._id;
        req.body.password = Helper.encode(req.body.password);


        console.log(req.body);
        let result = await new DB(req.body).save();
        Helper.fMsg(res, "New Room Create Success!", result);
    } else {
        await DB.findByIdAndUpdate(hostId._id, { status: 'active' })
        // const error = new Error("Host ID is already in use");
        // error.status = 409; // Set the HTTP status code
        // return next(error);
        let result = await DB.findById(hostId._id);
        Helper.fMsg(res, "New Room Create Success!", result);

    }

    // Trim to 10 digits

    // Helper.fMsg(res, 'host id', hostId);



}
const joinRoom = async (req, res, next) => {
    try {
        // Check if the room exists by hostId
        const room = await DB.findOne({ hostId: req.body.hostId });
        if (!room) {
            const error = new Error("The provided Host ID is invalid or not in use.");
            error.status = 404;
            return next(error);
        }

        // Check if user is the host of the room
        if (room.userId.equals(req.user._id)) {
           
            const error = new Error("Host user cannot join their own room.");
            error.status = 401;
            return next(error);
        }

        // Check if user already joined the room
        const isAlreadyParticipant = room.participants.some(part => part.equals(req.user._id));
        if (isAlreadyParticipant) {
            const user = await userDB.findById(req.user._id)
            Helper.fMsg(res,'join user',user);
            // const error = new Error("User is already part of the room.");
            // error.status = 409;
            // return next(error);
        }

        // Validate the room password
        const isPasswordValid = Helper.comparePass(req.body.password, room.password);
        if (!isPasswordValid) {
            const error = new Error("Password is incorrect.");
            error.status = 401;
            return next(error);
        }

        // Add user to participants array
        await DB.findByIdAndUpdate(room._id, { $push: { participants: req.user._id } });

        // Fetch updated room details with populated user and participants
        const updatedRoom = await DB.findById(room._id)
            .populate("userId") // Populate room creator
            .populate("participants"); // Populate all participants

        Helper.fMsg(res, "Room joined successfully!", updatedRoom);
    } catch (err) {
        console.error("Error in joinRoom function:", err.message);
        next(err);
    }
};

const searchRoom = async (req, res, next) => {
    const room = await DB.findOne({ hostId: req.body.hostId });

    // console.log(req)
    if (room) {
        if (room.status === 'active' || room.status === 'pending') {
            Helper.fMsg(res, "Room is running", room)
        } else {
            const error = new Error('This meeting link is invalid');
            error.status = 401;
            return next(error);
        }
    } else {
        const error = new Error('Room not found');
        error.status = 401;
        return next(error);
    }
}

const dropRoomUser = async (req, res, next) => {
    const room = await DB.findById(req.body.roomId);
    if (!room) {
        const error = new Error("Host ID not in use");
        error.status = 404;
        return next(error);
    }
    let joinuser = room.participants.find(part => part.equals(req.body.userId));
    if (joinuser) {

        await DB.findByIdAndUpdate(room._id, { $pull: { participants: req.body.userId } });
        const result = await DB.findById(room._id)
            .populate("userId") // Populate user who created the room
            .populate("participants");
        Helper.fMsg(res, "User delete in room success!", result);

    } else {
        const error = new Error("User is not found joined in their room");
        error.status = 404;
        return next(error);
    }

}




module.exports = {
    startRoom,
    joinRoom,
    dropRoomUser,
    searchRoom
}
