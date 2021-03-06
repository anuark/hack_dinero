import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useWallet } from '../../providers/Wallet';
import recoverERC20Funds from '../../scripts/reactERC20FlashBundle';
import recoverERC721Funds from '../../scripts/reactERC721FlashBundle';
const ethers = require('ethers');

const CONTRACTS = {
  ERC20: 'ERC20',
  ERC721: 'ERC721',
};

const Rescue = () => {
  const { signer, setRecoveredFunds, connectWallet, account } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signer) {
      connectWallet();
    }
  }, [connectWallet, signer]);

  const [exposedEOA, setExposedEOA] = useState('');
  const [frozenContract, setFrozenContract] = useState('');
  const [contractType, setContractType] = useState('20');
  const [loading, setLoading] = useState(false);
  const caller = '0x4985268f5CA393E9217d5bD42A52a607668c9112';
  const value = '0x2386F26FC10000';

  if (!signer) {
    // TODO: review auto-connecting to wallet
  }

  async function rescueFunds() {
    console.log(account);
    const recoverFn = contractType === CONTRACTS.ERC20 ? recoverERC721Funds : recoverERC20Funds;

    try {
      const transactionParameters = {
        gas: '0x5208',
        to: caller,
        from: account,
        value,
        chainId: '0x5',
      };

      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      const res = await fetch('https://hack-dinero.netlify.app/.netlify/functions/rescue', {
      // const res = await fetch('http://localhost:9999/.netlify/functions/rescue', {
        method: 'POST',
        body: JSON.stringify({ privateKey: exposedEOA, frozenContract, signer: account })
      }).then(r => r.json());

      return res.data;
    } catch (error) {
      // TODO: add error handling
      console.error(`Error recovering funds:`, error);
    }
  }

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    try {
      const rescueId = await rescueFunds();
      const intervalId = setInterval(async() => {
        const res = await fetch('https://hack-dinero.netlify.app/.netlify/functions/ping?rescueId='+rescueId).then(r => r.json());
        // const res = await fetch('http://localhost:9999/.netlify/functions/ping?rescueId='+rescueId).then(r => r.json());
        if (res.finished) {
          console.log('success');
          setLoading(false);
          navigate('/success');
          clearInterval(intervalId);
        }
      }, 1000);
    } catch(error) {
        console.error(`Error recovering funds:`, error);
    }
  }

  const formInvalid = exposedEOA === '' || frozenContract === '' || contractType === null;

  return (
    <div className="background">
      <Container>
        <Row>
          <h1 className="text-center text-white mt-5">Start the Rescue </h1>
        </Row>
        <Row>
          <Col></Col>
          <Col className="well-wrap mt-5">
            <div className="well text-white">
              <Form validated={!formInvalid} onSubmit={onSubmit}>
                <Row>
                  <Row>
                    <Form.Group
                      onChange={(e) => setExposedEOA(e.target.value)}
                      className="py-3 px-3"
                      controlId="formPrivateKey"
                    >
                      <Form.Label>Exposed Private Key</Form.Label>
                      <Form.Control type="text" placeholder="012345678" />
                      <Form.Text className="text-muted">
                        Already exposed private key we need it to fetch the assets before flashbots do it.
                      </Form.Text>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      onChange={(e) => setFrozenContract(e.target.value)}
                      className="py-3 px-3"
                      controlId="formFrozenAssets"
                    >
                      <Form.Label>Frozen Address</Form.Label>
                      <Form.Control type="text" placeholder="0xabcdef0123" />
                      <Form.Text className="text-muted">Frozen address we need it to...</Form.Text>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group
                      onChange={(e) => setContractType(e.target.value)}
                      className="py-3 px-3"
                      controlId="formFrozenAssets"
                    >
                      <Form.Label>Contract Type</Form.Label>
                      <Form.Select>
                        <option value="20">ERC20</option>
                        <option value="721">ERC721</option>
                      </Form.Select>
                      <Form.Text className="text-muted">Frozen address we need it to...</Form.Text>
                    </Form.Group>
                  </Row>

                  <Row className="text-center">
                    <Col>
                      <Button disabled={loading} variant="outline-primary" className="py-1 my-1" type="submit">
                        { loading ? "rescuing" : "Initiate Rescue" }
                      </Button>
                      {loading &&
                        <div className="d-inline text-blue">
                          <div className="spinner-border ms-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      }
                    </Col>
                  </Row>
                </Row>
              </Form>
            </div>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
};

export default Rescue;
