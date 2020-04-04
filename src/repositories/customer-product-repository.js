'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.getByCustomer = async (id) => {
    const res = await Product
        .findOne({
            customer: id
        }, 'customer products')
        .populate('customer', 'name email');

    return res;
}

exports.create = async (data) => {
    var product = new Product(data);
    await product.save();
}

exports.update = async (id, data) => {
    await Product.findByIdAndUpdate(id, {
        $set: {
            products: data
        }
    });
}

exports.delete = async (id) => {
    await Product.findByIdAndRemove(id);
}