
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { ethers } from "ethers";
import reactrecoverERC20Funds from '../../scripts/reactERC20FlashBundle';
import reactrecoverERC721Funds from '../../scripts/reactERC721FlashBundle';
const { ethereum } = window;


const Rescue = ( signer, setSigner, provider, setProvider, addr, setAddr ) => {
    useEffect(() => {
        document.getElementById('rescue-form').addEventListener('onsubmit', () => {
            // onsubmit
        });
    });

    const [exposedEOA, setExposedEOA] = useState(0);
    const [frozenContract, setFrozenContract] = useState(0);
    const [tokenType, setTokenType] = useState(true);

    const updateExposedEOA = (e) => {
        setExposedEOA(e.target.value);
    }

    const updatedFrozenContract = (e) => {
        setFrozenContract(e.target.value);
    }

    const updateType = (e) => {
        setTokenType(e.target.value)
    }

    async function connectWalletHandler() {
        if (ethereum) {
            await ethereum.request({method: 'eth_requestAccounts'});
            const provider = new ethers.providers.Web3Provider(ethereum);
            setProvider(provider);
            const Signer = await provider.getSigner();
            setSigner(Signer);
            const address = await signer.getAddress();
            setAddr(address);
        }
    }

    async function rescueFunc(exposedEOA, signer, frozenContract, type) {
        // TRUE radio
        if(type === 20) {
            reactrecoverERC20Funds(exposedEOA, signer, frozenContract);
        }
        // FALSE radio
        else if(type === 721) {
            reactrecoverERC721Funds(exposedEOA, signer, frozenContract)
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
                        <div class="form-outline">
                            <label class="form-label" for="formControlLg">Exposed Private Key</label>
                            <input type="text" id="formControlLg" class="form-control form-control-lg" onChange={updateExposedEOA} /><br/>
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
                        <div class="form-outline">
                            <label class="form-label" for="formControlSm">Frozen address</label>
                            <input type="text" id="formControlSm" class="form-control form-control-sm" onChange={updatedFrozenContract}/><br/>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div class="form-outline">
                            <label class="form-label" for="formControlSm">Type of asset<br/>
                                <input type="radio" value="ERC20"  id="" class="" /> ERC20<br/>
                                <input type="radio" value="ERC721"  id="" class="" /> ERC721
                            </label>
                        </div>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col>
                        <Button onClick={connectWalletHandler}>Connect Wallet</Button>
                    </Col>
                    <Col>
                        <Button type="submit" onClick={() => rescueFunc(exposedEOA, signer, frozenContract, )}>Initiate Rescue</Button>
                    </Col>
                </Row>
                </form>
            </Container>
        </React.Fragment>
    );
}

export default Rescue;
