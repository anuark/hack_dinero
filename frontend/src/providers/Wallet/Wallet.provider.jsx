import { createContext, useContext, useMemo, useState } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext(null);

function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a <WalletProvider />');
  }
  return context;
}

const WalletProvider = ({ children }) => {
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [recoveredFunds, setRecoveredFunds] = useState(null);

  async function connectWallet() {
    const { ethereum } = window;

    if (!ethereum) {
      console.warn(`Attempting to connect without an "window.ethereum" instance!`);
      return;
    }

    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(ethereum);

      setProvider(provider);
      setSigner(provider.getSigner());
    } catch (error) {
      // TODO: handle connection errors
      console.error(error);
    }
  }

  const contextValue = useMemo(
    () => ({ connectWallet, signer, provider, recoveredFunds, setRecoveredFunds }),
    [provider, recoveredFunds, signer]
  );

  return <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>;
};

export { useWallet };
export default WalletProvider;
