import React, { useState } from 'react'
import logo from '../img/welcomecut.jfif'
import '../css/Navbar.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function Navbar({login}) {
  const [show,setShow]= useState(false)
  const token = localStorage.getItem("token");
  const navigate = useNavigate()

  const logoutfun=()=>{
    localStorage.clear();
    navigate('/signin')
  }

  const togglemenu=()=>{
    if(show){
      setShow(false)
    }else{
      setShow(true)
    }
  }
  const loginStatus = () => {

    if(token || login){
      return [
    <>
    <li><Link to="/">Home</Link></li>
    <li><Link to="/profile">Profile</Link></li>
    <li><Link to="/createpost">Upload</Link></li>
    <li><Link to="/followingpost">FollowingPost</Link></li>
    
    <button onClick={()=>{logoutfun()}}>Log out</button>
    </>
      ]
    }
    else{
      return [
      <>
        <li><Link to="/signin">SignIn</Link></li>
        <li><Link to="/signup">SignUp</Link></li>
      </>
      ]
    }
  }
  const loginStatusMobile = () => {
    const token = localStorage.getItem("token");
    if(token || login){
      return [
    <>
    <div className="mobile-nav">

    <span class="material-symbols-outlined menu" onClick={togglemenu}>menu
    <div className='menu-bar'>
    <li><Link to="/">Home</Link></li>
    <li><Link to="/profile">Profile</Link></li>
    <li><Link to="/createpost">Upload</Link></li>
    <li><Link to="/followingpost">FollowingPost</Link></li>
    <li><Link to="/signup">SignUp</Link></li>
    <button onClick={()=>{logoutfun()}}>Log out</button>
    </div>
    </span>
    </div>
    
    </>
      ]
    }
  }

  return (
    <div className='navbar'>
        <img id='logo' src={logo} alt="error"/>
        <ul className='nav-menu'>
            {loginStatus()}    
        </ul>
        <ul className='nav-mobile'>
            {loginStatusMobile()} 
        </ul>
    </div>
  )
}
