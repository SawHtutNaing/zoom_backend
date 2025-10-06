const router = require('express').Router();
const controller = require('../controllers/roomController');
const  {RoomSchema}  = require('../utils/schema')
const  {validateBody,validateToken}  = require('../utils/validator')



router.post('/', [validateToken(),validateBody(RoomSchema.add),controller.startRoom]);
router.post('/join',[validateToken(),validateBody(RoomSchema.joinRoom),controller.joinRoom]);
router.post('/host/search',[validateToken(),validateBody(RoomSchema.hostSearch),controller.searchRoom]);
router.delete('/drop/user',[validateToken(),validateBody(RoomSchema.dropRoomUser),controller.dropRoomUser]);
module.exports = router;
