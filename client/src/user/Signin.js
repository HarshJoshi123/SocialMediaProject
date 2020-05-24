import React,{Component} from 'react'
import {Link,Redirect} from 'react-router-dom'
import {signin,authenticate} from "../auth/index.js"
import Background from "../images/darkforest.jpg"

var sectionStyle = {
  padding:"10px",
  width: "100%",
  height: "650px",
  backgroundImage:`url(${Background})`
};


class Signin extends Component{
constructor(props){
super(props);
this.state={
email:"",
password:"",
err:"",
open:false,
redirect:false,
loading:false
}
this.handlechange=this.handlechange.bind(this);

}
handlechange= name=>e=>{    //Exactly in same order
this.setState({err:""})
this.setState({
	[name]:e.target.value
});


}
authenticate(jwt,next){
if(typeof window!=="undefined"){   //to check if headers are loaded
  localStorage.setItem("jwt",JSON.stringify(jwt));  //response is stored in cookies which is a token and user
  next(); //argument fn is called
}



}
handleclick=(event)=>{

event.preventDefault();
const {email,password}=this.state
this.setState({
  loading:true
})
const user={
   email:email,
   password:password
}

signin(user).then(data=>{
	if(data.error){
		this.setState({err:data.error,open:false,loading:false})}
    else if(data.err){
		this.setState({err:data.err,open:false,loading:false})}
     
    else{
    	authenticate(data,()=>{
        this.setState({
          redirect:true,
          loading:false
        })
      })  //authenticate fn takes two argument,data and a function

      }
})


};




signinform=()=>(
  <form>
     
<div className="form-group">
      <label className="text-muted text-white">Email </label>
      <input type="email" onChange={this.handlechange("email")} value={this.state.email} className="form-control"/>
      </div>
<div className="form-group">
      <label className="text-muted text-white">Password </label>
      <input type="password" className="form-control"  value={this.state.password} onChange={this.handlechange("password")}/>
      </div>

<button onClick={this.handleclick} className="btn btn-raised btn-primary"> Submit </button>


   </form>

		)


render(){
if(this.state.redirect){
return <Redirect to="/" /> 
}
return(
<section style={ sectionStyle }>


<div className="container  container-fluid"> 
      
<h2  style={{textShadow:" 1px 1px #ffffff, 1px 1px #ffffff, 1px 1px #ffffff",letterSpacing: "5px"}}  className="mt-5 mb-5 text-white text-light">SignIn To Your Account </h2>
 <div className="alert alert-danger" style={{display:this.state.err? "":"none"}}> {this.state.err}</div>
  
<div className="alert alert-info" style={{display:this.state.open? "":"none"}}> You are logged in </div>
 {this.state.loading?  (<div className="jumbotron text-center"> <h2> Loading.... </h2>  </div>):""}

   {this.signinform()}
   <p>
   <Link to="/forgot-password" className="text-danger">
       {" "}
       Forgot Password
   </Link>
</p>
</div>
</section>
	)
}



}

export default Signin;