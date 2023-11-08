const UserServices = require('../services/user_services');
const User=require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.SECRET_KEY

const signupAuthentication = async (req, res) => {
    const { name, userName, password } = req.body;
    try {
        const user = await UserServices.getUserbyemail(userName);
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await UserServices.createUser(name, userName, hashedPassword);
            res.status(201).json({ allUsers: user });
        }
        else {
            res.status(401).send(user);
        }
    }
    catch (err) {
        res.status(500).json({ error: err })
    }
}

function generateAccessToken(id, ispremiumuser) {
    return jwt.sign({ userId: id, ispremiumuser }, secretKey);
}

const signinAuthentication = async (req, res) => {

    try {
        const { userName, password } = req.body;
        
        /*if (isstringinvalid(userName) || isstringinvalid(password)) {
            return res.status(400).json({ message: 'EmailId or password is incorrect' })
        }*/
        //const user = await getUserbyemail(userName);
        const user = await UserServices.getUserbyemail(userName);
        if (user.length == 0) {
            res.status(404).send('User not Found');
        }
        else {
            const isPasswordValid = await bcrypt.compare(password, user[0].password);

            if (isPasswordValid) {
                //const token=jwt.sign({userId: user[0].id,ispremiumuser: user[0].ispremiumuser},secretKey);
                return res.status(200).json({ success: true, message: "user logged in successfully", token: generateAccessToken(user[0].id, user[0].ispremiumuser) });
            }
            else {
                return res.status(401).json({ success: true, message: "Authentication Failed" });
            }
        }
    }
    catch (err) {
        res.status(500).send('An error occurred during authentication')
    }
}

module.exports = {
    signupAuthentication,
    signinAuthentication
}