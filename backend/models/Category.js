const mongoose = require('mongoose');
const DateBy = require('./DateBy')

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

let categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    parentCategory: {
        type: ObjectId
    },
    created: {
        type: DateBy,
        required: true
    },
    modified: {
        type: DateBy
    }
}, {
    collection: 'categories'
})

categorySchema.index({ parentCategory: 1 });   // level

module.exports = mongoose.model('Category', categorySchema)
