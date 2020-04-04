'use strict';

const repository = require('../repositories/customer-product-repository');
const customerRepository = require('../repositories/customer-repository');
const axios = require('axios');

const messageFail = 'Falha ao processar sua requisição.';

//Read the Customer's favorite product list by Customer and Product ID
exports.getByCustomerProduct = async (req, res, next) => {
    try {
        let data = await repository.getByCustomer(req.params.id);

        if (!data) {
            res.status(404).send({
                message: 'Cliente não possui lista de produtos favoritos.'
            });

            return;
        }

        const infoProduct = [];
        data.products.map(async element => {
            if (element.id == req.params.product) {
                infoProduct.push({
                    id: element.id,
                    title: element.title,
                    image: element.image,
                    price: element.price
                });
            }
        });

        if (infoProduct.length <= 0) {
            res.status(404).send({
                message: 'Este produto não está associado ao cliente.'
            });

            return;
        }

        res.status(200).send({
            customer: data.customer,
            product: infoProduct
        });
    } catch (e) {
        res.status(500).send({
            message: messageFail
        });
    }
}

//Read the Customer's favorite product list by Customer ID
exports.getByCustomer = async (req, res, next) => {
    try {
        let data = await repository.getByCustomer(req.params.id);

        if (!data) {
            res.status(404).send({
                message: 'Cliente não possui lista de produtos favoritos.'
            });

            return;
        }

        res.status(200).send({
            customer: data.customer,
            products: data.products
        });
    } catch (e) {
        res.status(500).send({
            message: messageFail
        });
    }
}

//Create the Customer's favorite product list
exports.post = async (req, res, next) => {
    try {
        let user = await customerRepository.getById(req.params.id);
        if (!user) {
            res.status(404).send({
                message: 'Cliente não encontrado.'
            });

            return;
        }

        //Checks product exists
        const paths = req.body.products;
        const apiProd = axios.create({
            baseURL: 'http://challenge-api.luizalabs.com/api/product'
        });

        const infoProduct = [];
        const resolve = async (urls) => {
            if (urls.length > 0) {
                const [element, ...nurls] = urls;
                let { data } = await apiProd.get(element);

                infoProduct.push({
                    id: data.id,
                    title: data.title,
                    image: data.image,
                    price: data.price
                });

                const ndata = await resolve(nurls);
                return [data, ...ndata]
            }

            return [];
        }

        await resolve(paths);

        //Checks Customer already has a list of favorite products associated with it
        let customerProduct = await repository.getByCustomer(req.params.id);
        if (customerProduct)
            infoProduct.push.apply(infoProduct, customerProduct.products)

        //Checks for repeated items in the list
        let idList = [];
        infoProduct.forEach(element => {
            idList.push(element.id)
        });

        if (new Set(idList).size !== idList.length) {
            let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index);

            res.status(400).send({
                message: 'Há produtos repetidos na lista. Verifique os itens: ' + findDuplicates(idList)
            }).end();

            return;
        }

        //If Customer already has a list of products it is updated if it is not created
        if (customerProduct) {
            await repository.update(customerProduct.id, infoProduct);
        }
        else {
            await repository.create({
                customer: req.params.id,
                products: infoProduct
            });
        }

        res.status(201).send({
            message: 'Produto(s) adicionado(s) com sucesso!',
            url: req.protocol + '://' + req.get('host') + req.originalUrl
        });
    } catch (e) {
        res.status(500).send({
            message: messageFail + ' Verique os itens da lista'
        });
    }
}

//Delete Customer and your favorite product list
exports.delete = async (req, res, next) => {
    try {
        var user = await customerRepository.getById(req.params.id);
        if (!user) {
            res.status(404).send({
                message: messageNotFound
            });

            return;
        }

        await customerRepository.delete(req.params.id);

        // Delete list of favorite products
        let customerProduct = await repository.getById(req.params.id);
        if (customerProduct)
            await repository.deleteProduct(customerProduct.id);

        res.status(204).send({ message: 'Cliente e sua lista de produtos favoritos removidos com sucesso!' });
    } catch (e) {
        res.status(500).send({
            message: messageFail
        });
    }
}