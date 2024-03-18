const express = require('express');

const router = express.Router();

const productsController = require('../Controller/products');

// CREATE -> POST
router.post('/product', productsController.createProducts);

// READ -> GET

router.get('/products', productsController.getAllProducts);



module.exports = router;

