const mongoose = require('mongoose');
const DateBy = require('./schemas')

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

let categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    created: {
        type: DateBy,
        required: true
    },
    modified: {
        type: DateBy
    },
    level: {
        type: Number,
        required: true
    },
    parentCategory: {
        type: ObjectId
    }
}, {
    collection: 'categories'
})

categorySchema.index({ parentCategory: 1 });   

module.exports = mongoose.model('Category', categorySchema)
