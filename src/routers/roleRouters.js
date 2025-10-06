const router = require('express').Router();
const controller = require('../controllers/roleController');
const {RoleSchema, AllSchema} = require('../utils/schema');
const {validateBody, validateParam, validateToken} = require('../utils/validator');

router.get('/',[validateToken(),controller.all])
router.post('/', [validateToken(),validateBody(RoleSchema.add)],controller.add);
router.post('/add/permit',validateBody(RoleSchema.addPermit),controller.roleAddPermit);

router.route('/:id')
    .get([validateToken(),validateParam(AllSchema.id,'id')],controller.get)
    .patch([validateToken(),validateParam(AllSchema.id,'id'),validateBody(RoleSchema.add)],controller.patch)
    .delete([validateToken(),validateParam(AllSchema.id,'id')],controller.drop);


module.exports = router;

