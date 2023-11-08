const express=require('express');
const router=express.Router();
const cors=require("cors");

router.use(cors());

const expenseController=require('../controllers/expense');

const authenticateController=require('../middleware/auth');

router.post('/addexpense',authenticateController.authenticate,expenseController.addExpense);

router.get('/getexpenses',authenticateController.authenticate,expenseController.getExpenses);

router.delete('/deleteexpense/:id',authenticateController.authenticate,expenseController.deleteExpense);

module.exports=router;