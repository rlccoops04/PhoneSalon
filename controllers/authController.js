const jwt = require('jsonwebtoken');
const {User} = require('../models/User');
const {Role} = require('../models/Role');

require('dotenv').config();
const secret = process.env.SECRET;
console.log(secret);

function generateAccessToken(id, roles) {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"});
}

module.exports.registration = async (req,res) => {
    try {   
        console.log(req.body);
        const {name, tel, username, password, role} = req.body;
        const candidate = await User.findOne({username: username});
        if(candidate) {
            console.log("Пользователь уже есть");
            return res.status(400).json({message: "Пользователь уже есть"});
        }
        const userRole = await Role.findOne({value: role});
        if(userRole) {
            const user = await User.create({name, tel, username, password, roles:[userRole.value]});
            if(user) {
                console.log("Пользователь успешно зарегистрирован");
                res.json({message: "Пользователь успешно зарегистрирован"});
            } else {
                console.log("Ошибка при создании пользователя");
                res.json({message: "Ошибка при создании пользователя"});
            }
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({message: 'Registration error'});
    }
}

module.exports.login = async (req,res) => {
    try {
        const username1 = req.body.username;
        const password1 = req.body.password;
        let user = await User.findOne({username: username1, password: password1});
        console.log('Авторизирован: ' + user.roles[0]);
        console.log('dsadas');
        const token = generateAccessToken(user._id, user.roles);
        return res.json(token);
    } catch (e) {
        console.log(e);
        return res.status(400).json({message: 'Login error'});
    }
}
