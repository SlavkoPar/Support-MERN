const mongoose = require('mongoose');
const DateBy = require('./DateBy')

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

let categorySchema = new Schema({
    title: {
        type: String,
        required: true,
        index: { unique: true }
    },
    level: {
        type: Number,
        required: true
    },
    parentCategory: {
        type: ObjectId,
        index: { unique: false }
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

//categorySchema.index({ parentCategory: 1 });   // level

module.exports = mongoose.model('Category', categorySchema)
