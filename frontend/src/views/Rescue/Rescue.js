import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

import { useWallet } from '../../providers/Wallet';
import recoverERC20Funds from '../../scripts/reactERC20FlashBundle';
import recoverERC721Funds from '../../scripts/reactERC721FlashBundle';

const CONTRACTS = {
  ERC20: 'ERC20',
  ERC721: 'ERC721',
};

const Rescue = () => {
  const { signer, setRecoveredFunds } = useWallet();
  const [exposedEOA, setExposedEOA] = useState('');
  const [frozenContract, setFrozenContract] = useState(0);
  const [contractType, setContractType] = useState(null);

  function updateExposedEOA(event) {
    setExposedEOA(event.target.value);
  }

  function updatedFrozenContract(event) {
    setFrozenContract(event.target.value);
  }

  function updateContractType(event) {
    setContractType(event.target.value);
  }

  async function rescueFunds() {
    const recoverFn = contractType === CONTRACTS.ERC20 ? recoverERC20Funds : recoverERC721Funds;
    try {
      const recoveredFunds = await recoverFn(exposedEOA, signer, frozenContract);
      setRecoveredFunds(recoveredFunds);
    } catch (error) {
      // TODO: add error handling
      console.error(`Error recovering funds: ${error}`);
    }
  }

  function onSubmit() {
    console.log('on submit');
  }

  const formInvalid = exposedEOA === '' || frozenContract === '' || contractType === null;

  return (
    <>
      <Container className="text-white">
        <form id="rescue-form" onSubmit={onSubmit}>
          <Row>
            <Col>
              <div className="form-outline">
                <label className="form-label" htmlFor="formControlLg">
                  Exposed Private Key
                </label>
                <input
                  type="text"
                  id="formControlLg"
                  className="form-control form-control-lg"
                  onChange={updateExposedEOA}
                />
                <br />
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="form-outline">
                <label className="form-label" htmlFor="formControlSm">
                  Frozen address
                </label>
                <input
                  type="text"
                  id="formControlSm"
                  className="form-control form-control-sm"
                  onChange={updatedFrozenContract}
                  // TODO: add pattern validation
                />
                <br />
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="form-outline">
                <p>Type of Token:</p>
                <div>
                  <label htmlFor={CONTRACTS.ERC20}>
                    <input
                      type="radio"
                      id={CONTRACTS.ERC20}
                      value={CONTRACTS.ERC20}
                      checked={contractType === CONTRACTS.ERC20}
                      onClick={updateContractType}
                    />
                    {CONTRACTS.ERC20}
                  </label>
                </div>
                <div>
                  <label htmlFor={CONTRACTS.ERC721}>
                    <input
                      type="radio"
                      id={CONTRACTS.ERC721}
                      value={CONTRACTS.ERC721}
                      checked={contractType === CONTRACTS.ERC721}
                      onClick={updateContractType}
                    />
                    {CONTRACTS.ERC721}
                  </label>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col></Col>
            <Col>
              <Button disabled={formInvalid} onClick={rescueFunds}>
                Initiate Rescue
              </Button>
            </Col>
          </Row>
        </form>
      </Container>
    </>
  );
};

export default Rescue;
