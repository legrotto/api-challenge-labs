'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repository');
const repositoryCustomerProduct = require('../repositories/customer-product-repository');

const messageNotFound = 'Cliente não encontrado.';
const messageFail = 'Falha ao processar sua requisição.';

//Read Customers
exports.get = async (req, res, next) => {
    try {
        let data = await repository.get();

        if (data.length <= 0) {
            res.status(404).send({
                message: 'Não há clientes cadastrados.'
            });

            return;
        }

        let pageSize = req.query.pageSize == null ? 10 : req.query.pageSize;
        let pageNumber = req.query.pageNumber == null ? 1 : req.query.pageNumber;
        let skip = ((pageNumber - 1) * pageSize);
        let totalRecords = await (await repository.get()).length;

        let pageData = await repository.get(new Number(skip), new Number(pageSize));

        res.status(200).send({
            meta: {
                pageNumber: new Number(pageNumber),
                pageSize: new Number(pageSize),
                totalRecords: totalRecords
            },
            customers: pageData
        });
    } catch (e) {
        res.status(500).send({
            message: messageFail
        });
    }
}

//Read Customer by ID
exports.getById = async (req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        if (!data) {
            res.status(404).send({
                message: messageNotFound
            });

            return;
        }

        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição.'
        });
    }
}

//Create Customer
exports.post = async (req, res, next) => {

    //Validate input data
    let contract = new ValidationContract();

    contract.isRequired(req.body.name, 'O nome é obrigatório.');

    contract.isRequired(req.body.email, 'O e-mail é obrigatório.');
    contract.isEmail(req.body.email, 'E-mail inválido.');
    contract.isUnique(await repository.getByEmail(req.body.email), 'O e-mail informado já está cadastrado.');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email
        });

        let user = await repository.get();
        let newUser = user.filter((user) => {
            return user.email === req.body.email;
        });

        res.status(201).send({
            message: 'Cliente cadastrado com sucesso!',
            url: req.protocol + '://' + req.get('host') + req.originalUrl + newUser[0]._id
        });
    } catch (e) {
        res.status(500).send({
            message: messageFail
        });
    }
}

//Update Customer
exports.put = async (req, res, next) => {
    try {
        const user = await repository.getById(req.params.id);

        if (!user) {
            res.status(404).send({
                message: messageNotFound
            });

            return;
        }

        req.body.name = req.body.name == undefined || req.body.name == null ? user.name : req.body.name;
        req.body.email = req.body.email == undefined || req.body.email == null ? user.email : req.body.email;

        //Validate input data        
        const contract = new ValidationContract();
        contract.isEmail(req.body.email, 'E-mail inválido.');

        if (req.body.email != user.email && contract.isValid())
            contract.isUnique(req.body.email, 'O e-mail informado já está cadastrado.');

        if (!contract.isValid()) {
            res.status(400).send(contract.errors()).end();
            return;
        }

        await repository.update(req.params.id, req.body);

        res.status(200).send({
            message: 'Cliente atualizado com sucesso!',
            url: req.protocol + '://' + req.get('host') + req.originalUrl
        });
    } catch (e) {
        res.status(500).send({
            message: messageFail
        });
    }
}

//Delete Customer and your favorite product list
exports.delete = async (req, res, next) => {
    try {
        var user = await repository.getById(req.params.id);
        if (!user) {
            res.status(404).send({
                message: messageNotFound
            });

            return;
        }

        await repository.delete(req.params.id);

        // Delete list of favorite products
        let customerProduct = await repositoryCustomerProduct.getByCustomer(req.params.id);
        if (customerProduct)
            await repositoryCustomerProduct.delete(customerProduct.id);

        res.status(204).send({
            message: 'Cliente e sua lista de produtos favoritos removidos com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            message: messageFail
        });
    }
}