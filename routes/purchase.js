// IMPORT EXPRESS 
const express=require('express');
const router=express.Router();

const cors=require("cors");

router.use(cors());
const purchaseController = require('../controllers/purchase');
const authController= require('../middleware/auth');

router.get('/premiummembership',authController.authenticate,purchaseController.premiummembership);
router.post('/updatetransactionstatus',authController.authenticate,purchaseController.updatetransactionstatus); 

module.exports = router;

