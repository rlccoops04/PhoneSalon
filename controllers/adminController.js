const { Model } = require("../models/Model");
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
    console.log(users);
    response.send(users);
}