const router = require('express').Router();
const controller = require('../controllers/userController');
const  {UserSchema}  = require('../utils/schema')
const  {validateBody,validateToken,validateRole}  = require('../utils/validator')
const {saveSingleFile} = require('../utils/gallery.js')


router.get('/info',[validateToken(),controller.getUser]);
router.post('/register',[validateBody(UserSchema.register),controller.register]);
router.post('/login',[validateBody(UserSchema.login),controller.login]);
router.post('/logout',[validateToken(),validateBody(UserSchema.logout),controller.logout]);

router.post('/add/role',[validateToken(),validateRole('admin'),validateBody(UserSchema.addRole),controller.addRole]);
router.post('/remove/role',[validateToken(),validateRole('admin'),validateBody(UserSchema.addRole),controller.removeRole]);


router.post('/add/permit',[validateToken(),validateRole('admin'),validateBody(UserSchema.addPermit),controller.addPermit]);
router.post('/remove/permit',[validateToken(),validateRole('admin'),validateBody(UserSchema.addPermit),controller.removePermit]);

router.post('/profile/update',[validateToken(),saveSingleFile,controller.profileUpdate])






module.exports = router;
