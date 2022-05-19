import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Rescue = () => {
    useEffect(() => {
        document.getElementById('rescue-form').addEventListener('onsubmit', () => {
            // onsubmit
        });
    });
    return (
        <React.Fragment>
            <Container className="text-white">
                <form id="rescue-form">
                <Row>
                    <Col>
                        <div class="form-outline">
                            <label class="form-label" for="formControlLg">Exposed Private Key</label>
                            <input type="text" id="formControlLg" class="form-control form-control-lg" />
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div class="form-outline">
                            <label class="form-label" for="formControlDefault">Secure Public Key</label>
                            <input type="text" id="formControlDefault" class="form-control" />
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div class="form-outline">
                            <label class="form-label" for="formControlSm">Frozen address</label>
                            <input type="text" id="formControlSm" class="form-control form-control-sm" />
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div class="form-outline">
                            <label class="form-label" for="formControlSm">Type of asset</label>
                            <input type="text" id="formControlSm" class="form-control form-control-sm" />
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
