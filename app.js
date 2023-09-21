const express=require('express');
const bodyParser=require('body-parser');

const app=express();

app.use(bodyParser.urlencoded({extended:false}));

app.use('/add-product',(req,res,next)=>{
    //console.log('In the another middleware');
    res.send('<html><body><form action="/product" method="POST"><input type="text" name="title"><input type="text" name="size"><button type="submit">Add Product</button></form></body></html>');
});

app.use('/product',(req,res,next)=>{
    console.log(req.body);
    res.redirect('/');
});

app.use('/',(req,res,next)=>{
    res.send('<h1>Hello from Express!</h1>');
});

app.listen(3000);





/*const http = require('http');

const routes=require('./routes');
console.log(routes.someText);

const server = http.createServer(routes.handler);
const server = http.createServer();
server.listen(3000);*/