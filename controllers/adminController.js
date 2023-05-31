const { Model } = require("../models/Model");
const { Order } = require("../models/Order");
const { Product } = require("../models/Product");
const { User } = require("../models/User");

module.exports.control = function (_,response) {
    response.sendFile('D:/Web/PhoneSalon/views/pages/control.html');
}
module.exports.models = function(_, response) {
    response.sendFile('D:/Web/PhoneSalon/views/pages/models.html');
}
module.exports.users = function(_,response) {
    response.sendFile('D:/Web/PhoneSalon/views/pages/users.html');
}
module.exports.orders = function (_,response) {
    response.sendFile('D:/Web/PhoneSalon/views/pages/orders.html');
}
module.exports.postModel = async function(request, response) {
    const {name_model, parameters,img, producer} = request.body;
    const model = await Model.create({
        name_model,
        parameters,
        img,
        producer
    });
    if(model) {
        response.send(model);
    } else {
        response.status(400).send('Ошибка');
    }
}
module.exports.putModel = async function(request, response) {
    const {id,name_model, parameters, producer} = request.body;
    const newmodel = await Model.findOneAndUpdate({_id: id}, {name_model, producer, parameters});
    response.send(newmodel);
}
module.exports.deleteModel = async function(request, response) {
    const {id} = request.body;
    try {
        const deleteModel = await Model.deleteOne({_id: id});
        console.log('Модель удалена');
        response.json({message: "Успешно"});
    } catch(e) {
        console.log(e);
    }
}
module.exports.getModels = async function(request, response) {
    const models = await Model.find();
    response.send(models);
}

module.exports.getProducts = async function(request, response) {
    const products = await Product.find().populate({
        path: 'model'
    });
    response.send(products);
}
module.exports.postProduct = async function(request, response) {
    const {model_id, product_name, price} = request.body;
    const model = await Model.findOne({_id: model_id});
    if(model) {
        const product = await Product.create({
            model,
            price,
            name: product_name,
            available: '0'
        });
        console.log('Создан новый товар');
        response.send(product);
    }
}
module.exports.putProduct = async function(request, response) {
    const {id,available, price} = request.body;
    console.log(request.body);
    console.log(id,available, price);
    const newproduct = await Product.findOneAndUpdate({_id: id}, {available, price});
    response.send(newproduct);
}
module.exports.deleteProduct = async function(request,response) {
    const {id} = request.body;
    const deletedProduct = await Product.deleteOne({_id: id});
    response.send(deletedProduct);
}

module.exports.getUsers = async function(request, response) {
    const users = await User.find();
    response.send(users);
}
module.exports.deleteUser = async function(request, response) {
    const id = request.params.id;
    if(id == request.user.id) {
        response.status(400).json({message: "Ошибка"});
    } else {
        const user = await User.deleteOne({_id: id});
        if(user.deletedCount > 0) {
            response.status(200).json({message: "Успешно"});
        } else {
            response.status(400).json({message: "Ошибка"});
        }
    }
}
module.exports.putUser = async function(request,response) {
    const id = request.params.id;
    console.log(id);
    const {username,password,name,tel} = request.body;
    const user = await User.updateOne({_id: id}, {username,password,name,tel});
    if(user.modifiedCount > 0) {
        response.status(200).json({message: "Успешно"});
    } else {
        response.status(400).json({message: "Ошибка"});
    }
}
module.exports.getOrders = async function(request, response) {
    const orders = await Order.find().populate('customer').populate({
        path: 'products',
        populate: 'model'
    });
    response.send(orders);
}
module.exports.putOrder = async function(request,response) {
    const id = request.params.id;
    const order = await Order.updateOne({_id: id}, {status: request.body.status});
    if(order.modifiedCount > 0 ){
        response.status(200).json({message:"Успешно"});
    } else {
        response.status(400).json({message: "Ошибка"});
    }
}