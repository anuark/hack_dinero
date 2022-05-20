import React, { useEffect } from 'react';
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

    async function connectWalletHandler() {
        if (ethereum) {
            await ethereum.request({method: 'eth_requestAccounts'})
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
            const ERC20_ABI = [
                "function name() view returns (string)",
                "function symbol() view returns (string)",
                "function totalSupply() view returns (uint256)",
                "function balanceOf(address) view returns (uint)",
                "function transfer(address,uint256) external returns (bool)",
            ];
            reactrecoverERC20Funds(exposedEOA, addr, frozenContract, ERC20_ABI);
        }
        else if(type === 721) {
            const ERC721_ABI = [
                "function name() public view virtual override returns (string memory)",
                "function symbol() public view virtual override returns (string memory)",
                "function _exists(uint256 tokenId) internal view virtual returns (bool)",
                "function _safeMint(address to, uint256 tokenId) internal virtual",
                "function transferFrom(address from, address to, uint256 tokenId) public virtual override",
                "function balanceOf(address owner) public view virtual override returns (uint256)",
                "function ownerOf(uint256 tokenId) public view virtual override returns (address)",
            ];
            reactrecoverERC721Funds(exposedEOA, addr, frozenContract, ERC721_ABI)
        }
    }

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

                {/* <Row>
                    <Col>
                        <div class="form-outline">
                            <label class="form-label" for="formControlDefault">Secure Public Key</label>
                            <input type="text" id="formControlDefault" class="form-control" />
                        </div>
                    </Col>
                </Row> */}

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
