export const createPost=(userId,token,post)=>{
console.log(userId)
return fetch(`${process.env.REACT_APP_API_URL}/post/new/${userId}`,{

method:"POST",
headers:{
	Accept:"application/json",
	Authorization:`Bearer ${token}`
},
body:post

}).then(response=>{
	console.log("No error")
	return response.json()
}).catch(err=>
	console.log(err)
)



}

export const list=()=>{
return fetch(`${process.env.REACT_APP_API_URL}/posts`,{

    method:"GET",
   
}).then(response=>{
return response.json()
})
.catch(err=>console.log(err));



}

export const singlePost=(postId)=>{
return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`,{
   method:"GET"
}).then(response=>{
return response.json()
})
.catch(err=>console.log(err));



}
// //headers:{
//   Accept:"application/json",
//   "Content-type":"application/json",
//   Authorization:`Bearer ${token}`
// } 
// //

export const listByUser=(userId,token)=>{
return fetch(`${process.env.REACT_APP_API_URL}/post/by/${userId}`,{

    method:"GET",
    headers:{
	 Accept:"application/json",
	 'Content-type':"application/json",
	 Authorization:`Bearer ${token}`
       }
   
}).then(response=>{
return response.json()
})
.catch(err=>console.log(err));



}

export const removePost=(postId,token)=>{
return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`,{

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

export const updatePost=(postId,token,post)=>{

return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`,{

    method:"PUT",
    headers:{
      Accept:"application/json",
       Authorization:`Bearer ${token}`
    },
    body:post           //Dont stringify as if is already Formdata() hence content type not json
}).then(response=>{       //Dont make it content type json as it is strictly form data
return response.json()
})
.catch(err=>console.log(err));


}

export const like=(userId,token,postId)=>{
console.log("Like")
return fetch(`${process.env.REACT_APP_API_URL}/post/like`,{

    method:"PUT",
    headers:{
      Accept:"application/json",
       'Content-type':"application/json", 
       Authorization:`Bearer ${token}`
    },
    body:JSON.stringify({userId,postId})           
}).then(response=>{ 
console.log("lode")      
return response.json()
})
.catch(err=>console.log(err));


}

export const unlike=(userId,token,postId)=>{
console.log("unLike")
return fetch(`${process.env.REACT_APP_API_URL}/post/unlike`,{

    method:"PUT",
    headers:{
      Accept:"application/json",
       'Content-type':"application/json", 
       Authorization:`Bearer ${token}`
    },
    body:JSON.stringify({userId,postId})           //We only require postid and userid not post itself
}).then(response=>{       
return response.json()
})
.catch(err=>console.log(err));


}

export const comment=(userId,token,postId,comment)=>{
console.log("Comment")
return fetch(`${process.env.REACT_APP_API_URL}/post/comment`,{

    method:"PUT",
    headers:{
      Accept:"application/json",
       'Content-type':"application/json", 
       Authorization:`Bearer ${token}`
    },
    body:JSON.stringify({userId,postId,comment})           
}).then(response=>{     
return response.json()
})
.catch(err=>console.log(err));


}

export const uncomment=(userId,token,postId,comment)=>{
console.log("unComment")
return fetch(`${process.env.REACT_APP_API_URL}/post/uncomment`,{

    method:"PUT",
    headers:{
      Accept:"application/json",
       'Content-type':"application/json", 
       Authorization:`Bearer ${token}`
    },
    body:JSON.stringify({userId,postId,comment})           
}).then(response=>{     
return response.json()
})
.catch(err=>console.log(err));


}