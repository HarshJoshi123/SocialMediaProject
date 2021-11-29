import React,{Component} from "react"
import {isAuthenticated} from "../auth/index"
import {comment,uncomment} from "./apiPost"
import {Link } from "react-router-dom"
import DefaultImage from "../images/index.jpeg"
class Comment extends Component{

state={
	text:'',
	error:""
}



deleteComment=(comment)=>{
  const token=isAuthenticated().token
  const postId=this.props.postId
  const userId=isAuthenticated().user._id
  uncomment(userId,token,postId,comment).then(data=>{ //comment and comment same name
if(data.error){

	console.log("error in comment")
}
else{
   //dispatch fresh list of comments to parent component(Singlpost)
   //use fn of parent class(Singlepost) so that is rerendered with updated list
   this.props.updateComments(data.comments); //parent class rerendered
}

})
 }

deleteConfirmed=(comment)=>{

let answer=window.confirm("Are you sure you want to delete your Post?")
if(answer){
	this.deleteComment(comment);
}
}


handleChange=event=>{
	this.setState({text:event.target.value,error:""})
}

isValid=()=>{
const {text}=this.state
if(!text.length>0 || text.length > 150){
	this.setState({error:"Comment Cant Be Empty Or more than 150 "})
  return false
}
return true
}

addComment=e=>{
 e.preventDefault()
if(!isAuthenticated()){
	this.setState({error:"Please Sign in to leave a comment"})
  return false
}

if(this.isValid()){
const userId= isAuthenticated().user._id 
const postId=this.props.postId
const token=isAuthenticated().token
const com={text:this.state.text} //since comment is object with multiple attributes,assign text like this
comment(userId,token,postId,{text:this.state.text}).then(data=>{ //comment and comment same name
if(data.error){

	console.log("error in comment")
}
else{
	this.setState({text:""})
   //dispatch fresh list of comments to parent component(Singlpost)
   //use fn of parent class(Singlepost) so that is rerendered with updated list
   this.props.updateComments(data.comments); //parent class rerendered
}

})
}
}
	render(){
  const {comments}=this.props //from Singlepost ,comments passed 

		return(
         <div>
 <h2 className="mt-5 mb-5"> Leave a Comment </h2>
   <form onSubmit={this.addComment}>
   <div className="form-group">
  <input type="text" placeholder="Leave a comment" value={this.state.text}  className="form-control" onChange={this.handleChange} />
  <button className="btn mt-2 btn-raised btn-success"> Post </button>
</div>
   </form>
   <div className="alert alert-danger" style={{display:this.state.error? "":"none"}}> {this.state.error}</div>
<hr/>
<div className="col-md-12">
     <h3 className="text-primary">{comments.length}Comments</h3>
     <hr/>
     {comments.map((comment,i )=>{
     	return(<div key={i}> 
            
            <Link to={`/user/${comment.postedBy._id}`} > 
           <img style={{borderRadius:"50%",border:'1px solid  black' }} width="30px" className="float-left mr-2" height="30px"  src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`} onError={i=>(i.target.src =`${DefaultImage}`)} alt={comment.postedBy.name} /> </Link>
            <div> <p className="lead">{comment.text}</p></div>  
            <p className="font-italic"> Posted By <Link to={`/user/${comment.postedBy._id}`}> {comment.postedBy.name } </Link> 

             on {new Date(comment.created).toDateString()} 
      <span>           
             {isAuthenticated() && isAuthenticated().user._id === comment.postedBy._id &&(
               <span onClick={()=>this.deleteConfirmed(comment)} className="mr-5 float-right"><i class="fa fa-trash" aria-hidden="true"></i>
 </span>
                

             	)}
             </span>


             </p>
             
             </div>
     	   )
     })}

 </div>

         </div>



			)
	}
}

export default Comment