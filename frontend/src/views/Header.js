/* global ethereum */

import React from 'react';
import { ethers } from 'ethers';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
// import Logo from '../assets/logo.png';
import Logo from '../assets/baywatch_logo.png';

const Header = (props) => {
  const { signer, setProvider, setSigner } = props;
  const location = useLocation();

  const connectWallet = async () => {
    await ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(ethereum);

    setProvider(provider);
    setSigner(provider.getSigner());
  }

  return (
    <Navbar bg="dark" variant="light">
      <Container>
        <Navbar.Brand href="/home" className="ms-5">
          <img alt="logo" src={Logo} width="166" className="d-inline-block align-top" />
        </Navbar.Brand>
        {/*<Navbar.Brand href="/">
          <img
            alt=""
            src={Logo}
            width="144"
            height="96"
            className="d-inline-block align-top"
          />{' '}
        </Navbar.Brand>*/}

        { ['/', '/home'].includes(location.pathname) ?
          <Nav defaultActiveKey="/home" as="ul" className="me-auto justify-content-center">
            <Nav.Link className="text-white" href="#what">
              What we do
            </Nav.Link>
            <Nav.Link className="text-white" href="#how">
              How we do it
            </Nav.Link>
            <Nav.Link className="text-white" href="#who">
              Who is it for
            </Nav.Link>
            <Nav.Link className="text-white" href="/rescue">
              Rescue assets
            </Nav.Link>
            {/* <Nav.Link href="/">Submit Proposal</Nav.Link> */}
          </Nav>
          :
          <Nav>
            <Nav.Link className="text-white" href="/rescue">
              Rescue assets
            </Nav.Link>
          </Nav>
        }
        <Nav>
          <Nav.Item className="text-white">{Object.keys(signer).length === 0 ? <Button onClick={connectWallet}>Connect Wallet</Button> : '⚡️ Wallet Connected'}</Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
