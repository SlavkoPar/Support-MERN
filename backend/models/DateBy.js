const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const DateBy = new Schema({
    date: {
        type: Date,
        required: true
    },
	by: {
        userId: {
            type: ObjectId,
            required: true,
            ref: 'User'
        },
        userName: {
            type: String
        }
    }
})
