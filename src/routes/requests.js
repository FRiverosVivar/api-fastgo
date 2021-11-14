const router = require("express").Router();
const RequestsController = require('../controllers/request-controller/request-controller')
const auth = require('../middlewares/authentication/authentication')

router.route('/')
	.get(RequestsController.index)
    .post(auth,RequestsController.create);
router.route('/:id/start_request')
    .get(auth,RequestsController.start_request)
router.route('/:id/request_final_dir')
    .get(auth,RequestsController.final_dir)
router.route('/:id/end_request')
    .get(auth,RequestsController.stop_request)
router.route('/:id/set_as_disponible')
    .get(auth,RequestsController.set_as_disponible)
    
module.exports = router;