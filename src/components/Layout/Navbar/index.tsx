import React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { Navbar as BsNavbar, NavItem, Nav } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import LKMexIcon from "../../../assets/img/lkmex.svg"
import { dAppName } from "../../../config";
import Trim from "../../../components/Trim";

const Navbar = () => {
  const { loggedIn, address } = Dapp.useContext();
  const dappLogout = Dapp.useLogout();
  const history = useHistory();

  const logOut = (e: React.MouseEvent) => {
    e.preventDefault();
    dappLogout({ callbackUrl: `${window.location.origin}/` });
    history.push("/");
  };

  return (

    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 py-3">
      <Link
        className="navbar-brand mr-auto"
        to={loggedIn ? "/dashboard" : "/"}
      >
        <LKMexIcon className="token-icon-large" />
        <span className="navbar-text dapp-name">{dAppName}</span>
      </Link>

      {loggedIn && (
        <div className="container-fluid ml-auto"><Trim text={address} color="text-muted" /></div>
      )}

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        {/* <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <a className="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul> */}
        {loggedIn && (
          <a href="/" onClick={logOut}>
            <button type="button" className="btn btn-outline-primary">Logout</button>
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
