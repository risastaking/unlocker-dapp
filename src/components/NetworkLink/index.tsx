import React from 'react';
import * as Dapp from "@elrondnetwork/dapp";
import { Link } from 'react-router-dom';

interface NetworkLinkType {
  className?: string;
  title?: string;
  onClick?: () => void;
  to: string;
  'data-testid'?: string;
  children: React.ReactNode | string;
}

const NetworkLink = ({ to, children, ...rest }: NetworkLinkType) => {
  const { address, explorerAddress } = Dapp.useContext();

  if (!to.startsWith('/')) {
    console.error('Link not prepeded by / : ', to);
    to = `/${to}`;
  }

  const props = {
    to: explorerAddress ? `${explorerAddress}${to}` : to,
    ...rest,
  };
  return <a  target="_blank" href={props.to} rel="noopener noreferrer"  {...props}>{children}</a>;
};

export default NetworkLink;
