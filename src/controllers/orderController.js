const Order = require('../models/order');
const User = require('../models/users');
const Product = require('../models/product');
const Promocode = require('../models/promocode');


// const createOrder = async (req, res) => {
//     try {
//         const { userId, orderItems, businessId } = req.body;
//         const  promocode  = req.body.promocode;

//         if (!userId || !businessId || !orderItems){
//             return res.status(400).json({ error: 'userId, businessId, and orderItems are required' });
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         let discount = 0;
        
//         if (promocode) {
//             const promo = await Promocode.findOne({promocode : promocode});
//             if (promo) {
//                 const alreadyUsed = await Order.findOne({ promocode, userId });
//                 if (alreadyUsed) {
//                     return res.status(400).json({ error: 'Promocode already used' });
//                 }
//                 // discount = promo.discount; 
//                 if (promo.discountType === 'Percentage') {
//                     discount = (promo.discount / 100) * promo.neededAmount;
//                 } else {
//                     discount = promo.discount;
//                 }
                
//             } else {
//                 return res.status(400).json({ error: 'Invalid or inactive promocode' });
//             }
//         }

//         const orderItemsWithPrice = await Promise.all(orderItems.map(async (item) => {
//             const product = await Product.findById(item.product);

//             if (!product) {
//                 throw new Error('Product not found');
//             }

//             if (isNaN(item.quantity) || isNaN(product.productPrice)) {
//                 throw new Error('Invalid quantity or price');
//             }

//             const total = item.quantity * product.productPrice;
//             return {
//                 ...item,
//                 price: product.productPrice,
//                 total
//             };
//         }));

//         const total = orderItemsWithPrice.reduce((acc, item) => acc + item.total, 0);
//         let finalPrice;

//         if(discount){
//              finalPrice = total - discount;
//         }else{
//             finalPrice = total;
//         }
        
//         if (finalPrice < 0){
//             return res.status(400).json({ error: 'Final price cannot be negative' });
//         }

//         const order = new Order({
//             userId,
//             businessId,
//             orderItems: orderItemsWithPrice,
//             promocode,
//             totalPrice: finalPrice,
//         });

//         await order.save();

//         return res.status(201).json({ message: 'Order created successfully', order });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: error.message || 'Error creating order' });
//     }
//  };

const createOrder = async (req, res) => {
    try {
        const { userId, orderItems, businessId } = req.body;
        const promocode = req.body.promocode;

        if (!userId || !businessId || !orderItems) {
            return res.status(400).json({ error: 'userId, businessId, and orderItems are required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let discount = 0;

        if (promocode) {
            const promo = await Promocode.findOne({ promocode: promocode });
            if (promo) {
                const alreadyUsed = await Order.findOne({ promocode, userId });
                if (alreadyUsed) {
                    return res.status(400).json({ error: 'Promocode already used' });
                }
                // discount = promo.discount; 
                if (promo.discountType === 'Percentage') {
                    discount = (promo.discount / 100) * promo.neededAmount;
                } else {
                    discount = promo.discount;
                }

            } else {
                return res.status(400).json({ error: 'Invalid or inactive promocode' });
            }
        }

        let offerprice = 0;

        if (offerprice) {
            const offer = await Offer.findOne({ offerId: offerprice });
            if (offer) {
                if (offer.offertype === 'Percentage') {
                    offerprice = (offer.offerprice / 100) * offer.neededAmount;
                } else {
                    offerprice = offer.offerprice;
                }

            } else {
                return res.status(400).json({ error: 'Invalid or inactive promocode' });
            }

        }

        const orderItemsWithPrice = await Promise.all(orderItems.map(async (item) => {
            const product = await Product.findById(item.product);

            if (!product) {
                throw new Error('Product not found');
            }

            if (isNaN(item.quantity) || isNaN(product.productPrice)) {
                throw new Error('Invalid quantity or price');
            }

            const total = item.quantity * product.productPrice;
            return {
                ...item,
                price: product.productPrice,
                total
            };
        }));

        const total = orderItemsWithPrice.reduce((acc, item) => acc + item.total, 0);
        let finalPrice;
        ///pose
        if (discount) {
            finalPrice = total - discount - offerprice;
        } else {
            finalPrice = total - offerprice;
        }

        if (finalPrice < 0) {
            return res.status(400).json({ error: 'Final price cannot be negative' });
        }

        const order = new Order({
            userId,
            businessId,
            orderItems: orderItemsWithPrice,
            promocode,
            totalPrice: finalPrice,
        });

        await order.save();

        return res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Error creating order' });
    }
};



const acceptOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        order.status = 'Processing';
        order.orderStatus = 'Accepted';
        await o
        rder.save();
        res.status(200).json({ message: 'Order accepted successfully', order });
    } catch (error) {
        res.status(500).json({ error: 'Error accepting order' });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        order.status = 'Cancelled';
        await order.save();
        res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        res.status(500).json({ error: 'Error cancelling order' });
    }
};

const pendingComplete = async (req, res) => {
    
    
    try {
        const { id } = req.params; 
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        order.status = 'Completed';
        await order.save();
        res.status(200).json({ message: 'Order completed successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error completing order' });
    }
}

const rejectOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        order.orderStatus = 'Rejected';
        await order.save();
        res.status(200).json({ message: 'Order rejected successfully', order });
    } catch (error) {
        res.status(500).json({ error: 'Error rejecting order' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order' });
    }
};

const getAllOrders = async (req, res) => {
    
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
}

const getTodayOrders = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const orders = await Order.find({ createdAt: { $gte: today, $lt: tomorrow } });

        const totalOrders = orders.length;

        if (orders.length === 0) {
            return res.status(404).json({ error: 'No Sales Today' });
        }
        res.status(200).json({ totalOrders,orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
}


const getPendingOrders = async (req, res) => {
    try {
        const orders = await Order.find({ orderStatus: 'Pending' });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
}

const getCompletedOrders = async (req, res) => {
    try {
        const businessId = req.params.businessId;
        
        if (!businessId) {
            return res.status(400).json({ error: 'Business ID is required' });
        }         
        const orders = await Order.find({ status: 'Completed', businessId });
        const totalOrders = orders.length;

        res.status(200).json({ totalOrders, orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
}


const dailyOrderIncrease = async (req, res) => {
    try {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
    
        // Fetch today's orders
        const todayOrderCount = await Order.countDocuments({
          status: 'Completed', 
          createdAt: {
            $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
          }
        });
    
        // Fetch yesterday's orders
        const yesterdayOrderCount = await Order.countDocuments({
          status: 'Completed',
          createdAt: {
            $gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
            $lt: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1)
          }
        });
    
        let percentageIncrease = 0;   
       
        if (yesterdayOrderCount === 0) {
          if (todayOrderCount > 0) {
            percentageIncrease = 100; //
          }
        } else {
          percentageIncrease = ((todayOrderCount - yesterdayOrderCount) / yesterdayOrderCount) * 100;
        }
    
        res.status(200).json({ percentageIncrease });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error calculating daily order increment' });
      }
  };

module.exports = {
    createOrder,
    acceptOrder,
    cancelOrder,
    getOrderById,
    getAllOrders,
    getTodayOrders,
    rejectOrder,
    getPendingOrders,
    getCompletedOrders,
    pendingComplete,
    dailyOrderIncrease
};