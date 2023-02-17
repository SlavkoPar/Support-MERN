const mongoose = require('mongoose');
const DateBy = require('./schemas')

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;


let userSchema = new Schema({
    userName: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String
    },
    color: {
        type: String
    },
    created: {
        type: DateBy,
        required: true
    },
    modified: {
        type: DateBy
    },
}, {
    collection: 'users'
})

module.exports = mongoose.model('User', userSchema)
