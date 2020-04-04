'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true
    },
    createDate: {
        type: Date,
        required: true,
        default: Date.now,
        select: false
    }
});

module.exports = mongoose.model('Customer', schema);