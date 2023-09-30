import React from "react";
import Serveimg from "../../../components/Layout/images/Serve.png";
import WorkImg from "../../../components/Layout/images/work.png";
import ResponceImg from "../../../components/Layout/images/Responce.png";
import HaveImg from "../../../components/Layout/images/Have.png";
import { Link } from "react-router-dom";
import "./WePage.css";

const WePage = () => {
  return (
    <div className="Wepage">
      <div className="div0">
        <div className="class1"></div>
        <h1 className="heading_Wepage">Delivering lasting impact</h1>
      </div>
      <div className="main2">
        <div className="div1">
          <Link to="/Work">
            <img alt="Image 1" src={Serveimg} />
          </Link>
          <h2>We serve</h2>
          <p>
            individuals in crisis and the broader community, prioritizing saving
            lives and ensuring safety during emergencies.
          </p>
        </div>
        <div className="div2">
          <Link to="/map">
            <img alt="Image 2" src={WorkImg} />
          </Link>
          <h2>We work</h2>
          <p>
            in locations, including urban areas, disaster zones, wilderness,
            maritime environments, industrial sites, and more, responding to
            emergencies and saving lives.
          </p>
        </div>
        <div className="div3">
          <Link to="/link3">
            <img alt="Image 3" src={ResponceImg} />
          </Link>
          <h2>We respond</h2>
          <p>as quick as possible to ensure timely assistance and support.</p>
        </div>
        <div className="div4">
          <Link to="/link4">
            <img alt="Image 4" src={HaveImg} />
          </Link>
          <h2>We have</h2>
          <p>
            as quick as possible to ensure timely assistance and support
            previously undertaken a wide range of emergency response, search and
            rescue operations, disaster relief, to save lives and mitigate harm.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WePage;
