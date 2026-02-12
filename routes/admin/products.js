const express = require('express');
const multer = require('multer');

const { handleErrors, requireAuth } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate = require('../../views/admin/products/edit');
const { requireTitle, requirePrice } = require('./validators');
const middlewares = require('./middlewares');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// route handler to list products to administrator
router.get('/admin/products', requireAuth, async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({ products }));
});

// route handler to show form to input new product
router.get('/admin/products/new', requireAuth, (req, res) => {
    res.send(productsNewTemplate({}));
});

// deals with actual form submission
// LOOK AT ORDER OF MIDDLEWARE! Multer must be before validator!
router.post('/admin/products/new',
    requireAuth,
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

    res.redirect('/admin/products');
});

// edit product page
router.get('/admin/products/:id/edit',
    requireAuth, 
    async (req, res) => {
        const product = await productsRepo.getOne(req.params.id);

        if (!product) {
            return res.send('We couldn\'t find that one!');
        }

        res.send(productsEditTemplate({ product }));
});

router.post('/admin/products/:id/edit',
    requireAuth, 
    upload.single('image'),
    [requireTitle, requirePrice],
    handleErrors(productsEditTemplate, async (req) => {
        const product = await productsRepo.getOne(req.params.id);
        return { product };
    }),
    async (req, res) => {
        // changes will represent altered information in our product
        const changes = req.body;

        // if our request object contains a file upload
        if (req.file) {
            changes.image = req.file.buffer.toString('base64');
        }

        try {
            await productsRepo.update(req.params.id, changes)
        } catch (err) {
            return res.send('Could not find that item!');
        }

        res.redirect('/admin/products');
});

router.post('/admin/products/:id/delete',
    requireAuth,
    async (req, res) => {
        await productsRepo.delete(req.params.id);

        res.redirect('/admin/products');
    }
);

module.exports = router;

