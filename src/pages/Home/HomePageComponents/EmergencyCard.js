import emergencySymbol from "../../../components/Layout/images/emergency-symbol.png"
import arrow from '../../../components/Layout/images/right-arrow.jpg'
import './Card.css';
//import { Link } from 'react-router-dom'

function Card() {

    return (
        <>
            <div className="main">
                <div className="wbox">
                    <h1 className="landing_h1">**ONE TAP AWAY TO ALERT <br></br>THE RESCUE AUTHOROTIES </h1>
                    <div >
                        <img className="arrow" src={arrow} />
                    </div>
                    <div className="btn">
                        <button className="button1">
                            <div className="btnCon">
                                <img className="eme" src={emergencySymbol} />
                                <p className="emergency-txt">EMEREGENCY</p>
                            </div>
                        </button>
                    </div>
                </div>
                <div className="bbox">
                    <div className="bboxCon">
                        <h2>WHAT HAPPENS WHEN YOU CLICK THE EMERGENCY BUTTON</h2>
                        <ul>
                            <li>Your <b>LOCATION</b>  permission and <b>PHONE NUMBER</b> will be asked</li>
                            <li>Nearest available authority will get alerted</li>
                            <li><b>*T&C:</b> Misusage of this button will face serious consequences</li>
                        </ul>
                    </div>
                </div>
            </div>

            <br />
        </>



    )
}

export default Card;