import React,{Component} from "react"
import {singlePost,removePost,like,unlike} from "./apiPost"
import DefaultPost from "../images/download.jpeg"
import {Link,Redirect} from "react-router-dom"
import {isAuthenticated} from "../auth/index"
import Comment from "./Comment.js"
class SinglePost extends Component{
state={
	post:"",
  redirectToHome:false,
  like:false, //Keeps track whether user has liked this post or not(to display like button or not)
  likes:0,  //Total likes on a post 
comments:[],
redirecttosignin:false,
imgVis:true
}

checkLike=(likes)=>{
const userId= isAuthenticated() && isAuthenticated().user._id //gives .user._id but doesnt generate error when entered wihtout signin
let match=likes.indexOf(userId) !== -1  //if userId is in likes array,it means we have already liked 
return match
}


componentDidMount(){
const postId=this.props.match.params.postId
const token=isAuthenticated().token

 singlePost(postId).then(data=>{
if(data.error){
	console.log("error")
}
else{
  console.log(data.comments)
 this.setState({post:data,likes:data.likes.length,like:this.checkLike(data.likes),comments:data.comments})
}
})


}
 
 deletePost=()=>{
  const token=isAuthenticated().token
  const postId=this.props.match.params.postId
  removePost(postId,token).then(data=>{
  	if(data.error){

  		console.log("error hai")
  	}
  	else{
  		this.setState({redirectToHome:true})
  	}
  })

 }

deleteconfirmed=()=>{

let answer=window.confirm("Are you sure you want to delete your Post?")
if(answer){
	this.deletePost();
}
}

updateComments=comments=>{   //****This method is passed to child components in props so that parent component
 console.log("update comment in SinglePost")
  this.setState({comments})                     //Is rerendered when a new comment is entered
                            //**updated comments list passed from child(comments.js) to parent(SinglePost) 

}


liketoggle=()=>{
  if(!isAuthenticated()){
    this.setState({redirecttosignin:true})
   return false 
  }

let callApi= this.state.like ? unlike:like //if already like then unlike
const userId=isAuthenticated().user._id
const postId=this.state.post._id
const token=isAuthenticated().token
callApi(userId,token,postId).then(data=>{
  if(data.error){
    console.log("like error")
  }
  else{
    this.setState({likes:data.likes.length,like:this.checkLike(data.likes)})
  }  //checkLike prevents us from liking multiple times after reloading
})

}


renderPost= (post) =>{
const posterId=post.postedBy 
               ? `/user/${post.postedBy._id}` 
               : "";
const postername= post.postedBy 
                  ? post.postedBy.name 
                  : "Unknown";
//const poster=post.postedBy._id

const {like,likes}=this.state
return(
   <div className="card-body">
    <div>
    { this.state.imgVis ?
    
    <img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`} alt={''} onError={()=>this.setState({imgVis:false})} style={{objectFit:'contain'}} className="img-thumbnail mb-3"/> : ''
    
   }
   </div>
    {like ? (<h3 className="fa fa-thumbs-up text-success bg-dark" style={{padding:'10px',borderRadius:'50%'}} onClick={this.liketoggle}>{likes} Likes </h3>):(<h3 style={{padding:'10px',borderRadius:'50%'}} className="fa fa-thumbs-up  bg-dark"  onClick={this.liketoggle}>{likes} Likes </h3>)} 
    <br/>
    <p className="font-italic"> Posted By <Link to={`${posterId}`}> {postername } </Link> 

on {new Date(post.created).toDateString()}
     </p>
   
    <Link to={`/`} className="btn btn-raised btn-sm btn-primary">BACK TO POSTS</Link>
    { 
    isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id &&(<> <Link to={`/post/edit/${post._id}`} className="btn btn-raised btn-warning mr-5 ml-5">  Update Post  </Link>
 <button onClick={this.deleteconfirmed} className="btn btn-raised btn-danger">  Delete Post  </button> </>)
}  
</div>
	)      


}


	render(){
const {post,comments,redirectToHome,redirecttosignin}=this.state
if(redirectToHome){
  return <Redirect to={`/`} />
}
else if(redirecttosignin){
 return <Redirect to={`/signin`} /> 
}

return(
<div className="container text-white">
<h2 className="display-2 mt-2 mb-2"> {post.title}   </h2>
{ post ?
   this.renderPost(post) : null }
<Comment updateComments={this.updateComments} postId={post._id} comments={comments.reverse()} />
</div>
	);
	}

}
export default SinglePost