//exports.PostRoutes=(req,res)=>{
//	res.send("Nice Place Nigga");
//console.log("After MyOwnMiddleware");
//}
//to directly export fn
const { userById,hasAuthorization } =require('../controllers/user.js')
const express=require('express');
const {uncomment,comment,like,unlike,singlePost,postbyId,deletePost,updatePost,getPosts,postByUser,photo,createPost,isPost}=require('../controllers/post'); //It has actual functions that gives response to requests
const { requireSignin }=require('../controllers/auth');
const router=express.Router();
const validator=require('../validators/index');  //Validator files has validation fn that checks for validity

//If user doesnt have token,requiresignin middleware wont allow it to complete request

//post/like and post/unlike comes before post/:postId then post/like is executed first
router.put("/post/like",requireSignin,like);
router.put("/post/unlike",requireSignin,unlike);

router.put("/post/comment",requireSignin,comment);
router.put("/post/uncomment",requireSignin,uncomment);

router.get("/posts",getPosts); //routed to function in controllers files
router.post("/post/new/:userId",requireSignin,hasAuthorization,createPost);  //**First validator.fn is handled then postcontroller fn
router.get("/post/by/:userId",requireSignin,postByUser)                                                                               //if validator fn generates error then postcontroller fn not performed
router.get("/post/:postId",singlePost)                                                                               //if validator fn generates error then postcontroller fn not performed

router.put("/post/:postId",requireSignin,isPost,updatePost);

//validator shifted to last as formidable package in create post should run first

router.delete("/post/:postId",requireSignin,isPost,deletePost);
//REMEMBER delete request is to delete a document (not just a part of document )
router.get("/post/photo/:postId",photo)

//any route containing :userID,first userById function is executed,add user info in profile object
router.param("userId",userById);
router.param("postId",postbyId);
module.exports=router;