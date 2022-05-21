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
        <Button id="btn-action" href="/rescue">
          Rescue your assets
        </Button>
      </div>

      <Container>
        <Row className="m-5 section" id="what">
          <Row>
            <h2>What</h2>
          </Row>
          <Row>
            <Col>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release
              of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software
              like Aldus PageMaker including versions of Lorem Ipsum.
            </Col>
          </Row>
        </Row>
        <Row className="m-5 section" id="how">
          <Row>
            <h2>How</h2>
          </Row>
          <Row>
            <Col>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release
              of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software
              like Aldus PageMaker including versions of Lorem Ipsum.
            </Col>
          </Row>
        </Row>
        <Row className="m-5 section" id="who">
          <Row>
            <h2>Who</h2>
          </Row>
          <Row>
            <Col>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release
              of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software
              like Aldus PageMaker including versions of Lorem Ipsum.
            </Col>
          </Row>
        </Row>
      </Container>
    </>
  );
}

export default Home;
