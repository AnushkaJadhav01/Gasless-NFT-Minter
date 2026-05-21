import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { createWeb3Modal, defaultConfig, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import LandingPage from './pages/LandingPage';
import TransactionStatus from './components/TransactionStatus';
import { UGFClient, TYI_USD_PAYMENT_COIN, BASE_SEPOLIA_CHAIN_ID } from '@tychilabs/ugf-testnet-js';

// 1. Get WalletConnect Project ID
// For a production app, get one at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '8942b01269e9712a83e020281b3ccba5';

// 2. Set networks
const baseSepolia = {
  chainId: 84532,
  name: 'Base Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.basescan.org',
  rpcUrl: 'https://sepolia.base.org'
};

// 3. Create Web3Modal config
const metadata = {
  name: 'Gasless NFT Minter',
  description: 'Mint NFTs without ETH gas fees using Universal Gas Framework',
  url: 'https://gasless-nft-minter.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [baseSepolia],
  projectId,
  enableAnalytics: false
});

function App() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [wallet, setWallet] = useState({
    address: null,
    ethBalance: '0',
    mockUsdBalance: '100.00', // Mock USD balance for UGF Demo
    provider: null,
    signer: null
  });
  
  const [txState, setTxState] = useState({
    isOpen: false,
    status: '',
    message: '',
    hash: null
  });

  const [mintedNft, setMintedNft] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState("0");

  // Dynamic customization states for custom badges
  const [customization, setCustomization] = useState({
    initials: 'UGF',
    theme: 'purple',
    core: 'zap',
    glow: 60
  });

  const [myBadges, setMyBadges] = useState([]);

  // Load custom minted badges from localStorage when wallet is connected
  useEffect(() => {
    if (wallet.address) {
      const stored = localStorage.getItem(`ugf_badges_${wallet.address.toLowerCase()}`);
      if (stored) {
        setMyBadges(JSON.parse(stored));
      } else {
        setMyBadges([]);
      }
    } else {
      setMyBadges([]);
    }
  }, [wallet.address]);

  // Preloader timer & counter animation
  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 2500);
    const controls = animate(0, 100, { 
      duration: 2.3, 
      ease: "easeOut",
      onUpdate: (latest) => setDisplayCount(Math.round(latest).toString())
    });
    
    return () => {
      clearTimeout(timer);
      controls.stop();
    };
  }, []);

  // Sync Web3Modal state to our local wallet state
  useEffect(() => {
    async function syncWallet() {
      if (isConnected && address) {
        // Immediately set the address so the UI switches to the Dashboard view
        setWallet(prev => ({ ...prev, address }));
        
        try {
          if (walletProvider) {
            const provider = new ethers.BrowserProvider(walletProvider);
            let balanceEth = "0.0000";
            try {
              // Get balance via public read-only call. Wrapped in nested try/catch to maintain maximum resilience even if provider throws RPC blockages
              const balance = await provider.getBalance(address);
              balanceEth = ethers.formatEther(balance);
            } catch (balanceErr) {
              console.warn("Could not fetch real ETH balance, using standard fallback:", balanceErr);
            }
            
            setWallet({
              address,
              ethBalance: balanceEth,
              mockUsdBalance: '100.00',
              provider,
              signer: null // Defer Signer authorization completely to the user-clicked handleMint block
            });
          }
        } catch (err) {
          console.error("Failed to fetch balance or provider:", err);
          // Fallback to offline status for UI customizer access
          setWallet({
            address,
            ethBalance: '0.0000',
            mockUsdBalance: '100.00',
            provider: null,
            signer: null
          });
        }
      } else {
        setWallet({ address: null, ethBalance: '0', mockUsdBalance: '0.00', provider: null, signer: null });
      }
    }
    syncWallet();
  }, [isConnected, walletProvider, address]);

  const handleConnect = () => {
    open();
  };

  const saveMintedBadge = (txHash) => {
    const newBadge = {
      id: `badge_${Date.now()}`,
      initials: customization.initials,
      theme: customization.theme,
      core: customization.core,
      glow: customization.glow,
      txHash: txHash,
      timestamp: new Date().toLocaleDateString()
    };
    const updated = [newBadge, ...myBadges];
    setMyBadges(updated);
    if (wallet.address) {
      localStorage.setItem(`ugf_badges_${wallet.address.toLowerCase()}`, JSON.stringify(updated));
    }
  };

  const handleMint = async () => {
    setTxState({ isOpen: true, status: 'Quoting', message: 'Fetching gas quote from UGF...', hash: null });
    
    try {
      const apiKey = import.meta.env.VITE_UGF_API_KEY;
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      
      // FIRST CHECK: If running in Sandbox Mock Mode (no ENV config), bypass provider/signer requests entirely!
      if (!apiKey || !contractAddress) {
        console.warn("Missing .env variables. Running sandbox mock transaction.");
        await runMockTransaction();
        return;
      }

      // SECOND CHECK: For real UGF execution, verify wallet is connected
      if (!walletProvider || !wallet.address) {
        throw new Error("Wallet not fully connected. Please connect wallet.");
      }

      const provider = new ethers.BrowserProvider(walletProvider);
      
      // Initialize real UGF Client
      const ugfClient = new UGFClient({ token: apiKey });
      
      // We assume the contract has a `mint()` function (selector: 0x1249c58b)
      const mintTxData = "0x1249c58b"; 
      
      // 1. Get Quote
      const quote = await ugfClient.quote.get({
        payment_coin: TYI_USD_PAYMENT_COIN,
        payer_address: wallet.address,
        tx_object: mintTxData,
        dest_chain_id: BASE_SEPOLIA_CHAIN_ID
      });
      
      if (quote) {
        setTxState(prev => ({ ...prev, status: 'Relaying', message: 'Paying gas and relaying via UGF...' }));
        
        // 2. Execute Transaction
        const result = await ugfClient.chains.evm.sponsorAndExecute(
          quote.digest,
          provider.getSigner(wallet.address),
          async (signer) => {
            return {
              to: contractAddress,
              data: mintTxData
            };
          },
          {
            onTick: (statusObj) => setTxState(prev => ({ 
              ...prev, 
              status: 'Confirming', 
              message: `Status: ${statusObj.status}` 
            }))
          }
        );
        
        if (result.userTxHash) {
          setTxState(prev => ({ ...prev, status: 'Success', hash: result.userTxHash }));
          setMintedNft(true);
          setWallet(prev => ({ 
            ...prev, 
            mockUsdBalance: (parseFloat(prev.mockUsdBalance) - parseFloat(quote.payment_amount)).toFixed(2)
          }));
          saveMintedBadge(result.userTxHash);
        }
      }
    } catch (err) {
      console.error(err);
      setTxState({ isOpen: true, status: 'Error', message: err.message || 'Transaction failed.', hash: null });
    }
  };

  // Mock transaction logic if ENV is not configured
  const runMockTransaction = async () => {
    await new Promise(r => setTimeout(r, 1500));
    setTxState(prev => ({ ...prev, status: 'Relaying', message: 'Transaction sent to UGF Relayer Network...' }));
    await new Promise(r => setTimeout(r, 2000));
    setTxState(prev => ({ ...prev, status: 'Confirming', message: 'Waiting for Base Sepolia confirmation...' }));
    await new Promise(r => setTimeout(r, 2500));
    const mockTxHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setTxState(prev => ({ ...prev, status: 'Success', hash: mockTxHash }));
    setMintedNft(true);
    setWallet(prev => ({ 
      ...prev, 
      mockUsdBalance: (parseFloat(prev.mockUsdBalance) - 0.15).toFixed(2)
    }));
    saveMintedBadge(mockTxHash);
  };

  const closeTxModal = () => {
    setTxState({ isOpen: false, status: '', message: '', hash: null });
  };

  return (
    <>
      <AnimatePresence>
        {isAppLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[9999] bg-[#030509] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            <motion.div 
              className="absolute w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[120px]"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Logo & Rings */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="relative flex items-center justify-center">
                <motion.img 
                  src="/logo.png" 
                  alt="Loading" 
                  className="h-28 md:h-32 w-auto object-contain drop-shadow-[0_0_30px_rgba(139,92,246,0.6)] relative z-20"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Scanning Outer Ring */}
                <motion.div 
                  className="absolute w-48 h-48 md:w-56 md:h-56 border-[1px] border-primary/30 rounded-full"
                  initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
                  animate={{ rotate: 360, scale: 1, opacity: 1 }}
                  transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, opacity: { duration: 1 }, scale: { duration: 1 } }}
                >
                  <div className="absolute top-0 left-1/2 w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(139,92,246,1)] -translate-x-1/2 -translate-y-1/2"></div>
                </motion.div>
                
                {/* Dashed Inner Ring */}
                <motion.div 
                  className="absolute w-56 h-56 md:w-64 md:h-64 border-[1px] border-secondary/20 rounded-full border-dashed"
                  initial={{ rotate: 360, scale: 0.8, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  transition={{ rotate: { duration: 12, repeat: Infinity, ease: "linear" }, opacity: { duration: 1, delay: 0.2 }, scale: { duration: 1, delay: 0.2 } }}
                />
              </div>

              {/* Progress Bar & Text */}
              <div className="mt-20 w-72 flex flex-col items-center gap-4 relative z-20">
                <div className="flex items-center justify-between w-full text-primary font-mono text-xs font-semibold uppercase tracking-[0.2em]">
                  <motion.div 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Establishing Link
                  </motion.div>
                  <motion.div className="text-secondary text-sm tabular-nums">
                    {displayCount}%
                  </motion.div>
                </div>
                
                <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden relative shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                  <motion.div 
                    className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-primary via-accent to-secondary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.3, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LandingPage 
        wallet={wallet}
        onConnect={handleConnect}
        onMint={handleMint}
        txState={txState}
        mintedNft={mintedNft}
        customization={customization}
        setCustomization={setCustomization}
        myBadges={myBadges}
      />
      {txState.isOpen && (
        <TransactionStatus state={txState} onClose={closeTxModal} />
      )}
    </>
  );
}

export default App;
