import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Rescue = () => {
    const navigate = useNavigate();
    useEffect(() => {
        document.getElementById('rescue-form').addEventListener('onsubmit', () => {
            // onsubmit
            navigate('/success');
        });
    });
    return (
        <React.Fragment>
            <Container className="text-white">
                <form id="rescue-form">
                <Row>
                    <Col>
                        <div className="form-outline">
                            <label className="form-label" htmlFor="formControlLg">Exposed Private Key</label>
                            <input type="text" id="formControlLg" className="form-control form-control-lg" />
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div className="form-outline">
                            <label className="form-label" htmlFor="formControlDefault">Secure Public Key</label>
                            <input type="text" id="formControlDefault" className="form-control" />
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div className="form-outline">
                            <label className="form-label" htmlFor="formControlSm">Frozen address</label>
                            <input type="text" id="formControlSm" className="form-control form-control-sm" />
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div className="form-outline">
                            <label className="form-label" htmlFor="formControlSm">Type of asset</label>
                            <input type="text" id="formControlSm" className="form-control form-control-sm" />
                        </div>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col>
                        <Button type="submit">Initiate Rescue</Button>
                    </Col>
                </Row>
                </form>
            </Container>
        </React.Fragment>
    );
}

export default Rescue;
