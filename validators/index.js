exports.createPostValidator=(req,res,next)=>{

req.check("title","Write a title").notEmpty()     //Gives error if title empty
req.check("title","Title should be between 4 to 150").isLength({
	min:4,max:150
});

req.check("body","Write body").notEmpty()     //Gives error if body empty
req.check("title","body should be between 10 to 150").isLength({       
	min:10,max:150
});               //Gives error if body is not between 10 to 150

const errors=req.validationErrors();
if(errors){
	const FirstError=errors.map(error=>error.msg)[0]  //First error message stored
	return res.status(400).json({error:FirstError});
}
next();   //Middleware fn have a next fn that allows it to now handle main request which was given to it before(postcontroller function)
             // Req-> Middlewarefn->Main fn which gives actual response for request

}
exports.userSignupValidator=(req,res,next)=>{

req.check("name","Name is required").notEmpty()
req.check("name","Name should be between 3 to 30").isLength({
	min:3,max:30
})

//Email
req.check("email","Email must be between 3 to 32 char")
.matches(/.+\@.+\..+/)                        //Email should have a @ symbol and .com
.withMessage("Email should contain @")                 
.isLength({
	min:3,max:30
}) 
req.check("password","Password cant be empty").notEmpty()
req.check("password")
.isLength({min:6})
.withMessage("Password Should be greater than 6 characters")
.matches(/\d/)
.withMessage("Password Should contain digit ")

const errors=req.validationErrors();
if(errors){
const FirstError=errors.map(error=>error.msg)[0]
return res.status(400).json({err:FirstError})
} 

next();
}   

exports.passwordResetValidator=(req, res, next)=>{
    // check for password
    console.log(req.body);
    req.check("newPassword", "Password is required").notEmpty();
    req.check("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("must contain a number")
        .withMessage("Password must contain a number");

    // check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware or ...
    next();
};