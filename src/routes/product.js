const express = require('express');
const multer = require('multer');

const { insertProduct, getProducts ,getProductsByBusinessId ,updateProduct ,updateQuantity ,getProductsByCategory ,getProductsByName,deleteProduct,  search } = require('../controllers/productController');

const upload = multer({ storage: multer.memoryStorage()})


const productRouter = express.Router();

//product routes

productRouter.post("/add",upload.single('image'), insertProduct);
productRouter.get("/get", getProducts);
productRouter.get("/:businessId", getProductsByBusinessId);
productRouter.put("/:id", updateProduct);
productRouter.put("/quantity/:id", updateQuantity);
productRouter.get("/category/:category", getProductsByCategory);
productRouter.get("/name/:name", getProductsByName);
productRouter.delete("/:productId", deleteProduct);
productRouter.get("/search/:search", search);
// productRouter.post("/rating", createRating);


module.exports = productRouter;