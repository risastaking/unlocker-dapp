import React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { Navbar as BsNavbar, NavItem, Nav } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import LKMexIcon from "../../../assets/img/lkmex.svg"
import { dAppName } from "../../../config";
import Trim from "../../../components/Trim";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faUser } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { loggedIn, address, explorerAddress } = Dapp.useContext();
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
        className="navbar-brand"
        to={loggedIn ? "/dashboard" : "/"}
      >
        <LKMexIcon className="token-icon-large" />
        <span className="navbar-text dapp-name">{dAppName}</span>
      </Link>

      <div className="container d-none d-md-block"></div>

      {!loggedIn && (
        <NavItem >
          <Link
            className="btn btn-primary px-sm-4 m-1 mx-sm-3"
            to="walletconnect"
          >
            Connect
          </Link>
        </NavItem>

      )}

      {loggedIn && (
        <span className="navbar-address text-muted">
          <a
            href={`${explorerAddress}/accounts/${address}`}
            {...{
              target: "_blank",
            }}
            title="View in Explorer"
          >
            <Trim text={address} />
          </a>

        </span>
      )}

      {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
        aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button> */}
      {loggedIn && (
        <a href="/" onClick={logOut}>
          <button type="button" className="btn btn-outline-primary">Logout</button>
        </a>
      )}
    </nav>
  );
};

export default Navbar;
