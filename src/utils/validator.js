const jwt = require('jsonwebtoken');
const Helper = require('../utils/helper');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            let result = schema.validate(req.body);
            if (result.error) {
                const error = new Error(result.error.details[0].message);
                error.status = 400;
                next(error);

            } else {
                next();
            }
        }
    },
    validateParam: (schema, name) => {
        return (req, res, next) => {
            let obj = {};
            obj[`${name}`] = req.params[`${name}`];
            let result = schema.validate(obj);
            if (result.error) {
                next(new Error(result.error.details[0]));
            } else {
                next();
            }
        }
    },
    validateToken: () => {
        return async (req, res, next) => {
            // console.log(req.headers.authorization)
            if (req.headers.authorization === 'Bearer null') {
                const error = new Error("Tokenization Error");
                error.status = 401;
                next(error);
                return;
            }
            if (!req.headers.authorization) {
                const error = new Error("Tokenization Error");
                error.status = 401;
                next(error);
                return;
            }
            let token = req.headers.authorization.split(' ')[1];
            let decode = jwt.verify(token, process.env.JWT_SECRET);
            let user = await Helper.get(decode._id);
            // console.log(user);

            if (decode)
                if (user) {
                    req.user = user;
                    next();
                } else {
                    next(new Error("Tokenization Error"));
                }
            else
                next(new Error("Tokenization Error"));


        }

    },
    validateRole: (role) => {
        return async (req, res, next) => {
            let foundRole = req.user.roles.find(ro => ro.name == role);

            if (foundRole) {
                next();
            } else {
                next(new Error("You don't have this permission"))
            }
        }
    },
}
