const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();

// Receive POST request to add item to cart
router.post('/cart/products', async (req, res) => {
    // Figure out the cart!

    let cart; // keep cart variable accessible in entire route handler
    if (!req.session.cartId) {
        // Don't have a cart. Create one and store cart id on req.session.cartId property

        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;
    } else {
        // We have a cart. Get from repo.
        cart = await cartsRepo.getOne(req.session.cartId);
    }
    // look for item in items array
    const existingItem = cart.items.find(item => item.id === req.body.productId)

    if (existingItem) {
        // increment quantity and save cart
        existingItem.quantity++;
    } else {
        // add new product id to items array
        cart.items.push( {id: req.body.productId, quantity: 1 });
    }
    await cartsRepo.update(cart.id, {
        items: cart.items
    });

    res.redirect('/cart');
})

// Receive GET request to show all items in cart
router.get('/cart', async (req, res) => {
    if (!req.session.cartId) {
        return res.redirect('/');
    }

    const cart = await cartsRepo.getOne(req.session.cartId);

    for (let item of cart.items) {
    // item === { id: , quantity }
        const product = await productsRepo.getOne(item.id);

        // assigning new product key to item object in cart repo
        item.product = product;
    }
    
    res.send(cartShowTemplate( {items: cart.items }));
});

// Receive POST request to delete an item from cart
router.post('/cart/products/delete', async (req, res) => {
    const { itemId } = req.body;
    const cart = await cartsRepo.getOne(req.session.cartId);

    // items is a new array made up of items that are NOT == to itemId, which will be an array of one item.
    const items = cart.items.filter(item => item.id !== itemId);

    await cartsRepo.update(req.session.cartId, { items });

    return res.redirect('/cart');
});

module.exports = router;