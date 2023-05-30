const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports.Product = mongoose.model('Product', new Schema({
    model: {
        type: Schema.Types.ObjectId,
        ref: 'Model',
        required: true
    },
    price: {
        type: String, 
        required: true
    },
    available: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
},
{versionKey: false}
));