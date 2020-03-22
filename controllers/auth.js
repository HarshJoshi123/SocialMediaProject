const User= require("../models/user.js");
const jwt=require("jsonwebtoken");
const expressJwt=require('express-jwt'); //For protecting routes
const _=require('lodash') 
const dotenv = require("dotenv");
const sgMail=require('@sendgrid/mail');

dotenv.config();              //To import variable from .env file which is used for genrating token          
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


exports.signup=async (req,res)=>{
	try{const userExists=await User.findOne({email:req.body.email}) ;//Email will be sent in request 
	if(userExists)                                              //findone() method searches for that one document that matches given criteria
		return res.status(403).json({error:"Email is taken"});

	
const user=await new User(req.body);
await user.save();
res.status(200).json({
	user });

    }              //res to console of server
	 catch(err){
		console.log(err);
	            } 
}
exports.signin=(req,res)=>{       //Invoked when user is trying to login
	//Find user based on email
const {email,password}=req.body
User.findOne({email},(err,user)=>{
//error if user has no email
	if(err || !user){
		return res.status(401).json({
			err:"User with that email doesnt exist"
		})
	}//if user exists,authenticate
	//Generate encrypted password again and compare with stored encrypted password

if(!user.authenticate(password)){
	console.log(password);
	return res.status(401).json({
		error:"Email and password didnt match"
	})
}		

//generate a token with user id and secret Code

const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);
//persist token t in cookies with a expiry date
res.cookie("t",token,{expire:new Date()+9999});
//return response with user id and token to frontend
const {_id,name,email}=user
return res.json({token,user:{_id,email,name}});
}) //findOne function ends

	
}
exports.signout=(req,res)=>{
	console.log("Mc");
	res.clearCookie("t");
	return res.json({message:"SignOut Success"});
}

exports.requireSignin=expressJwt({
	secret:process.env.JWT_SECRET,
	userProperty:"auth"
}) //With this we make sure the token held by client contains secret key in process.env for securing routes
   //Use this as middleware to check for token containing secret code

 exports.forgotPassword = (req, res) => {
    if (!req.body) return res.status(400).json({ message: "No request body" });
    if (!req.body.email)
        return res.status(400).json({ message: "No Email in request body" });

    console.log("forgot password finding user with that email");
    const { email } = req.body;
    console.log("signin req.body", email);
    // find the user based on email
    User.findOne({ email }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "User with that email does not exist!"
            });

        // generate a token with user id and secret
        const token = jwt.sign(
            { _id: user._id, iss: "NODEAPI" },
            process.env.JWT_SECRET
        );

        // email data
        const emailData = {
            from: "noreply@node-react.com",
            to: email,
            subject: "Password Reset Instructions",
            text: `Please use the following link to reset your password: ${
                process.env.CLIENT_URL
            }/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <p>${
                process.env.CLIENT_URL
            }/reset-password/${token}</p>`
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ message: err });
            } else {
                sgMail.send(emailData);
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
                });
            }
        });
    });
};

// to allow user to reset password
// first you will find the user in the database with user's resetPasswordLink
// user model's resetPasswordLink's value must match the token
// if the user's resetPasswordLink(token) matches the incoming req.body.resetPasswordLink(token)
// then we got the right user

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    User.findOne({ resetPasswordLink }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: err
            });

        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
        };

        user = _.extend(user, updatedFields);
        user.updated = Date.now();

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: `Great! Now you can login with your new password.`
            });
        });
    });
};
