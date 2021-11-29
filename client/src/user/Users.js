import React,{Component} from "react"
import {list} from "./apiUser"
import DefaultImage from "../images/index.jpeg"
import {Link} from "react-router-dom"
class Users extends Component{
constructor(){
	super()
	this.state={
		users:[],
    loader:true
	}
}
componentDidMount(){
	list().then(data=>{   //list is imported from apiUser file
      if(data.error){
      	console.log(data.error)
        this.setState({loader:false})
      }
     else{
    this.setState({users:data,loader:false})

     }
	})
}

showlist=()=>(<div className="row">    
		{this.state.users.map((user,i)=>(<div className="card col-md-3 m-2 text-white" style={{background:'#242527'}}  key={i}>
  {/* <div className="img-container w-100" style={{height:'30%'}}> */}
  <img className="card-img-top" src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`} onError={i=>(i.target.src=`${DefaultImage}`)} alt="Card image cap" style={{width:'100%',height:'20vw',objectFit:'cover'}} />
  {/* </div> */}
  <div className="card-body">
    <h5 className="card-title">{user.name}</h5>
    <p className="card-text">{user.email}</p>
    <Link to={`user/${user._id}`} className="btn btn-raised btn-sm btn-primary">View Profile</Link>
  </div>
</div>))}  </div>

		)


render(){
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


<div className="container" >
<h2 className="mt-5 mb-5 text-white">Users</h2>
{this.showlist()}
</div>


		)
}

}
export default Users