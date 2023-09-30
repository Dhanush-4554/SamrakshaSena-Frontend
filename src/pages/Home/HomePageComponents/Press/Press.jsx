import React from 'react'
import './press.css'
import flood from '../../../../components/Layout/images/flood.jpg'
import earth from '../../../../components/Layout/images/earthquake.jpg'
import fire from '../../../../components/Layout/images/fire.jpg'
const Press = () => {
  return (
    <div className='press'>
    <div className='top'>
      <div className='line'></div>
      <h1>Press Updates</h1>
    </div>
    <div className='card'>
      <figure>
        <img src ={flood}></img>
        <figcaption>
        <ul>
          <li>Death toll in Himachal rises to 31, chief minister takes aerial survey of state. </li>
          <li>17 September 2023</li>
        </ul></figcaption>
      </figure>
      <figure>
        <img src={fire}></img>
        <figcaption>
        <ul>
          <li>Death toll in Himachal rises to 31, chief minister takes aerial survey of state.</li>
          <li>19 September 2023</li>
        </ul></figcaption>
      </figure>
      <figure>
        <img src={earth}></img>
        <figcaption>
        <ul>
          <li>Death toll in Himachal rises to 31, chief minister takes aerial survey of state. </li>
          <li>20 September 2023</li>
        </ul></figcaption>
      </figure>
    </div>
    </div>
  )
}

export default Press