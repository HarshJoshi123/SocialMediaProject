//This file contains functions to handle request  app.js->routes->controllers
const Post=require("../models/post");
const formidable=require('formidable');
const fs=require('fs') //for file system
const _=require("lodash") //provides methods to make changes to a json object 

exports.postbyId=(req,res,next,id)=>{

Post.findById(id)
.populate("postedBy","_id name")
.populate("comments.postedBy","_id name")
.exec((err,post)=>{ //populate is important for foreign model(when retrieving info)
if(err||!post){
	return res.status(400).json({error:err})
}
req.post=post;

console.log("postbyid chal gya");

next();
//.populate("comments","text").populate("comments.postedBy","_id name")

});



}


// exports.updatePost=(req,res)=>{
  
//   let post=req.post; //Obtained from postbyId
   
   
//    post=_.extend(post,req.body); //depends on req sent by user
//    post.updated=Date.now();
//    console.log(post);
//    post.save(err=>{
//    if(err){
//    	res.status(401).json({
//    		error:err
//    	})
//    }


//    res.json({post})

//    })        No handling of form data hence we dont use this


// }
exports.updatePost=(req,res)=>{
let form=new formidable.IncomingForm()
form.keepExtensions=true
form.parse(req,(err,fields,files)=>{
	if(err){
		return res.status(400).json({
			error:"Photo cant be uploaded"
		})
	}
	let post=req.post

	post=_.extend(post,fields)
	post.updated=Date.now();
	if(files.photo){
		post.photo.data=fs.readFileSync(files.photo.path)
		post.photo.contentType =files.photo.type
	}
	post.save((err,result)=>{
    if(err){
    	return res.status(400).json({
    		error:err
    	})
    }
  res.json(post)  //sends updated user in response

	})
})
}



exports.isPost=(req,res,next)=>{

console.log("Haha");
req.auth._id=req.auth._id.toString();
req.post.postedBy._id=req.post.postedBy._id.toString();
let isposter= req.auth && req.post && (req.post.postedBy._id==req.auth._id);

console.log(isposter);

if(!isposter){

	res.status(401).json({
		error:"User Not Authorised" //Verifies whether it is correct user 
	});
}
if(isposter){
console.log("ispost chal gya");
next();
}
}
exports.deletePost=(req,res)=>{
console.log("Post ke laude lag gye");
let post=req.post;
post.remove((err,post)=>{
	if(err){
		res.status(401).json({
			error:err
		})
	}
	res.json({
		message:"Post deleted successfully"
	})
})



}




exports.getPosts=(req,res)=>{

	//res.send("Hello Buddy from controllers");
	/*res.json({dost:"bruh",
		      son:"bruh"}); */

const posts=Post.find().populate("postedBy","_id name").populate("comments.postedBy","_id name").select("_id title body created likes").sort({created:-1})  //To read only selected attributes of documents from collection of Post
.then(posts=>{                                           //populate() used for foreign documents when reading --> gives _id and name of User in this case
res.send(posts)})                         //sort({created:-1}) sorting by created descending order 
.catch(err=> console.log(err))   //To read documents from Post which signifies Post collection		        
}

exports.createPost=(req,res,next)=>{
	let form=new formidable.IncomingForm() //works with x www encoded as front end enters info in form not raw data
	form.keepExtensions=true;
	form.parse(req,(err,fields,files)=>{  //extract fields and files from req
 		if(err){
			res.status(400).json({
				error:"Image could not be uploaded"
			})
		}

		let post=new Post(fields) //pass fields to Post from request
		post.postedBy=req.profile// ****Here postedBy takes value from req.profile which was filled by getById 
		if(files.photo){
			post.photo.data=fs.readFileSync(files.photo.path)
			post.photo.contenType=files.photo.type
		}
		post.save((err,result)=>{
			if(err){
				res.status(400).json({
					error:err
				})
			}
			res.json({result})
		})
   
  	});
	
	//console.log("CREATING POST:",req.body);
/* post.save((err,body)=>{    //post.save saves new document to mongo cluster
	if(err){
		res.status(400).json({
			error:err
		})
	}
 
 	res.status(200).json({
 		post:body
 	});
 
});   */

};
exports.postByUser=(req,res,next)=>{
	Post.find({postedBy:req.profile._id}).populate("postedBy","_id name").sort("_created").select("_id title body created likes").exec((err,posts)=>{
		if(err){
			return res.status(400).json({
				error:err
			})
		}
		res.json({posts:posts})
	})
}

exports.photo=(req,res,next)=>{
res.set("Content-type",req.post.photo.contentType)
return res.send(req.post.photo.data)


}

exports.singlePost=(req,res)=>{
return res.json(req.post); //We get req.post from postById

}

exports.like=(req,res)=>{

Post.findByIdAndUpdate(req.body.postId,{$push: {likes:req.body.userId}},{new:true}).exec((err,result)=>{
	if(err){
	res.status(400).json({error:"errrrrrrooor"})
}    
else{
	res.status(200).json(result)
}

})  //userId saved inside likes array                                                                         //new:post return newly updated post
}

exports.unlike=(req,res)=>{
Post.findByIdAndUpdate(req.body.postId,{$pull:{likes:req.body.userId}},{new:true}
).exec((err,result)=>{if(err){
	res.status(401).json({error:"errrrrrrooor"})
}    
else{
	res.json(result)
}

})  //userId saved inside likes array
     //new:true return newly updated post
}

exports.comment=(req,res)=>{

let comment=req.body.comment
comment.postedBy=req.body.userId//now comment object has 2 parts text and postedBy
Post.findByIdAndUpdate(req.body.postId,{$push:{comments:comment}},{new:true})
.populate('comments.postedBy','_id name') //only _id and name is returned hence postedBy will contain User object with _id and name attribute only
.populate('postedBy','_id name')    //postedBy(USER object) of post will contain id and name only in client
                                   //populate is important for foreign model(when retrieving info)
.exec((err,result)=>{
	if(err){
		console.log(err)
	res.status(400).json({error:err})
}    
else{
	res.status(200).json(result)
}

})


}

exports.uncomment=(req,res)=>{

let comment=req.body.comment
Post.findByIdAndUpdate(req.body.postId,{$pull: {comments:{_id:comment._id}}},{new:true})
.populate('comments.postedBy','_id name')  //it takes _id and name of User who posted comment
.populate('postedBy','_id name')             //takes _id and name of User who posted post
.exec((err,result)=>{                    //populate is important for foreign model(when retrieving info)
	if(err){
	res.status(400).json({error:"errrrrrrooor"})
}    
else{
	res.status(200).json(result)
}

})


}