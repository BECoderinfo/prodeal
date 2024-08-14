const express = require('express');
const Support = require('../models/Support');

const addquotation = async (req, res) => {
    try {
        const { user, quotation } = req.body;
        console.log(user, quotation);
        if (!quotation) {
            return res.status(400).json({
                success: false,
                message: 'User and quotation are required'
            });
        }
        const support = new Support({ user, quotation });
        await support.save();
        return res.status(200).json({
            success: true,
            message: 'quotation added successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }   
};

const getquotations = async (req, res) => {
    try {
        const quotations = await Support.find();
        return res.status(200).json({
            success: true,
            quotations
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deletequotation = async (req, res) => {
    try {
        const quotationId = req.params.id;
        
        await Support.findByIdAndDelete(quotationId);
        return res.status(200).json({
            success: true,
            message: 'quotation deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const giveAnswer = async (req, res) => {
    try {
        const { quotationId, answer } = req.body;
        if (!quotationId || !answer) {
            return res.status(400).json({
                success: false,
                message: 'quotation id and answer are required'
            });
        }
        const support = await Support.findById(quotationId);
        if (!support) {
            return res.status(404).json({
                success: false,
                message: 'quotation not found'
            });
        }
        support.answer = answer;
        support.status = 'Answered';
        await support.save();
        return res.status(200).json({
            success: true,
            message: 'Answer given successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// const getProductsByName = async (req, res) => {
//     const { name, limit = 10, page = 1 } = req.params;
//     const skip = (page - 1) * limit;

//     try {
//         if (name) {
//             const regex = new RegExp(escapeRegExp(name), 'i');
//             const products = await product.find({ productName: { $regex: regex } }).limit(limit).skip(skip);
//             return res.status(200).json(products);
//         } else {
//             return res.status(400).json({ error: 'Product name is required' });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ error: 'Failed to get products' });
//     }
// };

const getquotationsbyserch = async (req, res) => {
    try { 
        const { quotation, limit = 5} = req.params;
       
        if (quotation) {         
            const regex = new RegExp(escapeRegExp(quotation), 'i');
            const quotations = await Support.find({ quotation: { $regex: regex } }).limit(limit);
            return res.status(200).json(quotations);
        } else {
            return res.status(400).json({ error: 'quotation is required' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to get quotations' });
    }
};

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { addquotation , getquotations, deletequotation, giveAnswer , getquotationsbyserch};