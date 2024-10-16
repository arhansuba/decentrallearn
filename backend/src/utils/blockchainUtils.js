const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

// Initialize Web3 with the provider URL
function initWeb3() {
  return new Web3(new Web3.providers.HttpProvider(process.env.ETHEREUM_RPC_URL));
}

// Create a new Ethereum account
function createAccount() {
  const web3 = initWeb3();
  return web3.eth.accounts.create();
}

// Get the balance of an Ethereum address
async function getBalance(address) {
  const web3 = initWeb3();
  const balanceWei = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balanceWei, 'ether');
}

// Sign a transaction
function signTransaction(txObject, privateKey) {
  const web3 = initWeb3();
  const tx = new EthereumTx(txObject, { chain: process.env.ETHEREUM_NETWORK });
  const privateKeyBuffer = Buffer.from(privateKey.substring(2), 'hex');
  tx.sign(privateKeyBuffer);
  return '0x' + tx.serialize().toString('hex');
}

// Send a signed transaction
async function sendSignedTransaction(signedTx) {
  const web3 = initWeb3();
  return web3.eth.sendSignedTransaction(signedTx);
}

// Estimate gas for a transaction
async function estimateGas(txObject) {
  const web3 = initWeb3();
  return web3.eth.estimateGas(txObject);
}

// Convert Wei to Ether
function weiToEther(wei) {
  const web3 = initWeb3();
  return web3.utils.fromWei(wei, 'ether');
}

// Convert Ether to Wei
function etherToWei(ether) {
  const web3 = initWeb3();
  return web3.utils.toWei(ether, 'ether');
}

// Validate an Ethereum address
function isValidAddress(address) {
  const web3 = initWeb3();
  return web3.utils.isAddress(address);
}

// Get the latest block number
async function getLatestBlockNumber() {
  const web3 = initWeb3();
  return web3.eth.getBlockNumber();
}

module.exports = {
  initWeb3,
  createAccount,
  getBalance,
  signTransaction,
  sendSignedTransaction,
  estimateGas,
  weiToEther,
  etherToWei,
  isValidAddress,
  getLatestBlockNumber
};