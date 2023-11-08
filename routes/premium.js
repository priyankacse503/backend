const express = require('express');

const premiumController = require('../controllers/premium');
const authController= require('../middleware/auth');
const router = express.Router();

router.get('/leaderboarddata',authController.authenticate,premiumController.getLeaderboardExpenses);
router.get('/download',authController.authenticate,premiumController.getDownloadURL);
router.get('/downloadhistory',authController.authenticate,premiumController.getDownloadhistory);

module.exports = router;