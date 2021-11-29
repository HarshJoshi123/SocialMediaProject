export const signout=(next)=>{
 //next fn is passed as argument which redirects user
 
 if(typeof window!==undefined){
 	localStorage.removeItem("jwt")  //Remove token
 }
 next();
 console.log("laude");
 return fetch(`${process.env.REACT_APP_API_URL}/signout`,{
 	method:"GET"
 }).then(response=>{
console.log('signout',response)
return response.json()
 }).catch(err=>{
 	console.log(err);
 })


}


export const isAuthenticated=()=>{
if(typeof window=="undefined"){
  return false;
}
if(localStorage.getItem("jwt")){

  return JSON.parse(localStorage.getItem("jwt"));
}
else{
   console.log("Not authenticated")

  return false;
}

}

export const authenticate=(jwt,next)=>{
if(typeof window!=="undefined"){   //to check if headers are loaded
  localStorage.setItem("jwt",JSON.stringify(jwt));  //response is stored in cookies which is a token and user
  next(); //argument fn is called
}


}

export const signin=user=>{
	
  return fetch(`${process.env.REACT_APP_API_URL}/signin`,{            //Return fetch is imp.
  method:"POST",
  headers:{
  	Accept:"application/json",
  	"Content-type":"application/json"
  },
  body:JSON.stringify(user)

}).then(response=>{
	
  return response.json();
	
}).catch(err=> console.log("errooooorr"))

}

export const signup=user=>{

  return fetch(`${process.env.REACT_APP_API_URL}/signup`,{            //Return fetch is imp.
  method:"POST",
  headers:{
  	Accept:"application/json",
  	"Content-type":"application/json"
  },
  body:JSON.stringify(user)

}).then(response=>{
	return response.json();
	
}).catch(err=>console.log('Error in Signup'))

}

export const forgotPassword=email=>{
return fetch(`${process.env.REACT_APP_API_URL}/forgot-password`,{
  method:"PUT",
  headers:{
    Accept:"application/json",
    "Content-type":"application/json"
  },
  body:JSON.stringify({email})
}).then(response=>{
  return response.json();
}).catch(err=>console.log(err))

}
export const resetPassword=resetinfo=>{
return fetch(`${process.env.REACT_APP_API_URL}/reset-password`,{
method:"PUT",
headers:{
Accept:"application/json",
"Content-type":"application/json"
},
body:JSON.stringify(resetinfo)

}).then(response=>{
  return response.json()
}).catch(err=>console.log(err))


}