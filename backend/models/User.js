const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

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
        type: Date
    },
    modified: {
        type: Date
    },
    createdBy: {
        type: ObjectId
    },
    modifiedBy: {
        type: ObjectId
    },
}, {
    collection: 'users'
})

module.exports = mongoose.model('User', userSchema)
