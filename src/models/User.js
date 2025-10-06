const mongoose = require("mongoose");
const {Schema,model} = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  profileImg: { type: String },
  password: { type: String, required: true },
  roles : [{type:Schema.Types.ObjectId, ref:"role"}],
  permits : [{type:Schema.Types.ObjectId, ref:"permit"}],
  permanentMeetingId: { type: String, unique: true }, // Permanent Meeting ID
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }}
);



  const User  = model("user", userSchema);
module.exports = User;
