const router = require('express').Router();
const controller = require('../controllers/permitController');
const {PermitSchema,AllSchema} = require('../utils/schema')
const {validateBody,validateParam,validateToken} = require('../utils/validator')


router.get('/',[validateToken()],controller.all);
router.post('/', [validateToken(),validateBody(PermitSchema.add),controller.add]);
router.route('/:id')
    .get([validateToken(),validateParam(AllSchema.id,'id')], controller.get)
    .patch([validateToken(),validateParam(AllSchema.id,'id')],controller.patch)
    .delete([validateToken(),validateParam(AllSchema.id,'id')],controller.drop);

module.exports = router;
