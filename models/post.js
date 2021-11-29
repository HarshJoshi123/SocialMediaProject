const mongoose=require('mongoose');
//Design basic schema of attributes(title and body) of json to be stored  
const {ObjectId}=mongoose.Schema
console.log(typeof(ObjectId));
const postSchema=new mongoose.Schema({
	title:{
		type:String,	
	},
	body:{
		type:String,
	},
	photo:{
		data:Buffer,        //Reserve space for image file which is Buffer
	    contenType:String
	},	
	postedBy:{
		type:ObjectId,         //type object of collection User-
		ref:"User"             
	},
	created:{
		type:Date,
		default:Date.now
	},
	updated:Date,
	likes: [{type:ObjectId,ref:"User"}], //array of type ._id of user
    comments:[{
    	text:String,
    	created: { type:Date,default:Date.now()},
    	postedBy: { type:ObjectId,ref:"User"}	
    }]   //array of comment is comments ,comment will have 3 subpart text,postedBy and created
});          //**only comments here has multiple attributes hence no type is mentioned
module.exports=mongoose.model("Post",postSchema); //Name of collection is Post and model creates a document with schema object