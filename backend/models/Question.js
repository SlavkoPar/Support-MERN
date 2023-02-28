const mongoose = require('mongoose');
const DateBy = require('./DateBy')

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

let questionSchema = new Schema({
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
    answers: [],
	source: 0,
	status: 0,
    created: {
        type: DateBy,
        required: true
    },
    modified: {
        type: DateBy
    }
}, {
    collection: 'questions'
})

//categorySchema.index({ parentCategory: 1 });   // level

module.exports = mongoose.model('Question', questionSchema)
