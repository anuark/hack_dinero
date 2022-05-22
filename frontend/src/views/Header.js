import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

import MetamaskIcon from '../components/MetamaskIcon';
import { useWallet } from '../providers/Wallet';
import Logo from '../assets/EOA-watch.png';

function Header() {
  const location = useLocation();
  const { signer, connectWallet } = useWallet();

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

        {['/', '/home'].includes(location.pathname) ? (
          <Nav defaultActiveKey="/home" className="me-auto">
            <Nav.Link className="text-white" href="#what">
              What
            </Nav.Link>
            <Nav.Link className="text-white" href="#how">
              How
            </Nav.Link>
            <Nav.Link className="text-white" href="#who">
              Who
            </Nav.Link>
            <Nav.Link className="text-white" href="/rescue">
              Rescue
            </Nav.Link>
            {/* <Nav.Link href="/">Submit Proposal</Nav.Link> */}
          </Nav>
        ) : (
          <Nav className="me-auto">
          </Nav>
        )}
        <Nav>
          <Nav.Item className="text-white">
            {signer ? (
              '⚡️ Wallet Connected'
            ) : (
              <Button variant="outline-primary" onClick={connectWallet}>
                <MetamaskIcon size="1.5rem" /> Connect Wallet
              </Button>
            )}
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
