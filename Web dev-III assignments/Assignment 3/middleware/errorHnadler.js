const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // Mongoose duplicate key error (like duplicate SKU)
    if (err.code === 11000) {
        return res.status(400).json({ message: 'Duplicate field value entered' });
    }

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
};

module.exports = errorHandler;