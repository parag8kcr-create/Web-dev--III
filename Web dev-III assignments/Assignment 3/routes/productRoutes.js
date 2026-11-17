const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Aggregation & Reporting Routes
router.get('/summary', productController.getInventorySummary);
router.get('/low-stock', productController.getLowStock);

// General CRUD Routes
router.route('/')
    .get(productController.getAllProducts)
    .post(productController.createProduct);

router.route('/:id')
    .get(productController.getProductById)
    .put(productController.updateProduct)
    .delete(productController.deleteProduct);

// Specific Route for Stock Adjustment
router.patch('/:id/stock', productController.updateStock);

module.exports = router;