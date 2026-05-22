# 💻 Gasless NFT Minter — Frontend Dashboard

This directory houses the premium, highly interactive, and responsive React + Vite + Tailwind CSS dashboard. It integrates wallet connections, provides custom 3D-styled badge configurations in real-time, and interacts with the Universal Gas Framework (UGF) for frictionless minting.

---

## 🎨 Design Systems & UI Features

- **Glassmorphism Panels:** Custom card layouts featuring translucent background backdrops, thin white borders, and vibrant radial gradients that feel premium and modern.
- **Micro-Animations:** Rich interactive hover states, dynamic loading status transitions, and smooth landing page fades built using **Framer Motion**.
- **Interactive Customizer:** A visual playground that lets users preview badge initials, adjust neon glow intensity, toggle theme presets (Cosmic Purples, Deep Neons), and swap out core emblems.
- **Robust Preloader:** Preloader screen displaying loading metrics and beautiful orbital animations to give users a fully integrated, premium application feel.

---

## ⚙️ Core Integrations

### 1. Web3Modal Configuration (`/src/config/walletConfig.js`)
Configured using `@web3modal/ethers/react` to provide a plug-and-play wallet connector interface supporting major web3 wallet providers. Fully configured for **Base Sepolia** testnet.

### 2. Universal Gas Framework Client (`/src/App.jsx`)
Integrates `@tychilabs/ugf-testnet-js` to fetch real-time gas fee quotes in **Mock USD** and dispatch the sponsored cryptographic payloads to the relayer.

### 3. Direct Signer Bypass
Implements custom `JsonRpcSigner` instantiation to bypass standard social logins' `eth_requestAccounts` iframe restrictions, enabling smooth, uninterrupted transaction signups.

---

## 🚀 Running Locally

### Prerequisite Environment Variables
Create a `.env` file under this directory (`frontend/.env`) containing:
```env
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_UGF_API_KEY=your_ugf_api_key
VITE_CONTRACT_ADDRESS=your_deployed_gasless_badge_contract_address
```
*(Note: If you leave `VITE_UGF_API_KEY` and `VITE_CONTRACT_ADDRESS` blank or undefined, the application will automatically start in **Sandbox Simulation Mode**!)*

### Commands Checklist
```bash
# Install dependencies
npm install

# Run the local development server
npm run dev

# Build the production bundle
npm run build
```

---

## 📁 Source Folder Structure
```
frontend/
├── public/             # Static public assets (Favicon, logos, textures)
├── src/
│   ├── components/     # Reusable UI widgets (Preloaders, status modals)
│   ├── config/         # WalletConnect and public RPC configurations
│   ├── pages/          # Full page layouts (Dashboard & landing configurations)
│   ├── App.jsx         # App component managing state & UGF coordinates
│   ├── index.css       # Tailwind CSS declarations and keyframe animations
│   └── main.jsx        # App entry point
├── package.json
└── vite.config.js
```
