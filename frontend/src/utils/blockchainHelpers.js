import Web3 from 'web3';
import TokenRewardsABI from '../contracts/TokenRewards.json';

export const connectToWeb3 = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return web3;
    } catch (error) {
      console.error("User denied account access");
      return null;
    }
  } else if (window.web3) {
    return new Web3(window.web3.currentProvider);
  } else {
    console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
    return null;
  }
};

export const getTokenRewardsContract = (web3) => {
  return new web3.eth.Contract(
    TokenRewardsABI.abi,
    process.env.REACT_APP_TOKEN_REWARDS_ADDRESS
  );
};

export const rewardUser = async (web3, userId, amount) => {
  const accounts = await web3.eth.getAccounts();
  const contract = getTokenRewardsContract(web3);
  
  try {
    await contract.methods.rewardUser(userId, amount).send({
      from: accounts[0],
      gas: 200000
    });
    return true;
  } catch (error) {
    console.error("Error rewarding user:", error);
    return false;
  }
};