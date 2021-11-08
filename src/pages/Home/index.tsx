import * as React from "react";
import { Link } from "react-router-dom";
import { dAppName } from "../../config";
import { routeNames } from "../../routes";
import MexIcon from "../../assets/img/mex.svg"
import LKMexIcon from "../../assets/img/lkmex.svg"
import {
  faCircle,
  faArrowDown
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home = () => {
  return (
    <div className="d-flex flex-fill align-items-center container">
      <div className="row w-100">
        <div className="col-12 col-md-8 col-lg-5 mx-auto">
          <div className="card shadow-sm rounded p-4 border-0">
            <div className="card-body text-center">
              <h2 className="mb-3" data-testid="title">
                <LKMexIcon className="token-icon-large" />LKMEX
              </h2>
              <h2>
                <span className="fa-layers fa-fw">
                  <FontAwesomeIcon className="light-bg" icon={faCircle} />
                  <FontAwesomeIcon className="light-fg" icon={faArrowDown} />
                </span>
              </h2>
              <h2>
                <MexIcon className="token-icon-large" />MEX&nbsp;&nbsp;
              </h2>
              <p className="mb-3">
                Unlock your MEX. Unlock your future 😲
                <br /> Login using your Elrond wallet.
              </p>

              <Link
                to={routeNames.unlock}
                className="btn btn-primary mt-3"
                data-testid="loginBtn"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="card shadow-sm rounded p-4 border-0">
            <div className="card-body text-center">
              <h2 className="mb-3" data-testid="title">
                Available Liquidity
              </h2>
              <p>XXX.XX <MexIcon className="token-icon" />MEX</p>

              <h2 className="mb-3" data-testid="title">
                Service Fee
              </h2>
              <p>20%</p>



            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
