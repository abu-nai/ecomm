const express = require('express');
const { validationResult } = require('express-validator');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();

// route handler to list products to administrator
router.get('/admin/products', (req, res) => {});

// route handler to show form to input new product
router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}));
});

// deals with actual form submission
router.post('/admin/products/new', [
    requireTitle,
    requirePrice
], (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    res.send('submitted');
})

module.exports = router;