const User = require('../models/user');

const createUser = async (name,userName,hashedPassword) => {
    try {
        const user = await User.create({ name: name, userName: userName, password: hashedPassword });
        return user;
        
    } catch (error) {
        console.log(error);
        throw error
    }
}

const getUserbyemail = async (userName) => {
    try {
        let user = await User.findAll({ where: { userName } });
        return user;

    } catch (error) {
        console.log(error);
        throw error
    }
}
 module.exports={
    getUserbyemail,
    createUser
 }