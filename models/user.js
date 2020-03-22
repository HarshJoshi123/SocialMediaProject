const mongoose=require('mongoose');
const uuidv1= require('uuid/v1');
const crypto=require('crypto');
const {ObjectId}=mongoose.Schema
const userSchema=new mongoose.Schema({

 name:{
    type:String,
    trim:true,
    required:true

 },
 email:{
 	type:String,
 	trim:true,
 	required:true
 },
 hashed_password:{
 	type:String,
 	required:true
 },
 salt:String,
 created:{
 	type:Date,
 	default:Date.now
 },
 updated:Date,
 photo:{
  data:Buffer,
  contentType:String
 },
 about:{
  type:String,
  trim:true
 },
 followers: [{type:ObjectId,ref:"User"}],
 following: [{type:ObjectId,ref:"User"}]

});    //6 Attributes of User


userSchema
.virtual('password')
.set(function(password){
    //password not actually stored in database but in indirect way with key so it is virtual
    this._password=password; //temporary var _password
    this.salt=uuidv1();    //generate random code
    this.hashed_password=this.encryptPassword(password) ;//encryptpassword method of schema hence this. is used
})
.get(function(){
    return this._password;
});


userSchema.methods = {

          authenticate: function(plainText){
 
  return this.encryptPassword(plainText)===this.hashed_password //We will encrypt password entered by user and compare with actual password of user
   },
      encryptPassword:function(password){  //Schema can store functions as well
        
                if(!password){
                    return "hhhhhhh";
                }
                try{ //console.log(this.salt); 
                    //console.log("BROO");
                   return  crypto.createHmac('sha1',this.salt) 
                            .update(password)
                            .digest("hex"); //sha1 is method of enc,this.salt is code,hex is hexadecimal
                                   //result is encrypted password stored in hashed_password attribute
                }
                catch(err){
                    console.log(err);
                	return "" ;
                }
	

}};
module.exports=mongoose.model("User",userSchema);

/* 
 1. Virtual fields are additional field for a given model
 2.their val can be automatically or manually set
 3.Their values dont persist in database
 4.they only exist logically and not on database
 */