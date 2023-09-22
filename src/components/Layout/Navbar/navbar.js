import React from 'react'
import "./navstyle.css"

const navbar = () => {
  return (
    <header className="nav_bar">
      <h1 className="logo"> <a href='/'>  Samraksha sena </a>  </h1>
      <nav>
        <ul class="nav_link">
          <li> <a href="/"> Home </a></li>
          <li> <a href="/map"> Map </a> </li>
          <li> <a href=""> Agencies</a></li>
          <li> <a href=""> Contact</a></li>
          <li> <a href="/communication"> Chat Room</a></li>
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