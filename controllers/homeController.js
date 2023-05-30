const { Order } = require("../models/Order");
const { Product } = require("../models/Product");
const { User } = require("../models/User");


module.exports.index =  (request, response) => {
    response.sendFile('D:/Web/PhoneSalon/views/pages/index.html');
};
module.exports.smartphones = (_, response) => {
    response.sendFile('D:/Web/PhoneSalon/views/pages/smartphones.html');
}
module.exports.watches = (_, response) => {
    response.sendFile('D:/Web/PhoneSalon/views/pages/watches.html');
}
module.exports.accessories = (_, response) => {
    response.sendFile('D:/Web/PhoneSalon/views/pages/accessories.html');
}
module.exports.rechargers = (_, response) => {
    response.sendFile('D:/Web/PhoneSalon/views/pages/rechargers.html');
}
module.exports.basket = (_, response) => {
    response.sendFile('D:/Web/PhoneSalon/views/pages/basket.html');
}
module.exports.getUser = async (request, response) => {
    response.json(request.user);
}
module.exports.getProducts = async (request, response) => {
    const products = await Product.find().populate('model');
    response.send(products);
}
module.exports.getSmartphones = async (request, response) => {
    const products = await Product.find({name: 'Смартфоны'}).populate('model');
    response.send(products);
}

module.exports.getWatches = async (request, response) => {
    const products = await Product.find({name: 'Смарт-часы и браслеты'}).populate('model');
    response.send(products);
}
module.exports.getAccessories = async (request, response) => {
    const products = await Product.find({name: 'Защита и поддержка для смартфонов'}).populate('model');
    response.send(products);
}
module.exports.getRecharges = async (request, response) => {
    const products = await Product.find({name: 'Зарядка и подключение для смартфонов'}).populate('model');
    response.send(products);
}
module.exports.postOrder = async (request, response) => {
    const {basket} = request.body;
    let products = [];
    const prods = JSON.parse(basket);
    prods.forEach(async prod => {
        const product = await Product.findOne({_id: prod});
        products.push(product);
    });
    const user = await User.findOne({_id: request.user.id});
    const order = await Order.create({
        products,
        customer: user,
        status: 'В обработке'
    });
    response.send(order);
}
module.exports.getOrders = async (request, response) => {
    const orders = await Order.find({customer: request.user.id}).populate('customer').populate({
        path: 'products',
        populate: 'model'
    });
    response.send(orders);
}