const express=require('express');

const router=express.Router();

// /admin/add-product=> GET
router.get('/add-product',(req,res,next)=>{
    //console.log('In the another middleware');
    res.send('<html><body><form action="/admin/add-product" method="POST"><input type="text" name="title"><input type="text" name="size"><button type="submit">Add Product</button></form></body></html>');
});

// /admin/add-product=> POST
router.post('/add-product',(req,res,next)=>{
    console.log(req.body);
    res.redirect('/');
});

module.exports=router;