const express = require('express');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage()})


const { userRegister,userLogin, userProfileUpdate, userImageUpload, getAllUsers, sequre, OTPverify, resendOTP, forgetPassword, userPasswordUpdate, getUserById} = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login",userLogin);
userRouter.put("/update/:id",upload.single('image'), userProfileUpdate);
userRouter.post("/upload/:id",upload.single('image'),userImageUpload);
userRouter.get("/alluser", getAllUsers);
userRouter.get("/get/:id", getUserById);
userRouter.post("/verify", OTPverify);
userRouter.post("/resendOTP/:email", resendOTP);
userRouter.post("/forget/:email", forgetPassword);
userRouter.put("/password", userPasswordUpdate);
userRouter.get("/sequre", sequre);

module.exports = userRouter;
