const express = require('express');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage()})

const { insertRequestBusiness, createBusiness, getBusinessById, updateBusinessById, deleteBusinessById, getAllBusinesses, getAllRequestBusinesses, acceptBusinessRequest, rejectBusinessRequest, totalEarnings, UploadMenuImage, UploadStoreImage, UploadMainImage,WateridentyUpload,GovermentIdUpload, SalesData} = require('../controllers/BusinessController');


const businessRouter = express.Router();



businessRouter.post("/register", insertRequestBusiness);
businessRouter.post("/create", createBusiness);
businessRouter.get("/get/:id", getBusinessById);
businessRouter.put("/update/:id", updateBusinessById);
businessRouter.delete("/delete/:id", deleteBusinessById);
businessRouter.get("/getAll", getAllBusinesses);
businessRouter.get("/getAllRequest", getAllRequestBusinesses);
businessRouter.put("/accept/:id", acceptBusinessRequest);
businessRouter.delete("/reject/:id", rejectBusinessRequest);
businessRouter.get("/totalEarnings", totalEarnings);
businessRouter.post("/menuImage/:id",upload.single('menuImage'), UploadMenuImage);
businessRouter.post("/storeImage/:id",upload.single('storeImage'), UploadStoreImage);
businessRouter.post("/mainImage/:id",upload.single('mainImage'), UploadMainImage);
businessRouter.post("/waterIdImage/:id",upload.single('waterIdImage'), WateridentyUpload);
businessRouter.post("/govermentIdImage/:id",upload.single('govermentIdImage'), GovermentIdUpload);
businessRouter.get("/salesData/:key", SalesData);



module.exports = businessRouter;