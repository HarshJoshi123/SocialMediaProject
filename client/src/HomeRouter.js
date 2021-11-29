import React from 'react'
import {Switch,Route} from 'react-router-dom'
import Home from "./core/Home"
import Signup from "./user/Signup"
import Signin from "./user/Signin"
import Menu from "./core/Menu"
import Profile from "./user/Profile" 
import Users from "./user/Users"
import EditProfile from "./user/EditProfile"
import PrivateRoute from "./auth/PrivateRoute"
import ForgotPassword from "./user/ForgotPassword"
import ResetPassword from "./user/ResetPassword"
import FindPeople from "./user/FindPeople"
import NewPost from "./post/NewPost"
import EditPost from "./post/EditPost"
import SinglePost from "./post/SinglePost"
const HomeRouter=()=>(
<div>
<Menu/> 
<Switch>

<PrivateRoute exact path="/" component={Home}/>
<Route exact path="/post/:postId" component={SinglePost}/>
{/* <PrivateRoute exact path="/create/post" component={NewPost}/> */}
<PrivateRoute exact path="/post/edit/:postId" component={EditPost}/>
<Route exact path="/forgot-password" component={ForgotPassword} />
<Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword}/>
<Route exact path="/users" component={Users}/>
<Route exact path="/signup" component={Signup}/>
<Route exact path="/signin" component={Signin}/>

<PrivateRoute exact path="/user/:userId" component={Profile}/>
<PrivateRoute exact path="/user/edit/:userId" component={EditProfile}/>
<PrivateRoute exact path="/findpeople" component={FindPeople}/>


</Switch>
</div>

	)
export default HomeRouter;