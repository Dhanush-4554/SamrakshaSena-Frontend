import React from 'react'
import "./navstyle.css"

const navbar = () => {
  return (
    <header className="nav_bar">
      <h1 className="logo">Samraksha sena</h1>
      <nav>
        <ul class="nav_link">
          <li> <a href=""> Home </a></li>
          <li> <a href=""> Map </a> </li>
          <li> <a href=""> Agencies</a></li>
          <li> <a href=""> Contact</a></li>
          <li> <a href=""> Chat Room</a></li>
        </ul>
      </nav>
      <ul className="nav_login">
        <li> <a href=""> Login <b>|</b> </a> </li>
        <li> <a href=""> English </a> </li>
      </ul>
    </header>
  )
}

export default navbar;