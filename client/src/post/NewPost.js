import React,{Component} from "react"
import {isAuthenticated} from "../auth/index"
import {createPost} from "./apiPost.js"
import {Redirect} from "react-router-dom"
import DefaultImage from "../images/index.jpeg"
class NewPost extends Component{
constructor(){
	super()
	this.state={
		title:'',
		photo:'',
		err:'',
		user:{},
		Filesize:0,
		loading:false,
	    preview:''
	}
}

componentDidMount(){
this.postData=new FormData()
//const userId=this.props.match.params.userId
//this.init(userId)       //sends hyperlink as parameter
this.setState({user:isAuthenticated().user})

}

componentDidUpdate=(prevProps,nextState)=>{
//console.log(prevProps,nextState)

	if(nextState.photo!=this.state.photo && this.state.photo!=''){
    let objectUrl = URL.createObjectURL(this.state.photo);
    this.setState({preview:objectUrl});
}
else if((this.state.photo=='' || this.state.photo==null)&&nextState.preview!='') {
 this.setState({preview:''})
}
 }

handlechange= name=>e=>{    //Exactly in same order
this.setState({err:""});
const value= name === 'photo' ? e.target.files[0] : e.target.value
const Filesize= name === 'photo' ? e.target.files[0].size : 0
this.postData.set(name,value)  //creates a new object with key value pairs,for user like pass,email,name etc

this.setState({
	[name]:value,
	Filesize
});


}
isDisabled=()=>{
	if(this.state.title=="" && this.state.Filesize==0){
		return 'disabled'
	}
	return '';
}

handleclick=(event)=>{

event.preventDefault();
this.setState({loading:true})
if(this.isValid()){
const token=isAuthenticated().token
const userId=isAuthenticated().user._id
createPost(userId,token,this.postData).then(data=>{   //userData from Formadata 
	if(data.error){
		this.setState({err:data.error,loading:false})}
    else if(data.err){
		this.setState({err:data.err,loading:false})}
     
    else{
    	 this.setState({loading:false,title:"",photo:"",Filesize:0})
    	 console.log("post created:",data)
    }
})

}
};
isValid=()=>{
const {title,body,Filesize}=this.state
if(Filesize > 7000000){
	this.setState({err:"File should be less than 7MB",loading:false});
	return false;
}
if(Filesize==0){
	if(title==""){
		this.setState({err:""})
	}
}
return true;
}


newpostform=()=>(
<form>
    <div className="form-group">
	  <textarea type="text" onChange={this.handlechange("title")} placeholder="Share what's on your mind" style={{resize:'none',background:'#3a3b3d',padding:'25px',borderRadius:'25px'}} value={this.state.title} className="form-control text-white"/>
      </div>
	  {this.state.preview!='' ? (<div className="m-2"> 
            <img height='300px' style={{display:'block'}} src={this.state.preview} /> 
		 </div>):''}
      <div className="d-flex justify-content-between flex-wrap">
	   <div className="form-group d-flex ">
		 <label id="label-file  text-white" for="file"> <span className="text-white">Photo </span> <i class="fa fa-image text-primary"></i> /<span className="text-white">Video </span>  <i class="fa fa-camera-retro text-info"></i></label>
         <input type="file" id="file" onChange={this.handlechange("photo")} accept="image/*" className="form-control"/>		 	 
       </div>
      <button 
       onClick={this.handleclick} 
       className={`btn btn-raised btn-primary ${this.isDisabled()}`}
       disabled={this.isDisabled()=='disabled'}> 
	   POST
	 </button>
   </div>	
</form>

		)

loader = ()=>(
			<div className="container min-vh-100 d-flex justify-content-center align-items-center"> 
		   <div class="  spinner-border text-white " style={{width:'10em',height:'10em'}} role="status">
		   <span class="sr-only">Loading...</span>
		   </div>
		   </div>
		   )  
	render(){
	const {title,body,photo,user}=this.state	

//const photoUrl= id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultImage   // img tag will itself make a get request at link and retrieve image

		return(

<div className="container-fluid">
<div className="alert alert-danger" style={{display:this.state.err? "":"none"}}> {this.state.err}</div>
{this.state.loading?  this.loader():""}
{/*<img src={photoUrl} style={{height:"200px",width:"auto"}} onError={i=>(i.target.src=`${DefaultImage}`)} className="img-thumbnail" alt={name} />
  */}
 {this.newpostform()}
</div>

			)
	}
}
export default NewPost