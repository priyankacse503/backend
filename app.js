const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');

const app=express();

const adminRoutes=require('./routes/admin');
const shopRoutes=require('./routes/shop'); 
const contactRoutes=require('./routes/contactus');
const sucessRoutes=require('./routes/sucess');

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes);
app.use('/',shopRoutes);
app.use('/contactus',contactRoutes);
app.use('/sucess',sucessRoutes);

app.use((req,res,next)=>{
    //res.status(404).send('<h1>Page not found</h1>');
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));
})

app.listen(3000);





/*const http = require('http');

const routes=require('./routes');
console.log(routes.someText);

const server = http.createServer(routes.handler);
const server = http.createServer();
server.listen(3000);*/