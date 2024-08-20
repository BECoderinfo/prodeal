const express = require('express');

const { createStaff,getAllStaff, getStaffById, updateStaff, deleteStaff } = require('../controllers/staffController');

const staffRouter = express.Router();

// CRUD routes
staffRouter.post('/add', createStaff);
staffRouter.get('/get', getAllStaff);
staffRouter.get('/get/:uid', getStaffById);
staffRouter.put('/update/:id', updateStaff);
staffRouter.delete('/delete/:id', deleteStaff);

module.exports = staffRouter;
