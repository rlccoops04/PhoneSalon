const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminRouter = express.Router();

adminRouter.get('/control', adminController.control);
adminRouter.get('/control/models', adminController.models);
adminRouter.get('/control/users', adminController.users);
adminRouter.get('/control/orders', adminController.orders);

adminRouter.get('/get/models',authMiddleware(['Администратор','Менеджер']), adminController.getModels);
adminRouter.post('/post/model',authMiddleware(['Администратор','Менеджер']), adminController.postModel);
adminRouter.put('/put/model',authMiddleware(['Администратор','Менеджер']), adminController.putModel);
adminRouter.delete('/delete/model',authMiddleware(['Администратор','Менеджер']), adminController.deleteModel);

adminRouter.get('/get/products',authMiddleware(['Администратор','Менеджер']), adminController.getProducts);
adminRouter.post('/post/product',authMiddleware(['Администратор','Менеджер']), adminController.postProduct);
adminRouter.put('/put/product',authMiddleware(['Администратор','Менеджер']), adminController.putProduct);
adminRouter.delete('/delete/product',authMiddleware(['Администратор','Менеджер']), adminController.deleteProduct);
adminRouter.get('/get/users',authMiddleware(['Администратор']), adminController.getUsers);
adminRouter.delete('/delete/user/:id', authMiddleware(['Администратор']), adminController.deleteUser);
adminRouter.put('/put/user/:id', authMiddleware(['Администратор']), adminController.putUser);

adminRouter.get('/get/orders', authMiddleware(['Администратор','Менеджер']), adminController.getOrders);
adminRouter.put('/put/order/:id', authMiddleware(['Администратор','Менеджер']), adminController.putOrder);
module.exports = adminRouter;