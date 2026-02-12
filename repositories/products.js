const Repository = require('./repository');

class ProductsRepository extends Repository {}

// create instance of ProductsRepository and export it
module.exports = new ProductsRepository('products.json');