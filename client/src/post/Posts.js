import React,{Component} from "react"
import {list} from "./apiPost"
import DefaultPost from "../images/download.jpeg"
import {Link} from "react-router-dom"
import DefaultImage from "../images/index.jpeg"

class Posts extends Component{
constructor(){
	super()
	this.state={
		posts:[]
	}
}
 componentDidMount = async ()=>{
	let data=await list();
  console.log("posts data",data);
  if(data.error){
    console.log(data.error);
  }
  else{
    console.log(data)
    this.setState({posts:data})
  }
  // list().then(data=>{   
  //     if(data.error){
  //     	console.log(data.error)
  //     }
  //    else{
      
  //   this.setState({posts:data})

  //    }
	// })
}
//<img className="card-img-top" src={`${process.env.REACT_APP_API_URL}/post/photo/${user._id}`} onError={i=>(i.target.src=`${DefaultPost}`)} alt="Card image cap" style={{width:'100%',height:'15vw',objectFit:'cover'}} />
 
showlist=(posts) =>{

  return(
      <div className="row">    
		{ posts.map((post,i)=>{
      const posterId=post.postedBy ? `/user/${post.postedBy._id}` : ""
      const postername= post.postedBy ? post.postedBy.name : "Unknown"
       const photoid= post.postedBy ? `/user/photo/${post.postedBy._id}`: ""
       console.log(photoid);
      return(<div className="card col-md-12 mx-1 mb-2"  style={{background:'#242527'}} key={i}>
   <div className="card-body">
    <p className="py-1">
    <img style={{borderRadius:"100%",border:'1px solid  black',marginTop:"-5px" }} width="45px" className="float-left mr-2" height="45px"  src={`${process.env.REACT_APP_API_URL}${photoid}`} onError={i=>(i.target.src =`${DefaultImage}`)} alt={postername} />
    <h3 className="font-italic pl-1  text-primary" >  <Link style={{textDecoration:'none'}} to={`${posterId}`}> {postername } </Link> 
     <span style={{fontSize:'40%'}} className="text-muted float-right small"> {new Date(post.created).toDateString()} </span>
    </h3>
    <h5 style={{marginLeft:"60px"}}className="card-title text-white">{post.title}</h5>
    </p>
   <div className="px-4 " style={{maxWidth:'50%'}}>
    <img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`} alt={''} style={{objectFit:'contain',background:'transparent',border:'none'}}  className="img-thumbnail mb-2"/>
    </div>
    <Link to={`post/${post._id}`} className="btn btn-raised btn-sm btn-primary">Comment and Like</Link>
   
  </div>
</div> )}) }  </div>
)
}
		


render(){
const {posts} =this.state
	return(


<div className="container">
<h2 className="mt-5 mb-5">{!posts.length ? "Loading..." :""}</h2>
{this.showlist(posts)}
{posts && (<footer clasName="container text-light  py-5">
   <div className="bg-dark  row">
     <a href="https://github.com/HarshJoshi123/SocialMediaProject" target="_blank" className="btn col-md-4 d-flex justify-content-center text-white  "> <div className=" d-flex align-self-center "> Git Link </div></a>
    <div className="col-md-4 .col-6 d-flex flex-column align-items-center ">
    <p className=" text-white text-muted"> © 2020-2021 </p>     
   <p className="text-white"> ALL RIGHTS RESERVED </p>
     </div>
<a href="https://www.linkedin.com/in/harsh-joshi-a87454198/" target="_blank" className="col-md-4 btn d-flex text-white justify-content-center text-center">
    <div className="d-flex align-self-center "> FOLLOW </div> 

     </a>


</div>

</footer>



)}
</div>


		)
}

}
export default Posts