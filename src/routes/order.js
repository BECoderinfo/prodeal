const express = require('express');

const { createOrder, acceptOrder, cancelOrder, getOrderById, getAllOrders, getTodayOrders, rejectOrder, getPendingOrders, getCompletedOrders, pendingComplete,dailyOrderIncrease  } = require('../controllers/orderController');


const orderRouter = express.Router();

//order routes

orderRouter.post("/create", createOrder);
orderRouter.put("/accept/:id", acceptOrder);
orderRouter.put("/cancel/:id", cancelOrder);
orderRouter.get("/:id", getOrderById);
orderRouter.post("/all", getAllOrders);
orderRouter.post("/today", getTodayOrders);
orderRouter.put("/reject/:id", rejectOrder);
orderRouter.get("/pending", getPendingOrders);
orderRouter.put("/complete/:id", pendingComplete);
orderRouter.post("/completed/:businessId", getCompletedOrders);
orderRouter.post("/increase", dailyOrderIncrease);



 

module.exports = orderRouter;