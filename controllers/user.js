const User= require("../models/user.js");
const _=require("lodash") //provides methods to make changes to a json object 
const formidable=require("formidable")
const fs=require('fs') //for file system


exports.userById=(req,res,next,id)=>{
User.findById(id)
.populate('following','_id name')
.populate('followers','_id name')
.exec((err,user)=>{

if(err || !user){
	return res.status(400).json({
		error:"No User"
	})
}

req.profile=user;   //add profile object in request with user info
next();

})
   
} 

exports.userPhoto=(req,res,next)=>{
console.log("Call hua ab")
if(req.profile.photo.data){
	res.set(("Content-Type",req.profile.photo.contentType))
   return res.send(req.profile.photo.data)
}
next();
}


exports.hasAuthorization=(req,res,next)=>{
console.log(req.profile._id);
console.log(req.auth._id);
req.auth._id=req.auth._id.toString();
req.profile._id=req.profile._id.toString();
	const Authorized=req.auth && req.profile && req.profile._id==req.auth._id
    console.log(req.auth);
console.log(req.profile);

    if(!Authorized){
    	res.status(400).json({
    		error:"User cant perform this action"
    	})
    }
if(Authorized){
next();}
}

exports.allUsers=(req,res)=>{

	User.find((err,users)=>{
		if(err){
			res.json({
				error:err
			})
		}
	res.json(users);
	}).select("name email created updated")

}
exports.getUser=(req,res)=>{
  req.profile.hashed_password=undefined;
  req.profile.salt=undefined;
  return res.json(req.profile);

}

exports.updateUser=(req,res)=>{
let form=new formidable.IncomingForm()
form.keepExtensions=true
form.parse(req,(err,fields,files)=>{
	if(err){
		return res.status(400).json({
			error:"Photo cant be uploaded"
		})
	}
	let user=req.profile
	user=_.extend(user,fields)
	if(files.photo){
		user.photo.data=fs.readFileSync(files.photo.path)
		user.photo.contentType =files.photo.type
	}
	user.save((err,result)=>{
    if(err){
    	return res.status(400).json({
    		error:err
    	})
    }
  user.hashed_password=undefined
  user.salt=undefined
  res.json({user})  //sends updated user in response

	})
})
}





// exports.updateUser=(req,res)=>{

// let user=req.profile//req.profile filled when user makes any req to users/:userID by fn getById
// user=_.extend(user,req.body) //it updates json var user with req.body that is when update req. is made with user typing updated json in body(like in postman) 
// //extend is a method of lodash 
// user.updated=Date.now();
// user.save((err)=>{
// 	if(err){
// 		return res.status(404).json({error:"You are not authorized mc"})
// 	}
// 	user.hashed_password=undefined;
// 	user.salt=undefined;
// 	res.json({user})

// })
// }

exports.deleteUser=(req,res)=>{

let user=req.profile
user.remove((err,user)=>{
	if(err){
		return res.status(401).json({error:"You are not authorized mc"})
	}
	
	res.json({message:"user deleted"})

})


}
////Followers and following
exports.addFollowing=(req,res,next)=>{

User.findByIdAndUpdate(req.body.userId,{$push:{following:req.body.followId}},(err,res)=>{
if(err){
	return res.status(400).json({
		error:err
	})
}
next(); //addFollower called next

}) 
}

//Finds User with req.body.userId sent by client(FIND) and updates following in that User and add id of person who followed(UPDATE) 

exports.addFollower=(req,res,next)=>{
//Find id by person you want to follow,update his followers list,new:true for updating mongo
User.findByIdAndUpdate(req.body.followId,{$push:{followers:req.body.userId}},
	{new:true}
)
.populate("following","_id name")
.populate("followers","_id name")
.exec((err,result)=>{
if(err){
	return res.status(400).json({
		error:err
	})
}
result.hashed_password=undefined
result.salt=undefined
res.json({result})
})

}



exports.remFollowing=(req,res,next)=>{

User.findByIdAndUpdate(req.body.userId,{$pull:{following:req.body.unfollowId}},(err,res)=>{
if(err){
	return res.status(400).json({
		error:err
	})
}
next(); //remFollower called next

}) 
}

//Finds User with req.body.userId sent by client(FIND) and updates following in that User and add id of person who followed(UPDATE) 

exports.remFollower=(req,res,next)=>{
//Find id by person you want to follow,update his followers list,new:true for updating mongo
User.findByIdAndUpdate(req.body.unfollowId,{$pull:{followers:req.body.userId}},
{new:true}).populate("following","_id name")
.populate("followers","_id name")
.exec((err,result)=>{
if(err){
	return res.status(400).json({
		error:err
	})
}
result.hashed_password=undefined
result.salt=undefined
res.json({result})
})

}

exports.findPeople=(req,res)=>{
let following=req.profile.following //users he is following
following.push(req.profile._id) //add user himself so he cant have option to follow himself
User.find({_id:{$nin:following}},(err,users)=>{
	if(err){
		return res.status(400).json({
			error:err
		})
	}
res.json(users)
}).select("name")


}