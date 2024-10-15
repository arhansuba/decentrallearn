import { useState, useCallback, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import TokenRewardsABI from '../../contracts/TokenRewards.json';

const useBlockchain = () => {
  const { web3 } = useContext(Web3Context);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const rewardUser = useCallback(async (userId, amount) => {
    if (!web3.isConnected) {
      setError('Web3 is not connected');
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const tokenRewardsContract = new web3.instance.eth.Contract(
        TokenRewardsABI.abi,
        process.env.REACT_APP_TOKEN_REWARDS_ADDRESS
      );

      const result = await tokenRewardsContract.methods.rewardUser(userId, amount).send({
        from: web3.address,
        gas: 200000
      });

      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, [web3]);

  const getTokenBalance = useCallback(async (userId) => {
    if (!web3.isConnected) {
      setError('Web3 is not connected');
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const tokenRewardsContract = new web3.instance.eth.Contract(
        TokenRewardsABI.abi,
        process.env.REACT_APP_TOKEN_REWARDS_ADDRESS
      );

      const balance = await tokenRewardsContract.methods.balanceOf(userId).call();

      setLoading(false);
      return balance;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, [web3]);

  return { rewardUser, getTokenBalance, loading, error };
};

export default useBlockchain;
