const express = require('express');
const RequestBusiness = require('../models/requestBusiness');
const Business = require('../models/business');
const User = require('../models/users');
const Order = require('../models/order');



const insertRequestBusiness = async (req, res, next) => {
  try {
    const { businessName, contactNumber, userId } = req.body;
    if (!businessName || !contactNumber || !userId) {
      return res.status(400).json({ error: 'businessName, contactNumber, and userId are required' });
    }

    const requestBusiness = new RequestBusiness({
      businessName,
      contactNumber,
      userId,
    });

    await requestBusiness.save();
    res.status(201).json({ message: 'Business Request created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating request business' });
  }
};

const getAllRequestBusinesses = async (req, res) => {
  try {
    const requestBusinesses = await RequestBusiness.find().populate('userId');
    res.status(200).json(requestBusinesses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching request businesses' });
  }
};

const acceptBusinessRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const requestBusiness = await RequestBusiness.findById(id);
    if (!requestBusiness) {
      return res.status(404).json({ error: 'Request business not found' });
    }

    const user = await User.findByIdAndUpdate(
      requestBusiness.userId,
      { isBusiness: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await RequestBusiness.findByIdAndDelete(id);

    res.status(201).json({ message: 'Business created successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating business' });
  }
};

const rejectBusinessRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const requestBusiness = await RequestBusiness.findByIdAndDelete(id);
    if (!requestBusiness) {
      return res.status(404).json({ error: 'Request business not found' });
    }
    res.status(200).json({ message: 'Request business deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting request business' });
  }
};

const createBusiness = async (req, res) => {
  try {
    const {
      userId,
      businessName,
      contactNumber,
      address,
      landmark,
      state,
      city,
      pincode,
      location,
      telephone,
      businessEmailId,
      businessWebsite,
      category
    } = req.body;

    // Check if any required field is missing
    if (!userId || !businessName || !contactNumber || !address || !state || !city || !pincode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate other fields as needed

    // Check if the user exists and is a business person
    const user = await User.findById(userId);
    if (!user || !user.isBusiness) {
      return res.status(400).json({ error: 'User does not exist or is not a business person' });
    }

    // Create a new business object and save it
    const business = new Business({
      userId,
      businessName,
      contactNumber,
      address,
      landmark,
      state,
      city,
      pincode,
      location,
      telephone,
      businessEmailId,
      businessWebsite,
      category
    });
    await business.save();

    res.status(201).json({ message: 'Business created successfully', business });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating business' }); 
  }
};

// Get a business by ID
const getBusinessById = async (req, res) => {
  try {
      const business = await Business.findById(req.params.id).populate('userId');
      if (!business) {
          return res.status(404).json({ error: 'Business not found' });
      }
      res.status(200).json(business);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching business' });
  }
};

// Update a business by ID
const updateBusinessById = async (req, res) => {
  try {
      const business = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!business) {
          return res.status(404).json({ error: 'Business not found' });
      }
      res.status(200).json({ message: 'Business updated successfully', business });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating business' });
  }
};

// Delete a business by ID
const deleteBusinessById = async (req, res) => {
  try {
      const business = await Business.findByIdAndDelete(req.params.id);
      if (!business) {
          return res.status(404).json({ error: 'Business not found' });
      }
      res.status(200).json({ message: 'Business deleted successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error deleting business' });
  }
};

// Get all businesses
const getAllBusinesses = async (req, res) => {
  try {
      const businesses = await Business.find().populate('userId');
      res.status(200).json(businesses);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching businesses' });
  }
};

const weeklySales = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 6);
    const orders = await Order.find({ createdAt: { $gte: startOfWeek, $lte: endOfWeek }, status: 'Completed' });
    const total = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const totalOrder = orders.length;
    res.status(200).json({ totalWeeklySales: total, totalWeeklyOrders: totalOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching weekly sales' });
  }
}

//total earnings from completed orders
const totalEarnings = async (req, res) => {
  
  try {
    const orders = await Order.find({ status: 'Completed' });
    const total = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    res.status(200).json({ totalEarnings: total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error calculating total earnings' });
  }
}

//Upload Menuimage
const UploadMenuImage = async (req, res) => {
  try {
    const menuImage = req.file;
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    business.menuImages.push({ data: menuImage.buffer, contentType: menuImage.mimetype });
    await business.save();
    res.status(200).json({ message: 'Menu image uploaded successfully', business });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error uploading menu image' });
  }
};

//Upload store image

const UploadStoreImage = async (req, res) => {
  try {
    const storeImage = req.file;
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    business.storeImages.push({ data: storeImage.buffer, contentType: storeImage.mimetype });
    await business.save();
    res.status(200).json({ message: 'Store image uploaded successfully', business });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error uploading store image' });
  }
 
};


const UploadMainImage = async (req, res) => {
    try {
      const mainImage = req.file;
      const business = await Business.findById(req.params.id);

        if (!business) {
            return res.status(404).json({ error: 'Business not found' });
        }
        business.mainImage = { data: mainImage.buffer, contentType: mainImage.mimetype };
        await business.save();
        res.status(200).json({ message: 'Main image uploaded successfully', business });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error uploading main image' });
    }
};


const WateridentyUpload = async (req, res) => {

  try {
    const waterIdImage = req.file;
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    business.waterIdImage = { data: waterIdImage.buffer, contentType: waterIdImage.mimetype };
    console.log();
    
    await business.save();
    res.status(200).json({ message: 'waterId image uploaded successfully', business });
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: 'Error uploading waterId image'});
  }
};

const GovermentIdUpload = async (req, res) => {
 
  try {
    const govermentIdImage = req.file;
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    business.govermentIdImage = { data: govermentIdImage.buffer, contentType: govermentIdImage.mimetype };
    await business.save();
    res.status(200).json({ message: 'govermentId image uploaded successfully', business });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error uploading govermentId image' });
  }
};


module.exports = { insertRequestBusiness,createBusiness,
  getBusinessById,
  updateBusinessById,
  deleteBusinessById,
  getAllBusinesses,
  getAllRequestBusinesses,
  acceptBusinessRequest,
  rejectBusinessRequest,
  totalEarnings,
  weeklySales,
  UploadMenuImage,
  UploadStoreImage,
  UploadMainImage,
  WateridentyUpload,
  GovermentIdUpload
};