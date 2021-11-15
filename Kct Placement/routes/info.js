const express = require('express');
const infoController = require('../controllers/info');
const router = express.Router();

router.post('/register', infoController.register );
router.post('/loginpage', infoController.loginpage);

//exporting the routes given above to main func
module.exports = router;