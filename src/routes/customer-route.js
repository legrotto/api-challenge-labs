'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/customer-controller');
const controllerCustomerProduct = require('../controllers/customer-product-controller');
const authService = require('../services/auth-service');

//Customer routes
router.get('/', authService.authorize, controller.get);
router.get('/:id', authService.authorize, controller.getById);
router.post('/', controller.post);
router.put('/:id', authService.authorize, controller.put);
router.delete('/:id', authService.authorize, controller.delete);

//Customer-associated product list route
router.get('/:id/products', authService.authorize, controllerCustomerProduct.getByCustomer);
router.get('/:id/products/:product', authService.authorize, controllerCustomerProduct.getByCustomerProduct);
router.post('/:id/products', authService.authorize, controllerCustomerProduct.post);

module.exports = router;