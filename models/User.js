const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports.User = mongoose.model('User', new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    tel: {
        type: String
    },
    roles: [{
        type: String,
        ref: 'Role'
    }]
},
{versionKey: false}
));