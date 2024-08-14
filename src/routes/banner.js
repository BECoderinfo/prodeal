const express = require('express');
const { insertBanner, getAllBanners, updateBanner, deleteBanner, getBannerById } = require('../controllers/bannerController');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage()})

const bannerRouter = express.Router();

bannerRouter.post("/add",upload.single('image'), insertBanner);
bannerRouter.get("/getall", getAllBanners);
bannerRouter.put("/update/:id",upload.single('image'), updateBanner);
bannerRouter.delete("/delete/:id", deleteBanner);
bannerRouter.get("/get/:id", getBannerById);

module.exports = bannerRouter;


