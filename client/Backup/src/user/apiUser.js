import React from "react"
const fs=require('fs') //for file system
const _=require("lodash") 

export const remove=(userId,token)=>{
return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`,{

    method:"DELETE",
    headers:{
    	Accept:"application/json",
        "Content-type":"application/json",
          Authorization:`Bearer ${token}`
    }
}).then(response=>{
return response.json()
})
.catch(err=>console.log(err));


}


export const read=(userId,token)=>{

return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`,{

    method:"GET",
    headers:{
    	Accept:"application/json",
        "Content-type":"application/json",
          Authorization:`Bearer ${token}`
    }
}).then(response=>{
return response.json()
})
.catch(err=>console.log(err));


}

export const update=(userId,token,user)=>{

return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`,{

    method:"PUT",
    headers:{
    	Accept:"application/json",
          Authorization:`Bearer ${token}`
    },
    body:user           //Dont stringify as if is already Formdata() hence content type not json
}).then(response=>{
return response.json()
})
.catch(err=>console.log(err));


}

export const list=()=>{
return fetch(`${process.env.REACT_APP_API_URL}/users`,{

    method:"GET",
   
}).then(response=>{
return response.json()
})
.catch(err=>console.log(err));



}

export const updateUser=(user,next)=>{
    if(typeof window!=="undefined"){              //edits user in token when it is edited in EditProfile
      if(localStorage.getItem("jwt")){
        
        console.log(user)
        let auth=JSON.parse(localStorage.getItem("jwt"))
 
        auth=_.extend(auth,user); //depends on req sent by user
        localStorage.setItem("jwt",JSON.stringify(auth))
         
        next();
      }

    }
}

export const follow=(userId,token,followId)=>{

return fetch(`${process.env.REACT_APP_API_URL}/user/follow`,{

    method:"PUT",
    headers:{
        Accept:"application/json",
        "Content-type":"application/json",
          Authorization:`Bearer ${token}`
    },
    body:JSON.stringify({userId,followId})           
}).then(response=>{
return response.json()
})
.catch(err=>console.log(err));


}

export const unfollow=(userId,token,unfollowId)=>{

return fetch(`${process.env.REACT_APP_API_URL}/user/unfollow`,{

    method:"PUT",
    headers:{
        Accept:"application/json",
        "Content-type":"application/json",
          Authorization:`Bearer ${token}`
    },
    body:JSON.stringify({userId,unfollowId})           
}).then(response=>{
return response.json()
})
.catch(err=>console.log(err));


}

export const findPeople=(userId,token)=>{
return fetch(`${process.env.REACT_APP_API_URL}/user/findpeople/${userId}`,{

methd:"GET",
headers:{
        Accept:"application/json",
        "Content-type":"application/json",
          Authorization:`Bearer ${token}`
    }
               
}).then(response=>{
return response.json()
})
.catch(err=>console.log(err));




}