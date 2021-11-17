const router = require("express").Router();
const RequestsController = require('../controllers/request-controller/request-controller')
const auth = require('../middlewares/authentication/authentication')

router.route('/')
	.get(RequestsController.index)
    .post(auth,RequestsController.create);
router.route('/start_request')
    .get(auth,RequestsController.start_request)
router.route('/request_final_dir')
    .get(auth,RequestsController.final_dir)
router.route('/end_request')
    .get(auth,RequestsController.stop_request)
router.route('/set_as_disponible')
    .get(auth,RequestsController.set_as_disponible)
    
module.exports = router;