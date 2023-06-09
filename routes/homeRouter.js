const express = require('express');
const homeController = require('../controllers/homeController');
const authMiddleware = require('../middlewares/authMiddleware');
const homeRouter = express.Router();
homeRouter.get('/', homeController.index);
homeRouter.get('/catalog/smartphones', homeController.smartphones);
homeRouter.get('/catalog/watches', homeController.watches);
homeRouter.get('/catalog/accessories', homeController.accessories);
homeRouter.get('/catalog/rechargers', homeController.rechargers);
homeRouter.get('/basket', homeController.basket);
homeRouter.get('/product/:id', homeController.product);
homeRouter.get('/profile', homeController.profile);

homeRouter.get('/get/user',authMiddleware(['Пользователь', 'Администратор', 'Менеджер']), homeController.getUser);
homeRouter.put('/put/user', authMiddleware(['Пользователь', 'Администратор', 'Менеджер']), homeController.putUser);
homeRouter.get('/get/products', homeController.getProducts);
homeRouter.get('/get/product/:id', homeController.getProduct);

homeRouter.get('/get/products/smartphones', homeController.getSmartphones);
homeRouter.get('/get/products/watches', homeController.getWatches);
homeRouter.get('/get/products/accessories', homeController.getAccessories);
homeRouter.get('/get/products/rechargers', homeController.getRecharges);

homeRouter.post('/post/order', authMiddleware(['Пользователь']), homeController.postOrder);
homeRouter.get('/get/orders', authMiddleware(['Пользователь']), homeController.getOrders);

module.exports = homeRouter;