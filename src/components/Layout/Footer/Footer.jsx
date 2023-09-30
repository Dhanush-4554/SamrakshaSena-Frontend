import React from 'react';
import './footer.css'
import Insta from '../images/Insta Logo.png'
import fb from '../images/facebook Logo.png'
import x from '../images/twiiter Logo.png'
import yt from '../images/Toutube.png'

const Footer = () => {
  return (
    <div className="foot">
      <div className='touch'>
      <h1>GET IN TOUCH</h1>
      </div>
      <ul className="media">
        <li><img src={Insta} ></img></li>
        <li><img src={fb} ></img></li>
        <li><img src={x} ></img></li>
        <li><img src={yt} ></img></li>
      </ul>
      <address>
      <li>CONTACT US</li>
      <li>Ministry of Home Affairs</li>
      <li>Tel: +91-xxxxxxxxx</li>
      <li>Email: xyz@gmail.com</li>
      </address>
    </div>
  )
}

export default Footer;