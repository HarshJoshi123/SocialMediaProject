import React,{Component} from "react"
import {isAuthenticated} from "../auth/index"
import {createPost} from "./apiPost.js"
import {Redirect} from "react-router-dom"
import DefaultImage from "../images/index.jpeg"
class NewPost extends Component{
constructor(){
	super()
	this.state={
		title:'',
		body:'',
		photo:'',
		err:'',
		user:{},
		Filesize:0,
		loading:false
	}
}

componentDidMount(){
this.postData=new FormData()
//const userId=this.props.match.params.userId
//this.init(userId)       //sends hyperlink as parameter
this.setState({user:isAuthenticated().user})

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
console.log("Ho gaya execute")
event.preventDefault();
this.setState({loading:true})
if(this.isValid()){
const token=isAuthenticated().token
const userId=isAuthenticated().user._id
createPost(userId,token,this.postData).then(data=>{   //userData from Formadata 
	if(data.error){
		this.setState({err:data.error})}
    else if(data.err){
		this.setState({err:data.err})}
     
    else{
    	 this.setState({loading:false,title:"",body:"",photo:"",Filesize:0})
    	 console.log("post created:",data)
          	
    	
    }
})

}
};
isValid=()=>{
const {title,body,Filesize}=this.state
if(Filesize > 100000){
	this.setState({err:"File should be less than 100kb",loading:false});
	return false;
}
if(title.length===0 || body.length===0){
	this.setState({err:"Body and Title are Required",loading:false})
  return false
}

	

return true
}


newpostform=()=>(
<form>
     <div className="form-group">
      <label className="text-muted">Picture </label>
      <input type="file" onChange={this.handlechange("photo")} accept="image/*" className="form-control"/>
      </div>
     <div className="form-group">
      <label className="text-muted">Title </label>
      <input type="text" onChange={this.handlechange("title")} value={this.state.title} className="form-control"/>
      </div>
     <div className="form-group">
      <label className="text-muted">Body </label>
      <textarea type="text" onChange={this.handlechange("body")} value={this.state.body} className="form-control"/>
      </div> 

<button onClick={this.handleclick} className="btn btn-raised btn-primary"> POST</button>


   </form>

		)


	render(){
	const {title,body,photo,user}=this.state	

//const photoUrl= id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultImage   // img tag will itself make a get request at link and retrieve image

		return(

<div className="container">
<h2 className="mt-5 mb-5">Create New Post</h2>
<div className="alert alert-danger" style={{display:this.state.err? "":"none"}}> {this.state.err}</div>
{this.state.loading?  (<div className="jumbotron text-center"> <h2> Loading.... </h2>  </div>):""}
{/*<img src={photoUrl} style={{height:"200px",width:"auto"}} onError={i=>(i.target.src=`${DefaultImage}`)} className="img-thumbnail" alt={name} />
  */}
 {this.newpostform()}
</div>

			)
	}
}
export default NewPost