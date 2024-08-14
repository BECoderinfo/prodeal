const express = require('express');
const CartItem = require('../models/cart');

const insertCartItem  = async (req, res, next) => {
    try {
        const { user, items, quantity } = req.body;

        
        if (!user || !items || items.length === 0 || quantity === undefined) {
            return res.status(400).json({ error: "User, items, and quantity are required" });
        }

        const cartItem = new CartItem({ user, items, quantity });

        await cartItem.save();
        res.status(201).json(cartItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateCartItem   = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { items, quantity } = req.body;

        const cartItem = await CartItem.findById(id);

        if (!cartItem) {
            return res.status(404).json({ error: "CartItem not found" });
        }

        // Update fields only if they are provided in the request body
        if (items) cartItem.items = items;
        if (quantity !== undefined) cartItem.quantity = quantity;

        await cartItem.save();
        res.status(200).json(cartItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


const deleteCartItem   = async (req, res, next) => {
    const cartId = req.params.id;
    try {
        const cart = await CartItem.findByIdAndDelete(cartId);
       
        if (!cart) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.status(200).json({ message: 'Cart item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



module.exports = {insertCartItem,updateCartItem,deleteCartItem };