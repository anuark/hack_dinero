import React from 'react';
import { Navigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import { useWallet } from '../../providers/Wallet';

const Success = () => {
  const { signer, recoveredFunds } = useWallet();

  if (!signer) {
    // TODO: review auto-connecting to wallet
  }

  if (!recoveredFunds) {
    // TODO: review this approach
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <h2>Congrats you have saved your assets</h2>
          </Col>
          <Col>
            <Row>
              <Col>Recovered From: </Col>
              <Col>
                <input readOnly value={'0x0232332'} />
              </Col>
            </Row>
            <Row>
              <Col>Secured at: </Col>
              <Col>
                <input readOnly value={'0x0232332'} />
              </Col>
            </Row>
            <Row>
              <Col>Number of tokens: </Col>
              <Col>
                <input readOnly value={'0x0232332'} />
              </Col>
            </Row>
            <Row>
              <Col>Estimated at: </Col>
              <Col>
                <input readOnly value={'0x0232332'} />
              </Col>
            </Row>
            <Row>
              <Col>Transaction info: </Col>
              <Col>
                <input readOnly value={'0x0232332'} />
              </Col>
            </Row>
            <Row>
              <Col>Option to tip us: </Col>
              <Col>
                <input readOnly value={'0x0232332'} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Success;
