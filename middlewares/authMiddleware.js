const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET;

module.exports = function (roles) {
    return function (req,res,next) {
        if(req.method === "OPTIONS") {
            next();
        }
        try {
            const token = req.headers.authorization.split(' ')[1];
            if(!token) {
                console.log('Токен не найден');
                return res.status(401).json({message: "Токен не найден"});
            }
            const decodedData = jwt.verify(token, secret);
            req.user = decodedData;
            const userRoles = decodedData.roles;
            let hasRole = false;
            userRoles.forEach(role => {
                if(roles.includes(role)) {
                    hasRole = true;
                }
            });
            if(!hasRole) {
                return res.status(403).json({message: "У вас нет доступа"});
            }
            next();
        } catch(e) {
            console.log(e);
            return res.status(401).json({message: "Ошибка авторизации"});
        }
    }
}