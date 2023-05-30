const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports.Order = mongoose.model('Order', new Schema({
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    status: {
        type: String
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{versionKey: false}
));