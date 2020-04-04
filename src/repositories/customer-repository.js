'use strict';

const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

exports.get = async (skip, pageSize) => {
    const res = await Customer
        .find({}, 'name email _id', { skip: skip, limit: pageSize });
    return res;
}

exports.getById = async (id) => {
    const res = await Customer
        .findById(id);

    return res;
}

exports.getByEmail = async (email) => {
    const res = await Customer
        .findOne({
            email: email
        }, 'email');

    return res;
}

exports.create = async (data) => {
    var customer = new Customer(data);
    await customer.save();
}

exports.update = async (id, data) => {
    await Customer.findByIdAndUpdate(id, {
        $set: {
            name: data.name,
            email: data.email
        }
    });
}

exports.delete = async (id) => {
    await Customer.findByIdAndRemove(id);
}