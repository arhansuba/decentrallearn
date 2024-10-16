# DecentralLearn

DecentralLearn is a decentralized learning platform that leverages AI for personalized education and blockchain for token rewards.

## Features

- AI-generated course content
- Personalized learning paths
- Interactive quizzes
- Blockchain-based token rewards
- Decentralized storage with Spheron
- Community-driven course suggestions

## Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- MongoDB
- Ethereum wallet and some ETH for contract deployment

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/decentrallearn.git
   cd decentrallearn
   ```

2. Install dependencies:
   ```
   npm install
   cd frontend && npm install && cd ..
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your specific configuration.

4. Initialize the database:
   ```
   npm run db:init
   ```

5. Deploy the smart contract:
   ```
   npx hardhat run scripts/deploy_rewards.js --network <your-network>
   ```
   Update the `TOKEN_REWARDS_CONTRACT_ADDRESS` in your `.env` file with the deployed contract address.

6. Start the development server:
   ```
   npm run dev
   ```

## Deployment

To deploy the application:

1. Build the frontend:
   ```
   cd frontend && npm run build && cd ..
   ```

2. Deploy to Spheron:
   ```
   spheron deploy
   ```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
