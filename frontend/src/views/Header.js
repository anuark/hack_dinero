import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

import Logo from '../assets/baywatch_logo.png';

const Header = ({ signer }) => {
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
          {/* <Nav.Link href="/">Submit Proposal</Nav.Link> */}
        </Nav>
        <Nav>
          <Nav.Item className="text-white">{signer != null ? '⚡️ Wallet Connected' : 'No wallet connected'}</Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
