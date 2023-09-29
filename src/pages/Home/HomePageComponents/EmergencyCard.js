import emergencySymbol from "../../../components/Layout/images/emergency-symbol.png";
import arrow from "../../../components/Layout/images/right-arrow.jpg";
import "./Card.css";
import { Link } from "react-router-dom";

//import { Link } from 'react-router-dom'

function Card() {
  return (
    <>
      <div className="main">
        <div className="wbox">
          <h1 className="landing_h1">
            **ONE TAP AWAY TO ALERT <br></br>THE RESCUE AUTHOROTIES{" "}
          </h1>
          <div>
            <img className="arrow" src={arrow} />
          </div>
          <div className="btn">
            <Link to="/emergencyForm">
              <button className="button1">
                <div className="btnCon">
                  <img className="eme" src={emergencySymbol} />
                  <p className="emergency-txt">EMEREGENCY</p>
                </div>
              </button>
            </Link>
          </div>
        </div>
        <div className="bbox">
          <h2 className="h2Line">
            WHAT HAPPENS WHEN YOU CLICK THE EMERGENCY BUTTON
          </h2>
          <div className="bboxCon">
            <ul>
              <li>
                Your <span className="weit">LOCATION</span> permission and{" "}
                <span className="weit">PHONE NUMBER</span> will be asked
              </li>
              <li>Nearest available authority will get alerted</li>
              <li>
                <span className="weit">*T&C:</span> Misusage of this button will
                face serious consequences
              </li>
            </ul>
          </div>
        </div>
      </div>

      <br />
    </>
  );
}

export default Card;
