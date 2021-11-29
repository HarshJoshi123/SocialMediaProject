import React,{Component} from 'react'
import Posts from "../post/Posts"
import {isAuthenticated} from "../auth/index"
import DefaultImage from "../images/index.jpeg"
import NewPost from '../post/NewPost.js'
  
class Home extends Component{

render(){
const UserphotoId= isAuthenticated().user ? `/user/photo/${isAuthenticated().user._id}` : ""  
const Username= isAuthenticated().user ? isAuthenticated().user.name : ""  

return(
<div >

 <div className="container-fluid mt-2" style={{textAlign:"center",backgroundColor:'#18191b',borderRadius:"0"}}>
   <div className="row">
     <div className="mx-2 col-5 col-md-3 col-lg-2 d-flex flex-column align-items-start"> 
      <img style={{borderRadius:"50%",border:'1px solid  black',objectFit:"cover" }} width="130px" className="float-left mr-2" height="130px"  src={`${process.env.REACT_APP_API_URL}${UserphotoId}`} onError={i=>(i.target.src =`${DefaultImage}`)}  />
      <h5 className="text-white mt-2" > {Username}</h5>
     </div>
     <div className="col-7 col-lg-9 d-flex align-items-center"> 
     <div class="input-group d-flex">
       {/*  <input type="text" class="form-control text-white" style={{background:'#3a3b3d',padding:'25px',borderRadius:'25px'}} placeholder="Share what's on your mind" aria-label="Username" aria-describedby="basic-addon1" / > */}
        <NewPost/>
     
      </div>

     </div>
  </div>
 </div>

 <div className="container">
  <Posts/>
 </div>
</div>

);

}
}
export default Home;