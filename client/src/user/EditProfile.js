import React,{Component} from "react"
import {isAuthenticated} from "../auth/index"
import {read,update,updateUser} from "./apiUser.js"
import {Redirect} from "react-router-dom"
import DefaultImage from "../images/index.jpeg"
class EditProfile extends Component{
constructor(){
	super()
	this.state={
		Filesize:0,
		photo:"",
		err:"",
		id:"",
		name:"",
		email:"",
		password:"",
		redirectToProfile:false,
		loading:false,
		about:""
	}
}
init=(userId)=>{             //takes userId and makes GET req to server using it(with token authorization)

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

handlechange= name=>e=>{    //Exactly in same order
this.setState({err:""});
const value= name === 'photo' ? e.target.files[0] : e.target.value
const Filesize= name === 'photo' ? e.target.files[0].size : 0
this.userData.set(name,value)  //creates a new object with key value pairs,for user like pass,email,name etc
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
const userId=isAuthenticated().user._id
update(userId,token,this.userData).then(data=>{   //userData from Formadata 
	if(data.error){
		this.setState({err:data.error})}
    else if(data.err){
		this.setState({err:data.err})}
     
    else{
    	 updateUser(data,()=>{this.setState({
    		redirectToProfile:true
    	  })
    	 })
          	
    	
    }
})

}
};
isValid=()=>{
const {name,password,email,Filesize}=this.state
if(Filesize > 7000000){
	this.setState({err:"File should be less than 7MB",loading:false});
	return false;
}
if(name.length===0){
	this.setState({err:"Name is Required"})
  return false
}
if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
	this.setState({err:"Valid Email Required",loading:false})
return false
}
if(password.length>1&&password.length<=5){
	this.setState({loading:false,err:"Password Must be atleast 6 letters long"})
return false
}

return true
}


signupform=()=>(
<form>
     <div className="form-group">
      <label className="text-muted">Profile Pic </label>
      <input type="file" onChange={this.handlechange("photo")} accept="image/*" className="form-control"/>
      </div>
     <div className="form-group">
      <label className="text-muted">New Name </label>
      <input type="text" onChange={this.handlechange("name")} value={this.state.name} className="form-control"/>
      </div>
<div className="form-group">
      <label className="text-muted">New Email </label>
      <input type="email" onChange={this.handlechange("email")} value={this.state.email} className="form-control"/>
      </div>
<div className="form-group">
      <label className="text-muted">New Password </label>
      <input type="password" className="form-control"  value={this.state.password} onChange={this.handlechange("password")}/>
      </div>
     <div className="form-group">
      <label className="text-muted">About </label>
      <textarea type="text" onChange={this.handlechange("about")} value={this.state.about} className="form-control"/>
      </div> 

<button onClick={this.handleclick} className="btn btn-raised btn-primary"> UPDATE </button>


   </form>

		)


	render(){
	const {id,name,redirectToProfile}=this.state	
if(redirectToProfile){
	return <Redirect to={`/user/${id}`} />
}

const photoUrl= id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultImage   // img tag will itself make a get request at link and retrieve image

		return(

<div className="container">
<h2 className="mt-5 mb-5">Edit Profile </h2>
<div className="alert alert-danger" style={{display:this.state.err? "":"none"}}> {this.state.err}</div>
{this.state.loading?  (<div className="jumbotron text-center"> <h2> Loading.... </h2>  </div>):""}
<img src={photoUrl} style={{height:"200px",width:"auto"}} onError={i=>(i.target.src=`${DefaultImage}`)} className="img-thumbnail" alt={name} />
{this.signupform()}
</div>

			)
	}
}
export default EditProfile