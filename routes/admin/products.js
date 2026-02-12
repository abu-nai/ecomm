const express = require('express');
const multer = require('multer');

const { handleErrors } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');
const middlewares = require('./middlewares');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// route handler to list products to administrator
router.get('/admin/products', (req, res) => {});

// route handler to show form to input new product
router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}));
});

// deals with actual form submission
// LOOK AT ORDER OF MIDDLEWARE! Multer must be before validator!
router.post('/admin/products/new',
    upload.single('image'),
    [requireTitle, requirePrice],
    handleErrors(productsNewTemplate), 
    async (req, res) => {
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });
    
    // // shows us raw data being included with post-request
    // req.on('data', data => {
    //     console.log(data.toString());
    // });

    res.send('submitted');
})

module.exports = router;