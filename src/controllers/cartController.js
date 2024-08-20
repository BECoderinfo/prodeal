const CartItem = require('../models/cart');

const insertCartItem  = async (req, res, next) => {
    try {
        const { user, items } = req.body;
        if (!user || !items) {
            return res.status(400).json({ error: "User, items are required" });
        }

        const cart = await CartItem.findOne({"items.offer": items.offer, user: user});
        if (cart) {
            return res.status(400).json({ error: "Cart already exists" });
        }

        const cartItem = new CartItem({ user, items});

        await cartItem.save();
        res.status(201).json({message : 'Cart item added successfully', cartItem});

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//get user cart

const getUserCart = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const cart = await CartItem.find({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }   
        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
    }
};



module.exports = {insertCartItem, getUserCart, deleteCartItem };