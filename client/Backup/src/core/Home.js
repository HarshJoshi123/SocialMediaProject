import React,{Component} from 'react'
import Posts from "../post/Posts"
import {isAuthenticated} from "../auth/index"
import DefaultImage from "../images/index.jpeg"

  
class Home extends Component{

render(){
const UserphotoId= isAuthenticated().user ? `/user/photo/${isAuthenticated().user._id}` : ""  
const Username= isAuthenticated().user ? isAuthenticated().user.name : ""  

return(
<div >

 <div className="jumbotron d-flex " style={{textAlign:"center"}}>
   <img style={{borderRadius:"50%",border:'1px solid  black',objectFit:"cover" }} width="130px" className="float-left mr-2" height="130px"  src={`${process.env.REACT_APP_API_URL}${UserphotoId}`} onError={i=>(i.target.src =`${DefaultImage}`)}  />

  <h2 style={{alignSelf:"center",marginRight:"auto",marginLeft:"auto"}}>Welcome {Username}</h2>
 </div>

 <div className="container">
  <Posts/>
 </div>
</div>

);

}
}
export default Home;