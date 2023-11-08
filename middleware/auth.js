const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.SECRET_KEY;

const authenticate = (req, res, next) => {
   
    try {
        const token = req.header('authorization');
        const user = jwt.verify(token,secretKey);
        User.findByPk(user.userId).then(user => {
           // console.log(JSON.stringify(user));
            req.user = user;
            next();
        }).catch(err => { throw new Error(err) })
    }
    catch (err) {
        return res.status(401).json({ sucess: false })
    }
}

module.exports = {
    authenticate
}