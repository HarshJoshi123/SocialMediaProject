import React,{Component} from "react"
import {follow,unfollow} from "./apiUser.js"
import DefaultImage from "../images/index.jpeg"

class FollowButton extends Component{

followClick=()=>{
this.props.onButtonClick(follow) //so that parent fn exectues which actually makes PUT request 


}
unfollowClick=()=>{
this.props.onButtonClick(unfollow) //so that parent fn exectues which actually makes PUT request 


}
render(){
return(

<div className="d-inline-block  ">
{ !this.props.following ? (<button onClick={this.followClick} className="btn btn-success btn-raised  mr-5">
 Follow
 </button>)
: (<button onClick={this.unfollowClick} className="btn btn-warning btn-raised ">
 UnFollow
 </button>)
}
</div>
	)


}


}
export default FollowButton