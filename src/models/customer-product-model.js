'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        index: true,
        unique: true
    },
    products: [{
        _id: false,
        id: String,
        image: String,
        title: String,
        price: String
    }]
});

module.exports = mongoose.model('Product', schema);