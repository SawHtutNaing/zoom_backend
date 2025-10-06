const DB = require('../models/Permit');
const Helper = require('../utils/helper');

const all = async (req,res,next)=>{
    const result = await DB.find().select('-__v');
    Helper.fMsg(res,'All Permission',result);
}

const add = async (req, res,next) => {
    const result = await DB.findOne({name:req.body.name}).select('-__v');

    if(result){
        next(new Error("Permission Name is already in use"));
    }else{
        let result = await new DB(req.body).save();

        Helper.fMsg(res,"Permission Saved!",result);
    }
}

const get = async (req,res,next)=>{
    const result = await DB.findById(req.params.id);
    if(result){
        Helper.fMsg(res,'Single Permission',result);
    }else {
        next(new Error("NO Permission with that id"));
    }
}

const patch = async (req,res,next)=>{
    const dbPermit = await DB.findById(req.params.id);
    if(dbPermit){
        await DB.findByIdAndUpdate(dbPermit._id,req.body);
        let result = await DB.findById(dbPermit._id).select('-__v');
        Helper.fMsg(res,`Permission Updated successfully`,result);

    }else {
        next(new Error("NO Permission with that id"));
    }
}

const drop = async (req,res,next)=>{
    let dbPermit = await DB.findById(req.params.id);
    if(dbPermit){
        await DB.findByIdAndDelete(dbPermit._id);
        Helper.fMsg(res,`Permission Deleted successfully`);

    }else {
        next(new Error("NO Permission with that id"));
    }
}

module.exports = {
    all,
    add,
    get,
    patch,
    drop
}
