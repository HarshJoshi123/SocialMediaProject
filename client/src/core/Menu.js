import React from 'react'
import {Link,withRouter } from "react-router-dom"
import {isAuthenticated,signout} from "../auth/index.js"


//isactive is used to indicate whic tab is active
//it takes history from props and path send as parameter
//if current path(history.location.path) and given path matches,it becomes yellow rest same

 const isactive=(history,path)=>{
   if(history.location.pathname===path){ 
return {color:"#009688"}
}
   else  return {color:"#ffffff"}

 }




const Menu=({history})=>(       //Extracting history from props
<div>


<ul className="nav nav-tabs  justify-content-around" style={{backgroundColor:'#18191b'}}>
  <li className="nav-item">
    <Link className="nav-link" style={isactive(history,"/")}  to="/"> Home </Link>
  </li>
  
     {!isAuthenticated() ? (
    <>
    <li className="nav-item">
    <Link className="nav-link" style={isactive(history,"/signin")} to="/signin"> SIGNIN </Link>
  </li>
   
  <li className="nav-item" >
<Link className="nav-link" style={isactive(history,"/signup")}  to="/signup"> SIGNUP </Link>    
  </li> </>):(<>  
<li className="nav-item">
    <Link className="nav-link" style={isactive(history,"/users")} to="/users"> USERS </Link>
  </li>
  
  <li className="nav-item" >
 
<Link className="nav-link" to={`/user/${isAuthenticated().user._id}`} style={isactive(history,`/user/${isAuthenticated().user._id}`)}>
{`${isAuthenticated().user.name}'s Profile`}    </Link>      
  </li>
    
    <li className="nav-item" >
 
<Link className="nav-link" to="/findpeople" style={isactive(history,`/findpeople`)}>
FIND PEOPLE  </Link>      
  </li>
  {/* <li className="nav-item" >
 
<Link className="nav-link" to="/create/post" style={isactive(history,`/create/post`)}>
Create Post  </Link>      
  </li> */}
<li className="nav-item " >
<button className="nav-link text-white bg-transparent"   onClick={()=>signout(()=>history.push('/'))} > SIGNOUT  </button>    
  </li>
    </>)}



  
</ul>

</div>
  ) 
export default withRouter(Menu)


