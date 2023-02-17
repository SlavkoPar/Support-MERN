const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

let By = new Schema({
	userId: {
        type: ObjectId,
        required: true
    },
    userName: {
        type: String
    }
})

let DateBy = new Schema({
    date: {
        type: Date,
        required: true
    },
	by: By
})