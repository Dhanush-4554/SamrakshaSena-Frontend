import React from 'react'
import "./navstyle.css"
import { ChatState } from '../../../context/ChatProvider'


const navbar = ({CurrentUser}) => {

  //console.log(CurrentUser);

  var link;

  if(CurrentUser){
    link = '/communication';
  } else{
    link = '/login';
  }

  return (
    <header className="nav_bar">
      <h1 className="logo"> <a href='/'>  Samraksha sena </a>  </h1>
      <nav>
        <ul class="nav_link">
          <li> <a href="/"> Home </a></li>
          <li> <a href="/map"> Agencies Location </a> </li>
          <li> <a href=""> Contact</a></li>
          <li> <a href={link}> Chat Room</a></li>
        </ul>
      </nav>
      <ul className="nav_login">
        <li> <a href="/login"> Login <b>|</b> </a> </li>
        <li> <a href=""> English </a> </li>
      </ul>
    </header>
  )
}

export default navbar;