const mongoose = require("mongoose");
const {Schema,model} = require("mongoose");

const roomSchema = new mongoose.Schema({
    hostId: { type: Number, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    topic: { type: String, required: true },
    password: { type: String, required: false },
    participants: [{ type: Schema.Types.ObjectId, ref: "user" }],
    status: { type: String, enum: ["active",'pending', "inactive"], default: "active" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });




  const Room  = model("room", roomSchema);
module.exports = Room;
