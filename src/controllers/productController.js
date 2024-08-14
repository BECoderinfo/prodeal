const express = require('express');
const product = require('../models/product');
const multer = require('multer');
const business = require('../models/business');
const upload = multer({ storage: multer.memoryStorage() });

// product controllers


// insert product
const insertProduct = async (req, res) => {

    let image = req.file;
    const { businessId, productName, productDescription, productPrice, quantity, category } = req.body;

    if (!businessId || !productName || !productDescription || !productPrice || !quantity || !image || !category) {
        return res.status(400).json({ error: 'Please provide all the required fields' });
    }
   
    if (image.buffer) {
        image = image.buffer;
    }

    try {
        const newProduct = new product({ businessId, productName, productDescription, productPrice, quantity, image, category });
        await newProduct.save();
        return res.status(200).json({ message: 'Product added successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to add product' });
    }
};

// update product
const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const { productName, productDescription, productPrice, quantity, image, category } = req.body;

    try {
        const updatedProduct = await product.findByIdAndUpdate(productId, { productName, productDescription, productPrice, quantity, image, category }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to update product' });
    }
};

// update stoke quantity
const updateQuantity = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!productId || !quantity) {
        return res.status(400).json({ error: 'Please provide all the required fields' });
    }
    try {
        const updatedProduct = await product.findByIdAndUpdate(productId, { quantity }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product quantity updated successfully', product: updatedProduct });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to update product quantity' });
    }
};

// delete product
const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const deletedProduct = await product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to delete product' });
    }
};

// get all products with offer
const getProducts = async (req, res) => {
    try {
        const products = await product.aggregate([
            { $match: {} },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'offers',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'offers'
                }
            }
        ]);
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get products' });
    }
};


//get products by business id
const getProductsByBusinessId = async (req, res) => {
    const { businessId } = req.params;
    try {
        const products = await product.find({ businessId });
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get products' });
    }
};

// get products by category
const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await product.find({ category });
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get products' });
    }
};

// get products by name
const getProductsByName = async (req, res) => {
    const { name, limit = 10, page = 1 } = req.params;
    const skip = (page - 1) * limit;

    try {
        if (name) {
            const regex = new RegExp(escapeRegExp(name), 'i');
            const products = await product.find({ productName: { $regex: regex } }).limit(limit).skip(skip);
            return res.status(200).json(products);
        } else {
            return res.status(400).json({ error: 'Product name is required' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to get products' });
    }
};

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const search = async (req, res) => {

    const search = req.params.search;
    const { category, bussinessName, price } = req.body;

    try {
        let query = {};
        if (search) {
            query = { $or: [{ productName: { $regex: new RegExp(search, 'i') } }] };
        }
        if (category) {
            query.category = category;
        }
        if (price) {
            const [min, max] = price.split('-');
            query.productPrice = { $gte: parseInt(min), $lte: parseInt(max) };
        }

        let products = await product.find(query);

        if (products == 0) {

            console.log(search);
            products = await business.find({ businessName: { $regex: new RegExp(search, 'i') } });

        }

        return res.status(200).json(products);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to get products' });
    }
};

module.exports = {
    getProducts,
    insertProduct,
    getProductsByBusinessId,
    updateProduct,
    updateQuantity,
    getProductsByCategory,
    getProductsByName,
    deleteProduct,
    search
};