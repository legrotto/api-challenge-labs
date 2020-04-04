'use strict';

const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

exports.get = async () => {
    const res = await Customer
        .find();

    return res;
}

exports.getById = async (id) => {
    const res = await Customer
        .findById(id);

    return res;
}

exports.authenticate = async (data) => {
    const res = await Customer.findOne({
        email: data.email
    });

    return res;
}