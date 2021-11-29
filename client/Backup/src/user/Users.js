import React,{Component} from "react"
import {list} from "./apiUser"
import DefaultImage from "../images/index.jpeg"
import {Link} from "react-router-dom"
class Users extends Component{
constructor(){
	super()
	this.state={
		users:[]
	}
}
componentDidMount(){
	list().then(data=>{   //list is imported from apiUser file
      if(data.error){
      	console.log(data.error)
      }
     else{
    this.setState({users:data})

     }
	})
}

showlist=()=>(<div className="row">    
		{this.state.users.map((user,i)=>(<div className="card col-md-4"  key={i}>
  <img className="card-img-top" src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`} onError={i=>(i.target.src=`${DefaultImage}`)} alt="Card image cap" style={{width:'100%',height:'15vw',objectFit:'cover'}} />
  <div className="card-body">
    <h5 className="card-title">{user.name}</h5>
    <p className="card-text">{user.email}</p>
    <Link to={`user/${user._id}`} className="btn btn-raised btn-sm btn-primary">View Profile</Link>
  </div>
</div>))}  </div>

		)


render(){

	return(


<div className="container">
<h2 className="mt-5 mb-5">Users</h2>
{this.showlist()}
</div>


		)
}

}
export default Users