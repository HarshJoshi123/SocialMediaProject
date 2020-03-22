const express=require('express');
const { signup,signin,signout,forgotPassword,resetPassword }=require('../controllers/auth.js');
const { userSignupValidator,passwordResetValidator } =require('../validators/index.js')
const { userById } =require('../controllers/user.js')

const router=express.Router();  //router object made to handle routing

router.post("/signup",userSignupValidator,signup);  //**First validator.fn is handled then postcontroller fn
router.post("/signin",signin);                                                                               //if validator fn generates error then postcontroller fn not performed
router.get("/signout",signout); //router.get("/",(req,res)=>{res.send("Laudo");}); //ALSO WORKS
router.put("/forgot-password", forgotPassword);
router.put("/reset-password",resetPassword);

//any route containing :userID,first userById function is executed   
router.param("userId",userById)
module.exports=router;