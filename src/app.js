'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
const router = express.Router();

//Connection
mongoose.connect(config.connectionString, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true });

//Load models
const Product = require('./models/customer-product-model');
const Customer = require('./models/customer-model');

//Load routes
const authRoute = require('./routes/auth-route');
const customerRoute = require('./routes/customer-route');

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

//Enable CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Default-Page-Number', '1');
    res.header('Default-Page-Size', '10');
    next();
});

//Define routes
app.use('/', authRoute);
app.use('/customers', customerRoute);

module.exports = app;