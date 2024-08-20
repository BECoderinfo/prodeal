const express = require('express');

const { createOrder, acceptOrder, cancelOrder, getOrderById, getAllOrders, getTodayOrders, rejectOrder, getPendingOrders, getCompletedOrders, pendingComplete,dailyOrderIncrease, getAcceptedOrders  } = require('../controllers/orderController');


const orderRouter = express.Router();

//order routes

orderRouter.post("/create", createOrder);
orderRouter.put("/accept/:id", acceptOrder);
orderRouter.put("/cancel/:id", cancelOrder);
orderRouter.get("/get/:id", getOrderById);
orderRouter.post("/all", getAllOrders);
orderRouter.post("/today", getTodayOrders);
orderRouter.put("/reject/:id", rejectOrder);
orderRouter.get("/pending/:businessId", getPendingOrders);
orderRouter.put("/complete/:id", pendingComplete);
orderRouter.post("/completed/:businessId", getCompletedOrders);
orderRouter.get("/accepted/:businessId", getAcceptedOrders);
orderRouter.post("/increase", dailyOrderIncrease);

module.exports = orderRouter;