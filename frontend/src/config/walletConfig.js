import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { ethers } from 'ethers';

/**
 * Base Sepolia Configuration
 * Chain ID: 84532
 * RPC: https://sepolia.base.org
 * Explorer: https://sepolia.basescan.org
 */
const BASE_SEPOLIA = {
  chainId: 84532,
  name: 'Base Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.basescan.org',
  rpcUrl: 'https://sepolia.base.org',
};

/**
 * Application metadata for wallet providers
 */
const metadata = {
  name: 'Gasless NFT Minter',
  description: 'Mint NFTs without ETH gas fees using Universal Gas Framework on Base Sepolia',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://localhost:5173',
  icons: [
    'https://avatars.githubusercontent.com/u/37784886',
    'https://raw.githubusercontent.com/WalletConnect/walletconnect-monorepo/master/packages/web3modal/public/favicon.ico'
  ],
};

/**
 * Get WalletConnect Project ID
 * Get one at https://cloud.walletconnect.com for production
 * Using env variable with fallback to demo ID (rate-limited)
 */
const getProjectId = () => {
  const envId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
  if (!envId) {
    console.warn(
      '⚠️ VITE_WALLETCONNECT_PROJECT_ID not set. Using demo ID (rate-limited). Get one at https://cloud.walletconnect.com'
    );
    return 'a8c85ce5a3a14b3b2ebb6e4b8a5c8c3d'; // Demo ID for testing only
  }
  return envId;
};

const projectId = getProjectId();

/**
 * Initialize Web3Modal with ethers config
 * Supports: MetaMask, Coinbase Wallet, WalletConnect, Rainbow, Trust Wallet
 */
createWeb3Modal({
  ethersConfig: defaultConfig({
    metadata,
    // Enable RPC error handling
    rpcUrl: BASE_SEPOLIA.rpcUrl,
    enableEIP6963: true, // Support injected wallets (MetaMask, Rainbow, etc.)
    enableCoinbase: true, // Enable Coinbase Wallet
  }),
  chains: [BASE_SEPOLIA],
  projectId,
  enableAnalytics: false,
  enableOnramp: false, // Disable on-ramp to reduce conflicts
});

/**
 * Initialize default public provider for read-only calls
 */
export const publicProvider = new ethers.JsonRpcProvider(BASE_SEPOLIA.rpcUrl);

/**
 * Get proper signer from wallet provider (ethers v6 compatible)
 * @param {Object} walletProvider - Provider from Web3Modal
 * @param {string} address - Wallet address
 * @returns {Promise<Signer>} Ethers v6 signer
 */
export const getSigner = async (walletProvider, address) => {
  if (!walletProvider || !address) {
    throw new Error('Wallet provider and address required to get signer');
  }

  try {
    // Create BrowserProvider from wallet provider (ethers v6)
    const provider = new ethers.BrowserProvider(walletProvider);

    // Directly instantiate JsonRpcSigner to completely bypass the forbidden eth_requestAccounts RPC call.
    // Web3Modal's social login iframe provider blocks eth_requestAccounts with a ZodError, but supports transactional methods.
    const signer = new ethers.JsonRpcSigner(provider, address);

    return signer;
  } catch (error) {
    console.error('Error getting signer:', error);
    throw new Error(`Failed to get signer: ${error.message}`);
  }
};

/**
 * Get balance for address
 * @param {string} address - Wallet address
 * @returns {Promise<string>} ETH balance formatted to 4 decimals
 */
export const getBalance = async (address) => {
  try {
    const balance = await publicProvider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error fetching balance:', error);
    return '0.0000';
  }
};

/**
 * Ensure wallet is on Base Sepolia
 * @param {Object} walletProvider - Provider from Web3Modal
 * @returns {Promise<void>}
 */
export const ensureBaseSepolia = async (walletProvider) => {
  if (!walletProvider) {
    throw new Error('Wallet provider required');
  }

  try {
    const provider = new ethers.BrowserProvider(walletProvider);
    const network = await provider.getNetwork();

    if (Number(network.chainId) !== Number(BASE_SEPOLIA.chainId)) {
      // Attempt to switch to Base Sepolia
      try {
        await walletProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ethers.toBeHex(BASE_SEPOLIA.chainId) }],
        });
      } catch (switchError) {
        // If switch fails, try to add the chain
        const isUnrecognized = 
          switchError.code === 4902 || 
          switchError.message?.includes('4902') || 
          switchError.message?.toLowerCase().includes('unrecognized chain');
          
        if (isUnrecognized) {
          await walletProvider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: ethers.toBeHex(BASE_SEPOLIA.chainId),
                chainName: BASE_SEPOLIA.name,
                rpcUrls: [BASE_SEPOLIA.rpcUrl],
                blockExplorerUrls: [BASE_SEPOLIA.explorerUrl],
                nativeCurrency: {
                  name: BASE_SEPOLIA.currency,
                  symbol: BASE_SEPOLIA.currency,
                  decimals: 18,
                },
              },
            ],
          });
        } else {
          throw switchError;
        }
      }
    }
  } catch (error) {
    console.error('Error ensuring Base Sepolia:', error);
    throw new Error(`Failed to switch/add Base Sepolia: ${error.message}`);
  }
};

export { BASE_SEPOLIA, metadata };
