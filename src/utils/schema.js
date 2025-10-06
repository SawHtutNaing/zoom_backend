const Joi = require('joi')


module.exports = {
    UserSchema: {
      register: Joi.object({
          name: Joi.string().min(5).required(),
          email: Joi.string().email().required(),
          phone: Joi.string().min(8).max(11).required(),
          password: Joi.string().min(8).max(16).required(),

      }),
        login: Joi.object({
            phone: Joi.string().min(8).max(11).required(),
            password: Joi.string().min(8).max(16).required(),

        }),
        logout: Joi.object({
            id:Joi.string().regex(/^[0-91-fA-F]{24}$/)
        }),
        // userInfo: Joi.object({
        //     token:Joi.string().required()
        // }),
        addRole:Joi.object({
            userId: Joi.string().regex(/^[0-91-fA-F]{24}$/),
            roleId:Joi.string().regex(/^[0-91-fA-F]{24}$/)
        }),
        addPermit:Joi.object({
            userId: Joi.string().regex(/^[0-91-fA-F]{24}$/),
            permitId:Joi.string().regex(/^[0-91-fA-F]{24}$/)
        }),
    },
    PermitSchema:{
       add: Joi.object({
           name: Joi.string().required(),
       })
    },
    RoleSchema:{
        add:Joi.object({
            name: Joi.string().required(),
            // permit :Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        }),
        addPermit:Joi.object({
            roleId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            permitId:Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        })
    },
    RoomSchema:{
        add:Joi.object({
            hostId: Joi.number().required(),
            topic: Joi.string().required(),
            password: Joi.string().min(8).max(16).required(),
        }),
        joinRoom:Joi.object({
            hostId: Joi.number().required(),
            password: Joi.string().min(8).max(16).required(),
        }),
        hostSearch:Joi.object({
            hostId: Joi.number().required(),
        }),
        dropRoomUser:Joi.object({
            roomId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        })
    },
    AllSchema:{
        id:Joi.object({
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        })
    }
}
