import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { ethers } from "ethers";
import reactrecoverERC20Funds from '../../scripts/reactERC20FlashBundle';
import reactrecoverERC721Funds from '../../scripts/reactERC721FlashBundle';
const { ethereum } = window;


const Rescue = ( signer, setSigner, provider, setProvider, addr, setAddr ) => {
    async function connectWalletHandler() {
        if (ethereum) {
            await ethereum.request({method: 'eth_requestAccounts'});
            const provider = new ethers.providers.Web3Provider(ethereum);
            setProvider(provider);
            const signer = await provider.getSigner();
            setSigner(signer);
            const address = await signer.getAddress();
            setAddr(address);
        }
    }

    async function rescueFunc(exposedEOA, addr, frozenContract, type) {
        if(type === 20) {
            reactrecoverERC20Funds(exposedEOA, addr, frozenContract);
        }
        else if(type === 721) {
            reactrecoverERC721Funds(exposedEOA, addr, frozenContract)
        }
    }
    const onSubmit = () => {
        console.log('on submit');
    };

    return (
        <React.Fragment>
            <Container className="text-white">
                <form id="rescue-form" onSubmit={onSubmit}>
                <Row>
                    <Col>
                        <div className="form-outline">
                            <label className="form-label" htmlFor="formControlLg">Exposed Private Key</label>
                            <input type="text" id="formControlLg" className="form-control form-control-lg" />
                        </div>
                    </Col>
                </Row>

                {/* <Row>
                    <Col>
                        <div className="form-outline">
                            <label className="form-label" htmlFor="formControlDefault">Secure Public Key</label>
                            <input type="text" id="formControlDefault" className="form-control" />
                        </div>
                    </Col>
                </Row> */}

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
                        <Button onClick={connectWalletHandler}>Connect Wallet</Button>
                    </Col>
                    <Col>
                        <Button type="submit" onClick={rescueFunc}>Initiate Rescue</Button>
                    </Col>
                </Row>
                </form>
            </Container>
        </React.Fragment>
    );
}

export default Rescue;
