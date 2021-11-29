import React,{Component} from 'react'
import {isAuthenticated} from "../auth/index" 
import {remove} from "./apiUser"
import {signout } from "../auth/index.js"
import {Redirect} from "react-router-dom"
class DeleteUser extends Component{
state={
	redirect:false
}

deleteconfirmed=()=>{

let answer=window.confirm("Are you sure you want to delete your account?")
if(answer){
	this.deleteAccount();
}
}
deleteAccount=()=>{
const token=isAuthenticated().token
 const userId=this.props.userId;  //Sends by Profile page through props
remove(userId,token).then(data=>{
	if(data.error){
		console.log(data.error)
	}
	else{
		signout(()=>console.log("deletedddd"));
		this.setState({redirect:true})
 

	}
})
}


render(){
if(this.state.redirect){
	return <Redirect to="/" />
}


	return(


<button onClick={this.deleteconfirmed} className="d-flex p-0 m-0 justify-content-center " style={{backgroundColor:'transparent',border:'none'}} >
<i class="fa fa-trash text-danger" aria-hidden="true" style={{fontSize:'50',padding:'0'}} ></i>
 </button> 




		)
}


} 

export default DeleteUser