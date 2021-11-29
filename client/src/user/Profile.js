import React,{Component} from "react"
import {Redirect,Link} from "react-router-dom"
import {isAuthenticated} from "../auth/index.js"
import {read} from './apiUser'
import DefaultImage from "../images/index.jpeg"
import DeleteUser from "./DeleteUser"
import FollowButton from "./FollowButton.js"
import ProfileTabs from "./ProfileTabs.js"
import {listByUser} from "../post/apiPost"
class Profile extends Component{

constructor(){
super()
this.state={
	user: {followers:[],following:[]},
	redirectToSignIn:false,
	following:false,
	error:'',
	posts:[]
}

}




init=(userId)=>{

const token=isAuthenticated().token

read(userId,token).then(data=>{          //checks for other user by its id in hyperlink
	if(data.error){
		this.setState({redirectToSignIn:true})
		
	}
	else{
		let following=this.checkFollow(data)
		this.setState({user:data,following})   //user in state is current user you are visiting BY LINK
	     this.loadPosts(data._id)            //if logged in user is following visited user,following is true and follow button is hidden
	}
})

}

loadPosts=(userId)=>{
const token=isAuthenticated().token
listByUser(userId,token).then(data=>{
	if(data.error){
		console.log(data.error)
	}
	else{
		this.setState({posts:data.posts}) //Array of Post objects returned of current user you are visiting
	}
})



}


checkFollow=user=>{
	//jwt is user1(client) and we are searching if he's already following user2
const jwt=isAuthenticated()     
const match= user.followers.find(follower=>{  //find searches for folloer object in array (which is followers)
	return follower._id === jwt.user._id       //Check if user you are visiting,you are in its follower list or not    
})
return match  //true or false returned         //If you are in its follower list,you are following him and follow button is hidden

}
clickFollowButton=(callApi)=>{

const userId=isAuthenticated().user._id          //takes client user
const token=isAuthenticated().token 
                                             //callApi is actually fn in apiUser
callApi(userId,token,this.state.user._id) //userId is client id and state user id is foreign
.then(data=>{
if(data.error){
	this.setState({error:data.error})
}
else{
	this.setState({user:data.result,following:!this.state.following}) //opposite of what it was before
}
})

}

componentDidMount(){
const userId=this.props.match.params.userId
this.init(userId)      //sends hyperlink as parameter,User we are visiting

}
componentWillReceiveProps(props){   //This methods executes when it receives new Props(that is new link)
const userId=props.match.params.userId
this.init(userId)      //sends hyperlink as parameter


}

render(){
	const {user,posts}=this.state
	const photoUrl= user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultImage   // img tag will itself make a get request at link and retrieve image

	
const redirectToSignIn=this.state.redirectToSignIn
if(redirectToSignIn){
return <Redirect to="/signin"/>
}
if(!this.state.user.name || !this.state.user.email){
  return (
	 <div className="container min-vh-100 d-flex justify-content-center align-items-center"> 
	<div class="  spinner-border text-white " style={{width:'10em',height:'10em'}} role="status">
	<span class="sr-only">Loading...</span>
  </div>
  </div>
  )
}

return(

<div className="container text-white ">
<h2 className="mt-5 mb-5"> Profile    </h2>
<div className="row">  
<div className="col-md-4">

<img src={photoUrl} style={{height:"200px",width:"auto"}} onError={i=>(i.target.src=`${DefaultImage}`)} className="img-thumbnail" alt={this.state.user.name} />
 
</div>

<div className="col-md-8">
<div className="lead mt-2">
 <p> {user.name}    </p>
<p> {user.email}   </p>
<p> {`Created On${new Date(user.created).toDateString()}`}   </p>
</div>
{isAuthenticated().user && isAuthenticated().user._id === this.state.user._id ? (

<div className="d-flex">
<Link className="mr-3 pt-1 d-flex justify-content-center" to={`/user/edit/${this.state.user._id}`} style={{textDecoration:'none'}}>   
<i class="fa fa-edit text-info" style={{fontSize:'50'}}></i>
</Link>
<DeleteUser userId={user._id}/>
</div>

	) :(

<FollowButton onButtonClick={this.clickFollowButton} following={this.state.following}/>

	) }
 
</div>

</div>
<div className="row">
<div className="col md-12 mt-5 ">
<hr/>
<p className="lead">{user.about} </p>
<hr/>
</div>
</div>
<ProfileTabs posts={posts} followers={this.state.user.followers} following={this.state.user.following}/>
<hr/>

</div>

	)

}


}
export default Profile