import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

import video from '../../assets/baywatch.mp4';
import './Home.css';

function Home() {
  return (
    <>
      <div className="video-wrapper">
        <video playsInline autoPlay muted loop poster="polina.jpg" id="bgvid">
          <source src={video} type="video/mp4" />
        </video>
        <div id="mask"></div>
        <Button variant="outline-primary" id="btn-action" href="/rescue">
          Rescue your assets
        </Button>
      </div>

      <Container>
        <Row className="m-5 section" id="what">
          <Row>
            <h2>What do we do?</h2>
          </Row>
          <Row>
            <Col>
              With the help of <a href="https://docs.flashbots.net/">Flashbots</a>, we make it possible to save your 
              assets in the case that your account's private keys are exposed. Due to how ERC20 and ERC721 
              token's ownership is assigned, simply having your private keys does not mean a hacker can steal them. 
              In fact, there is no way for them to know that you even have them! So what's the problem? Well, Ethereum 
              is <a href="https://www.paradigm.xyz/2020/08/ethereum-is-a-dark-forest">Dark Forest</a>. Put simply, 
              this means that as soon as you try to access these assets by transferring them to a new, secure wallet a 
              hacker will see what you're doing and make that transaction themselves. 
            </Col>
          </Row>
        </Row>
        <Row className="m-5 section" id="how">
          <Row>
            <h2>How</h2>
          </Row>
          <Row>
            <Col>
              There are a few steps that need to be taken before an ERC20 that is held by an exposed account can be transfered. 
              For example, you first need to add ether into that account to pay for gas. As soon as you do that though, the hacker
              will programatically send that ether to themselves. What we are able to do is not only fund your account, but also 
              execute the transfer privately and without the hacker being notified! This means that the hacker isn't aware
              of what you're doing until it's done and cannot hijack your transactions at any point.  
            </Col>
          </Row>
          <Row>
            <Col>
              If that sounds like something you're interested in we'll just need some basic info about your upcoming rescue. We will
              not ask you for the private key of your secure account, but we will need you to provide the private key of the already 
              exposed account. This is so we can use it to authorize the token transfer into your new wallet.
            </Col>
          </Row>
        </Row>
        <Row className="m-5 section" id="who">
          <Row>
            <h2>Who</h2>
          </Row>
          <Row>
            <Col>
              This project was created during EthGlobal's <a href="https://hackathon.money/">Hack Money</a> hackathon. On crypto's road
              to adoption, one of the largest hurdles is security and consumer protection. Our goal was to help overcome those problems, 
              so we are very excited to be able to provide this service to the community. 
            </Col>
          </Row>
          <Row>
            <Col>
              The github repository can be found <a href="https://github.com/anuark/hack_dinero">here.</a>
            </Col>
          </Row>
        </Row>
      </Container>
    </>
  );
}

export default Home;
