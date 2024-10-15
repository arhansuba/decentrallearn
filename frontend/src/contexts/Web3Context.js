import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState({
    instance: null,
    isConnected: false,
    address: null,
  });

  useEffect(() => {
    const connectWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          const accounts = await web3Instance.eth.getAccounts();
          setWeb3({
            instance: web3Instance,
            isConnected: true,
            address: accounts[0],
          });
        } catch (error) {
          console.error('Failed to connect to Web3:', error);
        }
      } else {
        console.log('Please install MetaMask!');
      }
    };

    connectWeb3();
  }, []);

  return (
    <Web3Context.Provider value={{ web3, setWeb3 }}>
      {children}
    </Web3Context.Provider>
  );
};