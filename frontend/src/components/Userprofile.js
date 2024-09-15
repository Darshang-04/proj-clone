import React, {useState, useEffect} from 'react'
import '../css/Profile.css'
// import PostDetail from './PostDetail'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
// 8657286846
export default function Userprofile() {
  const defaultpic = "https://th.bing.com/th/id/OIP.SAcV4rjQCseubnk32USHigHaHx?rs=1&pid=ImgDetMain"
  const {userid} = useParams()
  // console.log(userid)
  const [user, setUser]= useState("")
  const [post, setPost]= useState([])
  const [isfollow, setIsfollow] = useState(false)

  useEffect(()=>{
    fetch(`/user/${userid}`,{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("token")
      },
    }).then(res=>res.json())
    .then(result=>{
        // console.log(result)
        setUser(result.user)
        setPost(result.post || [])
        if(result.user.followers.includes(JSON.parse(localStorage.getItem("user"))._id)){
          setIsfollow(true)
        }
    })
  },[userid, isfollow])

  const followUser = (userId)=>{
    fetch('/follow',{
      method:"put",
      headers:{
        "Content-Type":'application/json',
        "Authorization":"Bearer "+localStorage.getItem("token")
      },
      body:JSON.stringify({
        followId:userId
      })
    }).then((res)=>res.json())
      .then((data)=>{
      console.log(data)
      setIsfollow(true)
    })
  }
  const UnfollowUser = (userid)=>{
    fetch('/unfollow',{
      method:"put",
      headers:{
        "Content-Type":'application/json',
        "Authorization":"Bearer "+localStorage.getItem("token")
      },
      body:JSON.stringify({
        followId:userid
      })
    }).then((res)=>res.json())
      .then((result)=>{
      console.log(result)
      setIsfollow(false)
    })
  }

  return (
    <div className='profile'>
      <div className="profile-frame">
        <div className="profile-pic">
          <img src={user.photo ? user.photo : defaultpic} alt="oops" />
        </div>
        <div className="profile-data">
          <h1>{user.name}</h1>
          <div style={{display: "flex", alignItems: "center"}}>
            <p className='posts'>{post.length} Post</p>
          <button className='followbtn' onClick={()=>{
            if(isfollow){
              
              UnfollowUser(user._id)
            }else{
              followUser(user._id)
            }
            followUser(user._id)}}>{isfollow ? "UnFollow" : "Follow"}</button>
            <button className='followbtn' style={{color: "white"}}>
              Following
              </button>
          </div>
          <div className="profile-info">
            <p>Posts</p>
            <p>{user.followers ? user.followers.length : "0"} Followers</p>
            <p>{user.following ? user.following.length : "0"} Following</p>
          </div>
        </div>
      </div>
      <hr style={{
        width:"100%",
        margin:"25px auto",
        opacity:"0.8"
        }}/>
      <div className="gallery">
        {post.length>0 ? (
          post.map((pics)=>{
            return <img key={pics._id} src={pics.photo} alt='oops' />
          })
        ):(
          <p>No posts Available</p>
        )
        }
      </div>
      {/* {show && 
      <PostDetail item={posts} toggleshow={toggleshow}/>
      } */}
    </div>
  )
}
