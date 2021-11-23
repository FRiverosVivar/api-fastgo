const router = require("express").Router();
const UsersController = require('../controllers/users-controller/users-controller')

router.route('/')
	.get(UsersController.index)
    .post(UsersController.newUser);
router.route('/get-info')
	.get(UsersController.getInfo)
module.exports = router;