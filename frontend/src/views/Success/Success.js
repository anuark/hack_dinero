import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const Success = () => {
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
                <input readOnly value={"0x0232332"} />
              </Col>
            </Row>
            <Row>
              <Col>Secured at: </Col>
              <Col>
                <input readOnly value={"0x0232332"} />
              </Col>
            </Row>
            <Row>
              <Col>Number of tokens: </Col>
              <Col>
                <input readOnly value={"0x0232332"} />
              </Col>
            </Row>
            <Row>
              <Col>Estimated at: </Col>
              <Col>
                <input readOnly value={"0x0232332"} />
              </Col>
            </Row>
            <Row>
              <Col>Transaction info: </Col>
              <Col>
                <input readOnly value={"0x0232332"} />
              </Col>
            </Row>
            <Row>
              <Col>Option to tip us: </Col>
              <Col>
                <input readOnly value={"0x0232332"} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Success;
