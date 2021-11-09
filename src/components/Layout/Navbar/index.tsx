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
    <BsNavbar className="bg-white border-bottom px-4 py-3">
      <div className="container-fluid">
        <Link
          className="d-flex align-items-center navbar-brand mr-0"
          to={loggedIn ? "/dashboard" : "/"}
        >
          <LKMexIcon className="token-icon-large" />
          <span className="dapp-name text-muted">{dAppName}</span>
        </Link>

        <Nav className="ml-auto">
          {loggedIn && (
            <><NavItem className="mr-3 navbar-address">
              <span className="text-muted"><Trim text={address} /></span>
            </NavItem>
            <NavItem>
                <a href="/" onClick={logOut}>
                  <button type="button" className="btn btn-outline-primary">Logout</button>
                </a>
              </NavItem></>
          )}
        </Nav>
      </div>
    </BsNavbar>
  );
};

export default Navbar;
