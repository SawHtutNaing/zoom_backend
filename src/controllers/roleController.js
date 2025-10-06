const DB = require('../models/Role');
const permitDB = require('../models/Permit');
const Helper = require('../utils/helper');

const all = async (req, res, next) => {
    try {
        let dbRole = await DB.find().populate('permit','-__v');
        if (dbRole) {
            Helper.fMsg(res, "All Roles", dbRole);
        } else {
            next(new Error('Not Found'));
        }
    } catch (err) {
        next(err);
    }
}


const get = async (req, res,next) => {
    let dbRole = await DB.findById(req.params.id).select('-__v');
    if(dbRole){
        Helper.fMsg(res,"Single Roles",dbRole);

    }else {
        next(new Error('No Role with that id'));
    }
}
const add = async (req, res,next) => {
    let dbRole = await DB.findOne({name:req.body.name}).select('-__v');

    if(dbRole){
        next(new Error('Role name is already in use'));
    }else {
        let result = await new DB(req.body).save();
        Helper.fMsg(res,"New Role added",result);
    }
}
const patch = async (req, res,next) => {
    let dbRole = await DB.findById(req.params.id);
    if(dbRole){
        await DB.findByIdAndUpdate(dbRole._id,req.body);
        let result = await DB.findById(dbRole._id).select('-__v');
        Helper.fMsg(res,"Role updated",result);

    }else {
        next(new Error('No Role with that id'));
    }
}

const drop = async (req, res,next) => {
    let dbRole = await DB.findById(req.params.id);
    if(dbRole){
        await DB.findByIdAndDelete(dbRole._id);
        Helper.fMsg(res,"Role deleted successfully!");
    }else {
        next(new Error('No Role with that id'));
    }
}

const roleAddPermit = async (req, res,next) => {
    let dbRole = await DB.findById(req.body.roleId);
    let dbPermit = await permitDB.findById(req.body.permitId);

    if(dbRole && dbPermit){

        await DB.findByIdAndUpdate(dbRole._id,{ $push: {permit: dbPermit._id} });
        let result = await DB.findById(dbRole._id).select('-__v');
        Helper.fMsg(res,"Permit add to Role successfully!",result);
    }else {
        next(new Error('Role ID and Permit ID need to be validated!'));
    }

}

module.exports = {
    add,
    all,
    get,
    patch,
    drop,
    roleAddPermit
}
