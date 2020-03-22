const express=require('express');
const router=express.Router();
const {userById,findPeople,allUsers,getUser,updateUser,deleteUser,hasAuthorization,userPhoto,addFollowing,addFollower,remFollower,remFollowing}=require('../controllers/user');
const { requireSignin }=require('../controllers/auth');


router.put("/user/follow",requireSignin,addFollowing,addFollower)
router.put("/user/unfollow",requireSignin,remFollowing,remFollower)

router.get("/users",allUsers);
//any route containing userId,userById will be executed first
router.get('/user/findpeople/:userId',requireSignin,findPeople)
router.get("/user/:userId",requireSignin,getUser)  //userId is used here hence userById is executed 
router.get("/user/photo/:userId",userPhoto)
router.put("/user/:userId",requireSignin,updateUser);//to update we use put
router.delete("/user/:userId",requireSignin,deleteUser);
router.param("userId",userById);
module.exports=router;