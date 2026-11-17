const Product = require('../models/Product');

// Create Product
exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

// Get All Products (Filtering, Sorting & Pagination)
exports.getAllProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, category, sort } = req.query;
        const query = {};
        
        if (category) query.category = category;

        // Sorting setup
        let sortOption = { createdAt: -1 }; 
        if (sort) {
            const [field, order] = sort.split(':');
            sortOption = { [field]: order === 'desc' ? -1 : 1 };
        }

        const products = await Product.find(query)
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Product.countDocuments(query);

        res.status(200).json({
            total: count,
            page: Number(page),
            totalPages: Math.ceil(count / limit),
            count: products.length,
            products
        });
    } catch (error) {
        next(error);
    }
};

// Get Single Product
exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

// Update Product
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

// Delete Product
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product deleted', id: product._id });
    } catch (error) {
        next(error);
    }
};

// Get Low-Stock Alert Report
exports.getLowStock = async (req, res, next) => {
    try {
        // Compare quantity with reorderLevel
        const lowStockItems = await Product.find({ $expr: { $lte: ["$quantity", "$reorderLevel"] } });
        res.status(200).json({
            count: lowStockItems.length,
            lowStockItems
        });
    } catch (error) {
        next(error);
    }
};

// Category-wise Inventory Summary (Aggregation)
exports.getInventorySummary = async (req, res, next) => {
    try {
        const summary = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalItems: { $sum: 1 },
                    totalQuantity: { $sum: "$quantity" },
                    totalStockValue: { $sum: { $multiply: ["$price", "$quantity"] } },
                    avgPrice: { $avg: "$price" }
                }
            }
        ]);
        
        res.status(200).json({
            categories: summary.length,
            summary
        });
    } catch (error) {
        next(error);
    }
};

// Update Stock (Increment/Decrement)
exports.updateStock = async (req, res, next) => {
    try {
        const { change } = req.body;
        const product = await Product.findById(req.params.id);
        
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        product.quantity += Number(change);
        
        if (product.quantity < 0) {
            return res.status(400).json({ message: 'Stock cannot go below zero' });
        }
        
        await product.save();
        res.status(200).json({ message: 'Stock updated', product });
    } catch (error) {
        next(error);
    }
};