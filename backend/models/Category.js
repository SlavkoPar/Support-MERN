const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

let categorySchema = new Schema({
    name: {
        type: String
    },
    created: {
        type: Date
    },
    createdBy: {
        type: ObjectId
    },
    modified: {
        type: Date
    },
    modifiedBy: {
        type: ObjectId
    },
    level: {
        type: Number
    },
    parentCategory: {
        type: ObjectId
    }

}, {
    collection: 'categories'
})

categorySchema.index({ parentCategory: 1 });   

module.exports = mongoose.model('Category', categorySchema)
