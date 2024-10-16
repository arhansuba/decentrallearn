const Web3 = require('web3');
const TokenRewardsABI = require('./TokenRewards.json');

class TokenRewardsService {
  constructor() {
    this.web3 = new Web3(process.env.ETHEREUM_RPC_URL);
    this.contractAddress = process.env.TOKEN_REWARDS_CONTRACT_ADDRESS;
    this.contract = new this.web3.eth.Contract(TokenRewardsABI, this.contractAddress);
  }

  async mintTokens(toAddress, amount) {
    try {
      const accounts = await this.web3.eth.getAccounts();
      const adminAccount = accounts[0]; // Assuming the first account is the admin

      const result = await this.contract.methods.mint(toAddress, amount).send({
        from: adminAccount,
        gas: 200000
      });

      console.log(`Minted ${amount} tokens to ${toAddress}. Transaction: ${result.transactionHash}`);
      return result;
    } catch (error) {
      console.error('Error minting tokens:', error);
      throw error;
    }
  }

  async transferTokens(fromAddress, toAddress, amount) {
    try {
      const result = await this.contract.methods.transfer(toAddress, amount).send({
        from: fromAddress,
        gas: 200000
      });

      console.log(`Transferred ${amount} tokens from ${fromAddress} to ${toAddress}. Transaction: ${result.transactionHash}`);
      return result;
    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw error;
    }
  }

  async getBalance(address) {
    try {
      const balance = await this.contract.methods.balanceOf(address).call();
      return this.web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  }

  async rewardUser(userId, amount) {
    try {
      // In a real-world scenario, you'd fetch the user's Ethereum address from your database
      const userAddress = await this.getUserEthereumAddress(userId);
      return this.mintTokens(userAddress, amount);
    } catch (error) {
      console.error('Error rewarding user:', error);
      throw error;
    }
  }

  async getUserEthereumAddress(userId) {
    // This is a placeholder. In a real implementation, you would fetch this from your database
    console.log(`Fetching Ethereum address for user ${userId}`);
    return '0x1234567890123456789012345678901234567890'; // Placeholder address
  }
}

module.exports = new TokenRewardsService();
