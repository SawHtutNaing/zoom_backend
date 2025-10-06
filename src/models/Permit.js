const mongoose = require("mongoose");
const {Schema,model} =mongoose;

const PermitSchema = new Schema({
    name: {type:String, required:true},
})

const Permit = model("permit", PermitSchema);
module.exports = Permit;
