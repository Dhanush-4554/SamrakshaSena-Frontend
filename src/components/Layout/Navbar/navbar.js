import React from 'react'
import logo from './Web_Logo.jpg'
import logo1 from './Rotating_Logo.gif'
import "./navstyle.css"
import { ChatState } from '../../../context/ChatProvider'
import { Link } from 'react-router-dom';


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
      <Link className="logos" to={"/"}> 
        <img src={logo1} className='gif'/>
        <img src={logo} className="logo"/> 
      </Link>
      <nav>
        <ul class="nav_link">
          <li> <Link to="/"> Home </Link> </li>
          <li> <Link to="/map">  Agencies Location </Link> </li>
          <li> <Link to="#"> Contact </Link> </li>
          <li> <Link to={link}>  Chat Room </Link> </li>
        </ul>
      </nav>
      <ul className="nav_login">
        <li> <Link to="/login">  Login <b>|</b> </Link> </li>
        <li>  English  </li>
      </ul>
    </header>
  )
}

export default navbar;
