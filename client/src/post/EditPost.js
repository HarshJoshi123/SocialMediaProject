import React,{Component} from "react"
import {singlePost,updatePost} from "./apiPost"
import {isAuthenticated} from "../auth/index"
import {Redirect} from "react-router-dom"
import DefaultImage from "../images/download.jpeg"

class EditPost extends Component{
constructor(){
	super();
	this.state={
		id:'',
		title:'',
		body:'',
		redirecttoHome:false,
		error:'',
		photo:'',
		Filesize:0,
		loading:true
	}

}
init=(postId)=>{             //takes userId and makes GET req to server using it(with token authorization)

singlePost(postId).then(data=>{
	if(data.error){
		this.setState({redirectToHome:true,loading:false})
		
	}
	else{            //data is setstated after read from mongo 
		this.setState({loading:false,title:data.title,body:data.body,id:data._id,photo:data.photo,error:''})   //user in state is current user you are visiting BY LINK
	}
})

}
handlechange= name=>e=>{    //Exactly in same order
this.setState({err:""});
const value= name === 'photo' ? e.target.files[0] : e.target.value
const Filesize= name === 'photo' ? e.target.files[0].size : 0
this.postData.set(name,value)  //creates a new object with key value pairs,for user like pass,email,name etc
this.setState({
	[name]:value,
	Filesize
});


}
handleclick=(event)=>{
event.preventDefault();
this.setState({loading:true})
if(this.isValid()){
const token=isAuthenticated().token
const postId=this.state.id
updatePost(postId,token,this.postData).then(data=>{   //userData from Formadata 
	if(data.error){
		this.setState({error:data.error})}
    else if(data.err){
		this.setState({error:data.err})}
     
    else{
    	 this.setState({redirecttoHome:true,error:"",loading:false,title:"",body:"",photo:"",Filesize:0})
    	 console.log("post created:",data)  	
    }
})

}
};
isValid=()=>{
const {title,Filesize}=this.state
if(Filesize > 7000000){
	this.setState({error:"File should be less than 7MB",loading:false});
	return false;
}
if(title.length===0 && this.state.photo==''){
	this.setState({error:"Title or Picture Required",loading:false})
  return false
}
return true
}
editpostform=(title,body)=>(
<form>
     <div className="form-group">
      <label className="text-muted">Post Photo </label>
      <input type="file" onChange={this.handlechange("photo")} accept="image/*" className="form-control"/>
      </div>
     <div className="form-group">
      <label className="text-muted">Title </label>
	  
      <textarea type="text" style={{color:'white',resize:'none',background:'#3a3b3d',padding:'25px',borderRadius:'25px'}} onChange={this.handlechange("title")} value={this.state.title} className="form-control"/>
      </div>
     

<button onClick={this.handleclick} className="btn btn-raised btn-primary"> Update Post</button>


   </form>

)



componentDidMount(){
this.postData=new FormData()
const postId=this.props.match.params.postId
this.init(postId)      

}

loader = ()=>(
	<div className="container min-vh-100 d-flex justify-content-center align-items-center"> 
   <div class="  spinner-border text-white " style={{width:'10em',height:'10em'}} role="status">
   <span class="sr-only">Loading...</span>
   </div>
   </div>
   )  


render(){
	const {body,title,id,redirecttoHome}=this.state

console.log(redirecttoHome)

if(redirecttoHome){
return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
} 

return(

<div className="container text-white">
<h2 className="mt-5 mb-5"> {title}  </h2>
<div className="alert alert-danger" style={{display:this.state.error? "":"none"}}> {this.state.error}</div>
{this.state.loading? this.loader():""}
{this.state.photo ? (
	<img src={`${process.env.REACT_APP_API_URL}/post/photo/${id}`} style={{height:"200px",width:"auto"}} onError={i=>(i.target.src=`${DefaultImage}`)} className="img-thumbnail" alt={title} />
):''}

{this.editpostform(title,body)}
</div>
	)
}
}
export default EditPost