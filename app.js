const express=require('express');
const app=express();
const morgan=require("morgan");
const PostRoutes =require('./routes/post.js');
const authRoutes=require('./routes/auth.js');
const userRoute=require('./routes/users.js');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const expressValidator=require('express-validator')// Used for functions which check schema and give user friendly response 
const cookieparser=require('cookie-parser')
const fs=require('fs');
const cors=require('cors')
dotenv.config();
const secret=process.env.JWT_SECRET ;
const PORT=process.env.PORT || 8080;
const uri=process.env.MONGO_URI;
//Establish connection between mongodb and server 
mongoose.connect(uri,{useNewUrlParser: true,useUnifiedTopology:true,useCreateIndex: true});
mongoose.set('useFindAndModify', false);
const connection=mongoose.connection;
connection.once('open',()=>{
	console.log("hogya yipee");
})
mongoose.connection.on("error", (err) => {
        console.log("MongoDB connection error. Please make sure MongoDb is running.", err);
        process.exit();
    });

app.get('/',(req,res)=>{
	fs.readFile('docs/apiDocs.json',(err,data)=>{
		if(err){
			res.status(400).json({
				error:err
			})
		}
		const docs=JSON.parse(data);
		res.json(docs)
	});
});

//Middlewares which act between requests 
//Position of middlewares is very important 
app.use(cors());

app.use(express.json()); //Deal with incoming request as object and recognizes it as Json which is readable by nodejs 
app.use(morgan("dev"));  //middleware which tracks request to server 
//app.use('/api', expressJwt({secret: secret}));
//app.use(MyOwnMiddleware);
app.use(expressValidator()); //used to check schema -- for validators/index.js functions which has middleware fn 
app.use(cookieparser()); //for using cookies in clients browser
app.use('/',PostRoutes); //for routing to routers functions via post.js
app.use('/',authRoutes); //For authentication routing via auth.js
app.use('/',userRoute);

//place after all routes so that it gets executed 
app.use(function(err,req,res,next){
	if(err.name==='UnauthorizedError'){    //express jwt gives unauthorized access if token(with secret code) is absent
		res.status(401).json({
			error:'Unauthorized acces !!'
		});
	}
});
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
};
//End of middlewares


app.listen(PORT,()=>{
	console.log(`Listening at port :${PORT}`);   //Node Api listening at port 8080
});