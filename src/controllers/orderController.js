const Order = require('../models/order');
const User = require('../models/users');
const Promocode = require('../models/promocode');
const Offer = require('../models/offer');

const createOrder = async (req, res) => {
    try {
        const { userId, businessId, offerId, quantity, promocode } = req.body;

        let offerprice = req.body.offerprice

        if (!userId || !businessId || !offerId) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const offer = await Offer.findById(offerId);
        
        offerprice = (offer.paymentAmount);
        
        const total = quantity * offerprice;

        let discount = 0;

        if (promocode) {
            const promo = await Promocode.findOne({ promocode: promocode });
            console.log(promo);

            if (promo) {
                if (promo.neededAmount <= total) {
                    const alreadyUsed = await Order.findOne({ promocode, userId });
                    if (alreadyUsed) {
                        return res.status(400).json({ error: 'Promocode already used' });
                    }
                    if (promo.discountType === 'Percentage') {
                        discount = (promo.discount / 100) * total;
                    } else {
                        discount = promo.discount;
                    }
                }
                else {
                    return res.status(400).json({ error: 'This promocode cannot be applied' });
                }
            } else {
                return res.status(400).json({ error: 'Invalid or inactive promocode' });
            }
        }        

        let finalPrice;
        // Calculate final price
        if (promocode) {
            finalPrice = total - discount;
        }
        else {
            finalPrice = total;
        }

        // Create and save the order
        const order = new Order({
            userId,
            businessId,
            offerId,
            promocode,
            offerprice,
            discount,
            quantity,
            totalPrice: finalPrice,
        });

        await order.save();

        return res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error('Error creating order:', error);
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
        await order.save();
        res.status(200).json({ message: 'Order accepted successfully', order });
    } catch (error) {
        res.status(500).json({ error: error });
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

        if (order.orderStatus === 'Accepted') {
            order.status = 'Completed';
            await order.save(); 

            res.status(200).json({ message: 'Order completed successfully', order });
        } else {
            res.status(400).json({ error: 'Order not in accepted state' });
        }
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
    console.log('byid');

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
        const business = req.params.businessId;

        if (!business) {
            return res.status(400).json({ error: 'Business ID is required' });
        }

        const orders = await Order.find({ status: 'Pending' })
                                  .populate({
                                      path: 'offerId',
                                      match: { businessId: business }
                                  });

        const filteredOrders = orders.filter(order => order.offerId !== null);

        const totalOrders = filteredOrders.length;

        res.status(200).json({ totalOrders, orders: filteredOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getCompletedOrders = async (req, res) => {
    try {
        const business = req.params.businessId;
        
        if (!business) {
            return res.status(400).json({ error: 'Business ID is required' });
        }

        const orders = await Order.find({ status: 'Completed' })
                                  .populate({
                                      path: 'offerId',
                                      match: { businessId: business }
                                  });

        const filteredOrders = orders.filter(order => order.offerId !== null);

        const totalOrders = filteredOrders.length;

        res.status(200).json({ totalOrders, orders: filteredOrders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
}

const getAcceptedOrders = async (req, res) => {
    try {
        const business = req.params.businessId;
        
        if (!business) {
            return res.status(400).json({ error: 'Business ID is required' });
        }

        const orders = await Order.find({orderStatus: 'Accepted', status: 'Pending'})
                                  .populate({
                                      path: 'offerId',
                                      match: { businessId: business }
                                  });

        const filteredOrders = orders.filter(order => order.offerId !== null);

        const totalOrders = filteredOrders.length;

        res.status(200).json({ totalOrders, orders: filteredOrders });
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
    getAcceptedOrders,
    pendingComplete,
    dailyOrderIncrease
};