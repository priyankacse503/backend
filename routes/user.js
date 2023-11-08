const express=require('express');
const router=express.Router();
const cors=require("cors");

router.use(cors());

const userController=require('../controllers/user');

router.post('/signup',userController.signupAuthentication);

router.post('/signin',userController.signinAuthentication);

module.exports=router;