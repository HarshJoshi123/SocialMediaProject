import React,{Component} from "react"
import {findPeople,follow} from "./apiUser"
import DefaultImage from "../images/index.jpeg"
import {Link} from "react-router-dom"
import {isAuthenticated} from '../auth/index'
class FindPeople extends Component{
constructor(){
	super()
	this.state={
		users:[],
    open:false,
    followmessage:"",
    loader:true
	}
}
componentDidMount(){
	const userId=isAuthenticated().user._id
  const token=isAuthenticated().token
  findPeople(userId,token).then(data=>{   //list is imported from apiUser file
      if(data.error){
      	console.log(data.error)
        this.setState({loader:false});
      }
     else{
    this.setState({users:data,loader:false});

     }
	})
}
clickfollow=(person,ind)=>{
const userId=isAuthenticated().user._id
  const token=isAuthenticated().token
  follow(userId,token,person._id).then(data=>{
    if(data.error){
  console.log(data.error)
    }
    else{
let toFollow=this.state.users
 toFollow.splice(ind,1) //remove index ind from list when it is followed
 this.setState({users:toFollow,open:true,followmessage:`Following ${person.name}`})
    }
  })

}

showlist=()=>(<div className="row">    
		{this.state.users.map((user,i)=>(<div className="card col-md-3 m-2 " style={{background:'#242527'}} key={i}>
  <img className="card-img-top" src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`} onError={i=>(i.target.src=`${DefaultImage}`)} alt="Card image cap" style={{width:'100%',height:'20vw',objectFit:'cover'}} />
  <div className="card-body">
    <h5 className="card-title">{user.name}</h5>
    <p className="card-text">{user.email}</p>
    <Link to={`user/${user._id}`} className="btn btn-raised btn-sm btn-primary">View Profile</Link>
  <button onClick={()=>{this.clickfollow(user,i)}} className="btn btn-raised btn-info float-right btn-right"> Follow    </button>
  </div>
</div>))} 
 </div>

		)


render(){

	const {open,followmessage}=this.state
  if(this.state.loader){
    return (
     <div className="container min-vh-100 d-flex justify-content-center align-items-center"> 
    <div class="  spinner-border text-white " style={{width:'10em',height:'10em'}} role="status">
    <span class="sr-only">Loading...</span>
    </div>
    </div>
    )
  }  

  return(

<div className="container text-white">
<h2 className="mt-5 mb-5">FIND PEOPLE </h2>

{  open && (<div className="alert alert-success"><p>{followmessage}</p></div>)           }


{this.showlist()}
</div>


		)
}

}
export default FindPeople