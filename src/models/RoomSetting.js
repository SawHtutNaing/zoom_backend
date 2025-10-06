const mongoose = require("mongoose");
const {Schema,model} = require("mongoose");

const roomSettingSchema = new mongoose.Schema({
    hostId: { type: Number, required: true, unique: true },
    screenSharing: { type: Schema.Types.ObjectId, ref: "user", required: true },
    recording: { type: String, required: true },
    waitingRoom: { type: String, required: false },
    muteUponEntry: [{ type: Schema.Types.ObjectId, ref: "user" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });




  const RoomSetting  = model("roomSetting", roomSettingSchema);
module.exports = RoomSetting;
