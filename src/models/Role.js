const mongoose = require("mongoose");
const  {Schema,model}  =mongoose;

const roleSchema = new Schema({
    name: {type: String, required: true},
    permit: [{ type: Schema.Types.ObjectId, ref: "permit" }],
})

const Role = model("role", roleSchema);
module.exports = Role;
