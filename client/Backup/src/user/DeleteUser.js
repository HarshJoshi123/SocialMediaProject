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


<button onClick={this.deleteconfirmed} className="btn btn-raised btn-danger">
Delete </button> 




		)
}


} 

export default DeleteUser