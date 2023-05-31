const express = require("express");
const authController = require('../controllers/authController.js');
const authMiddleware = require("../middlewares/authMiddleware.js");
const authRouter = express.Router();

authRouter.post('/registration', authController.registration);
authRouter.post('/login', authController.login);
 
module.exports = authRouter;