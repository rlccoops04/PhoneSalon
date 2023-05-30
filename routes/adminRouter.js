const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminRouter = express.Router();

adminRouter.get('/control', adminController.control);
adminRouter.get('/control/models', adminController.models);
adminRouter.get('/control/users', adminController.users);
adminRouter.get('/get/models', adminController.getModels);
adminRouter.post('/post/model', adminController.postModel);
adminRouter.put('/put/model', adminController.putModel);
adminRouter.delete('/delete/model', adminController.deleteModel);

adminRouter.get('/get/products', adminController.getProducts);
adminRouter.post('/post/product', adminController.postProduct);
adminRouter.put('/put/product', adminController.putProduct);
adminRouter.delete('/delete/product', adminController.deleteProduct);
adminRouter.get('/get/users',authMiddleware(['Администратор']), adminController.getUsers);

module.exports = adminRouter;