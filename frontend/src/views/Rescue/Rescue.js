import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { ethers } from "ethers";
import reactrecoverERC20Funds from '../../scripts/reactERC20FlashBundle';
import reactrecoverERC721Funds from '../../scripts/reactERC721FlashBundle';
const { ethereum } = window;


const Rescue = (props) => {
    const { signer, setSigner, setProvider } = props;
    const [exposedEOA, setExposedEOA] = useState(0);
    const [frozenContract, setFrozenContract] = useState(0);

     // FOR RADIO
    const [tokenType, setTokenType] = useState(0);

    const updateExposedEOA = (e) => {
        setExposedEOA(e.target.value);
    }

    const updatedFrozenContract = (e) => {
        setFrozenContract(e.target.value);
    }

    async function connectWalletHandler() {
        if (ethereum) {
            await ethereum.request({method: 'eth_requestAccounts'});
            const provider = new ethers.providers.Web3Provider(ethereum);
            setProvider(provider);
            setSigner(provider.getSigner());
            // const address = await signer.getAddress();
            // setAddr(address);
        }
    }

    async function rescueFunc(exposedEOA, frozenContract) {
        console.log(signer)
        if(document.getElementById('20').checked) {
            reactrecoverERC20Funds(exposedEOA, signer, frozenContract);
        }
        else if(document.getElementById('721').checked) {
            reactrecoverERC721Funds(exposedEOA, signer, frozenContract);
        }
    }

    const onSubmit = () => {
        console.log('on submit');
    };

    // FOR RADIO
    const updateType = (e) => {
        setTokenType(e.target.value)
    }

    console.log(signer, 'signer');

    return (
        <React.Fragment>
            <Container className="text-white">
                <form id="rescue-form" onSubmit={onSubmit}>
                <Row>
                    <Col>
                        <div className="form-outline">
                            <label className="form-label" htmlFor="formControlLg">Exposed Private Key</label>
                            <input type="text" id="formControlLg" className="form-control form-control-lg" onChange={updateExposedEOA} /><br/>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div className="form-outline">
                            <label className="form-label" htmlFor="formControlSm">Frozen address</label>
                            <input type="text" id="formControlSm" className="form-control form-control-sm" onChange={updatedFrozenContract}/><br/>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div className="form-outline">
                            <p>Type of Token:</p>
                            <div>
                                <input name="selector" type="radio" value="20" id="20"/> ERC20
                            </div>
                            <div>
                                <input name="selector" type="radio" value="721" id="721"/> ERC721
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col>
                        <Button onClick={connectWalletHandler}>Connect Wallet</Button>
                    </Col>
                    <Col>
                        <Button onClick={() => rescueFunc(exposedEOA, signer, frozenContract)}>Initiate Rescue</Button> 
                        {/* commented out `type=submit` */}
                    </Col>
                </Row>
                </form>
            </Container>
        </React.Fragment>
    );
}

export default Rescue;
