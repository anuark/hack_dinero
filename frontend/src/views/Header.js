import React from 'react';
import { Navbar, Nav, Form, FormControl, Button, Container } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import Logo from '../assets/logo.png';
import Logo from '../assets/baywatch_logo.png';

const Header = () => {
    return (
        <Navbar bg="dark" variant="light">
            <Container>
                {/*<Navbar.Brand href="/">
          <img
            alt=""
            src={Logo}
            width="144"
            height="96"
            className="d-inline-block align-top"
          />{' '}
        </Navbar.Brand>*/}

                <Nav className="me-auto justify-content-center">
                    <Nav.Link className="text-white" href="#what">What we do</Nav.Link>
                    <Nav.Link className="text-white" href="#how">How we do it</Nav.Link>
                    <Nav.Link className="text-white" href="#who">Who is it for</Nav.Link>
                    {/* <Nav.Link href="/">Submit Proposal</Nav.Link> */}
                    <Navbar.Brand href="/home" className="ms-5">
                        <img
                            alt="logo"
                            src={Logo}
                            width="166"
                            className="d-inline-block align-top" />
                    </Navbar.Brand>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Header;

