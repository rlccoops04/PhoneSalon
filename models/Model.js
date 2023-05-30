const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports.Model = mongoose.model('Model', new Schema({
    name_model: {
        type: String,
        required: true
    },
    parameters: [{
        parameter_name: String,
        parameter_value: String
    }],
    img: {
        type: String
    },
    producer: {
        type: String
    }
},
{versionKey: false}
));