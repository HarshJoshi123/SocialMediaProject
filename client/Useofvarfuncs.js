

1.  <div className="row">    
		{ posts.map((post,i)=>{
      const posterId=post.postedBy ? post.postedBy._id : ""   // To derive postedId and posterName for each post object
      const postername= post.postedBy ? post.postedBy.name :""//thats we used another return()
      
      return(<div className="card col-md-4"  key={i}>
   <div className="card-body">
    <h5 className="card-title">{post.title}</h5>
    <p className="card-text">{post.body}</p>
    <br/>
    <p className="font-italic"> Posted By <Link to={`/user/${posterId}`}> {postername } </Link> </p>
    <Link to={`posts/${post._id}`} className="btn btn-raised btn-sm btn-primary">Read More</Link>
  </div>
</div> )}) }  </div>
)
}

**Important to notice how we use {} for writing JS query and return() for writing HTML
  So use  


2.   <p className="card-text">{post.body.substring(0,5)}</p>
    
    Only to display 0 to 5 characters of body in posts  


3.   HOW PHOTO IS SENT

3.1 router.get("/user/photo/:userId",userPhoto) //called at this route and it first calls UserById
                                                   which stores req.profile=user of userId



3.2 exports.userPhoto=(req,res,next)=>{

if(req.profile.photo.data){                                   //That req.profile has req.profile.photo
  res.set(("Content-Type",req.profile.photo.contentType))         //res gives Content type and 
   return res.send(req.profile.photo.data)                       //res.send(req.profile.photo.data) to any get reques
}
next();


}

3.3  <img className="card-img-top" src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`} onError={i=>(i.target.src=`${DefaultImage}`)} alt="Card image cap" style={{width:'100%',height:'15vw',objectFit:'cover'}} />
    //GET request made when src refers to this address and res.send gives photo.data


4.1style={{ objectFit:"cover"}} for making cover photo   
 
  4.2 <h2 className="mt-5 mb-5">{!posts.length ? "Loading..." :"Posts"}</h2>
            //For array of objects,use .length fn for loading preloader 

**5.  
           { post ?
   this.renderPost(post) : null }  //In singlePost.js
   if it is saying post is undefined before it is filled in componentDidMount by read() fn then 
    us ternary operator so that it loads after it is filled in componentDidMount            


6. init=(userId)=>{             //takes userId and makes GET req to server using it(with token authorization)

const token=isAuthenticated().token

read(userId,token).then(data=>{
  if(data.error){
    this.setState({redirectToSignIn:true})
    
  }
  else{            //data is setstated after read from mongo 
    this.setState({name:data.name,email:data.email,id:data._id,about:data.about})   //user in state is current user you are visiting BY LINK
  }
})

}
componentDidMount(){
this.userData=new FormData()
const userId=this.props.match.params.userId
this.init(userId)      //sends hyperlink as parameter

}  

These were Used in EditProfile and EditPost so that it reads orignal post and displays to user what it
orignally was

7.
  <form onSubmit={this.addComment}>
   <div className="form-group">
  <input type="text" value={this.state.text}  className="form-control" onChange={this.handleChange} />
  <button className="btn btn-raised btn-success"> Post </button>
</div>
   </form>

   In form ,if you have onSubmit fn in form and button is clicked (without mentioning onClick) ,onSubmit of form is executed