const Banner = require('../models/banner');
const mongoose = require('mongoose');


// Insert Banner
const insertBanner = async (req, res) => {
    let image = req.file;
    const { offerId } = req.body;
    if (!image || !offerId) {
        return res.status(400).json({ error: 'Please provide all the required fields' });
    }
    if (image.buffer) {
        image = image.buffer;
    }
    try {
        const newBanner = new Banner({ image, offerId });
        await newBanner.save();
        return res.status(200).json({ message: 'Banner added successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to add banner' });
    }
};

//get all banners
const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find().populate('offerId').populate({ 
            path: 'offerId',
            populate: {
              path: 'productId',
              model: 'ProductItem'
            } 
         });
        return res.status(200).json({ banners });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get banners' });
    }
};  


//get banner by id
const getBannerById = async (req, res) => {
    const bannerId = req.params.id;
    try {
        const banner = await Banner.findById(bannerId);
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        return res.status(200).json({ banner });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to get banner' });
    }
};


//Update Banner
const updateBanner = async (req, res) => {
    const bannerId = req.params.id;
    let { offerId, image } = req.body;
    try {
        let updatedBanner = await Banner.findById(bannerId);
        if (!updatedBanner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        if (offerId) {
            updatedBanner.offerId = offerId;
        }
        if (image) {
            if (image.buffer) {
                image = image.buffer;
            }
            updatedBanner.image = image;
        }
        updatedBanner = await updatedBanner.save();
        return res.status(200).json({ message: 'Banner updated successfully', updatedBanner });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to update banner' });
    }

};

//Delete Banner
const deleteBanner = async (req, res) => {
    const bannerId = req.params.id;
    try {
        const deletedBanner = await Banner.findByIdAndDelete(bannerId);
        if (!deletedBanner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        return res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to delete banner' });
    }
};


module.exports = { insertBanner, getAllBanners, updateBanner, deleteBanner, getBannerById };