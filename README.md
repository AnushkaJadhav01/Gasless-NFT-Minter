# Gasless NFT Badge Minter

A modern, beginner-friendly Web3 dApp demonstrating how to mint an NFT on the Base Sepolia testnet *without* needing any ETH for gas. Instead, gas is abstracted away using the **Universal Gas Framework (UGF)**, and users pay (or simulate paying) using Mock USD.

## Features

- **Zero-ETH Minting:** Users can connect a wallet with 0 ETH and still successfully mint an NFT.
- **UGF Integration:** Simulates fetching gas quotes and executing cross-chain/abstracted transactions via UGF relayer using Mock USD.
- **Base Sepolia Network:** Fully prepared for integration with the Base Sepolia testnet.
- **Beautiful UI:** Built with React, Vite, and TailwindCSS featuring glassmorphism and modern aesthetics.
- **Smart Contract Included:** Contains an ERC721 Solidity contract ready to be deployed to Base Sepolia.

## Folder Structure

```
gasless-nft-minter/
├── contracts/          # Solidity Smart Contracts (ERC721 Badge)
├── scripts/            # Deployment Scripts for Smart Contracts
├── frontend/           # React + Vite Frontend App
│   ├── src/
│   │   ├── components/ # Reusable React UI Components
│   │   ├── utils/      # UGF API Integration / Mock
│   │   ├── App.jsx     # Main Layout & Application Logic
│   │   └── index.css   # Tailwind Global Styles
│   ├── .env.example    # Environment Variables configuration
│   └── package.json    # Frontend dependencies
├── hardhat.config.js   # Hardhat deployment configuration
├── package.json        # Root dependencies for smart contracts
└── README.md
```

## Getting Started

### 1. Smart Contract Deployment (Optional)

If you want to deploy your own version of the NFT contract:

1. Install root dependencies:
   ```bash
   npm install
   ```
2. Setup environment variables:
   Copy `.env.example` to `.env` in the root and fill in `PRIVATE_KEY` and `BASESCAN_API_KEY`.
3. Compile and Deploy:
   ```bash
   npm run compile
   npm run deploy:base-sepolia
   ```
4. Copy the deployed contract address.

### 2. Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   Copy `frontend/.env.example` to `frontend/.env` and update `VITE_CONTRACT_ADDRESS` if you deployed your own contract.
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:5173`.

## How the UGF Integration Works

The core UGF logic is implemented in `frontend/src/utils/ugf.js` and orchestrated in `frontend/src/App.jsx`.

1. **Quote Request:** The frontend requests a gas quote from the UGF relayer, which returns the expected cost in Mock USD.
2. **Payment & Execution:** The transaction is signed and sent to the UGF network. UGF covers the native ETH gas cost on Base Sepolia, while deducting the Mock USD balance from the user.
3. **No ERC-4337:** This framework does not rely on smart contract wallets or standard bundlers/paymasters. Instead, it utilizes a relayer execution layer.
