import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence, animate } from 'framer-motion';
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from '@web3modal/ethers/react';
import LandingPage from './pages/LandingPage';
import TransactionStatus from './components/TransactionStatus';
import { UGFClient, TYI_USD_PAYMENT_COIN, BASE_SEPOLIA_CHAIN_ID } from '@tychilabs/ugf-testnet-js';
import { getBalance, getSigner, ensureBaseSepolia } from './config/walletConfig';
import './config/walletConfig'; // Initialize Web3Modal

function App() {
  // Web3Modal hooks for wallet connection
  const { open } = useWeb3Modal();
  const { address, isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  // Wallet state management
  const [wallet, setWallet] = useState({
    address: null,
    ethBalance: '0.0000',
    mockUsdBalance: '100.00',
    provider: null,
    signer: null,
    isOnCorrectChain: true,
  });

  // Transaction state
  const [txState, setTxState] = useState({
    isOpen: false,
    status: '',
    message: '',
    hash: null,
  });

  const [mintedNft, setMintedNft] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState('0');

  // Customization state
  const [customization, setCustomization] = useState({
    initials: 'UGF',
    theme: 'purple',
    core: 'zap',
    glow: 60,
  });

  const [myBadges, setMyBadges] = useState([]);

  // Load custom minted badges from localStorage when wallet is connected
  useEffect(() => {
    if (wallet.address) {
      const stored = localStorage.getItem(`ugf_badges_${wallet.address.toLowerCase()}`);
      if (stored) {
        try {
          setMyBadges(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse stored badges:', e);
          setMyBadges([]);
        }
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
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayCount(Math.round(latest).toString()),
    });

    return () => {
      clearTimeout(timer);
      controls.stop();
    };
  }, []);

  /**
   * Sync Web3Modal wallet state to local wallet state
   * Handles: address, balance, provider, network validation
   */
  useEffect(() => {
    const syncWallet = async () => {
      if (isConnected && address) {
        try {
          // Update address immediately
          setWallet((prev) => ({
            ...prev,
            address,
          }));

          // Check if on correct chain using safe numeric comparison
          let isCorrectChain = Number(chainId) === Number(BASE_SEPOLIA_CHAIN_ID);
          if (!isCorrectChain && walletProvider) {
            console.warn('Not on Base Sepolia. Attempting to switch...');
            try {
              await ensureBaseSepolia(walletProvider);
              isCorrectChain = true; // Switch succeeded!
            } catch (chainError) {
              console.error('Chain switch failed:', chainError);
            }
          }

          // Fetch balance
          let ethBalance = '0.0000';
          try {
            ethBalance = await getBalance(address);
          } catch (balanceError) {
            console.warn('Balance fetch failed:', balanceError);
          }

          // Initialize provider if available
          let provider = null;
          if (walletProvider) {
            try {
              provider = new ethers.BrowserProvider(walletProvider);
            } catch (providerError) {
              console.error('Failed to initialize BrowserProvider:', providerError);
            }
          }

          setWallet({
            address,
            ethBalance,
            mockUsdBalance: '100.00',
            provider,
            signer: null, // Signer is requested per-transaction
            isOnCorrectChain: isCorrectChain,
          });
        } catch (error) {
          console.error('Error syncing wallet:', error);
          setWallet({
            address,
            ethBalance: '0.0000',
            mockUsdBalance: '100.00',
            provider: null,
            signer: null,
            isOnCorrectChain: true,
          });
        }
      } else {
        setWallet({
          address: null,
          ethBalance: '0',
          mockUsdBalance: '0.00',
          provider: null,
          signer: null,
          isOnCorrectChain: true,
        });
      }
    };

    syncWallet();
  }, [isConnected, address, chainId, walletProvider]);

  /**
   * Handle wallet connection
   */
  const handleConnect = useCallback(() => {
    open();
  }, [open]);

  /**
   * Handle switching network programmatically
   */
  const handleSwitchNetwork = useCallback(() => {
    open({ view: 'Networks' });
  }, [open]);

  /**
   * Save minted badge to localStorage
   */
  const saveMintedBadge = useCallback(
    (txHash) => {
      const newBadge = {
        id: `badge_${Date.now()}`,
        initials: customization.initials,
        theme: customization.theme,
        core: customization.core,
        glow: customization.glow,
        txHash: txHash,
        timestamp: new Date().toLocaleDateString(),
      };
      const updated = [newBadge, ...myBadges];
      setMyBadges(updated);
      if (wallet.address) {
        localStorage.setItem(
          `ugf_badges_${wallet.address.toLowerCase()}`,
          JSON.stringify(updated)
        );
      }
    },
    [customization, myBadges, wallet.address]
  );

  /**
   * Execute UGF gasless mint transaction
   */
  const handleMint = useCallback(async () => {
    setTxState({
      isOpen: true,
      status: 'Initializing',
      message: 'Preparing to mint your badge...',
      hash: null,
    });

    try {
      const apiKey = import.meta.env.VITE_UGF_API_KEY;
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

      // If running without UGF env vars, run mock transaction
      if (!apiKey || !contractAddress) {
        console.warn('Missing UGF env variables. Running mock transaction.');
        await runMockTransaction();
        return;
      }

      // Verify wallet connection
      if (!walletProvider || !wallet.address) {
        throw new Error('Wallet not connected. Please connect your wallet.');
      }

      // Verify correct chain
      if (!wallet.isOnCorrectChain) {
        throw new Error('Please switch to Base Sepolia network.');
      }

      // Ensure on Base Sepolia
      try {
        await ensureBaseSepolia(walletProvider);
      } catch (chainError) {
        throw new Error(`Failed to ensure Base Sepolia: ${chainError.message}`);
      }

      // Get signer from wallet
      setTxState((prev) => ({ ...prev, status: 'Authenticating', message: 'Requesting signer...' }));
      let signer;
      try {
        signer = await getSigner(walletProvider, wallet.address);
      } catch (signerError) {
        throw new Error(`Signer request failed: ${signerError.message}`);
      }

      // Initialize UGF Client
      setTxState((prev) => ({ ...prev, status: 'Quoting', message: 'Fetching gas quote from UGF...' }));
      const ugfClient = new UGFClient({ token: apiKey });

      // Mint function selector (0x1249c58b = mint() with no args)
      const mintTxData = '0x1249c58b';

      // Get quote from UGF
      let quote;
      try {
        quote = await ugfClient.quote.get({
          payment_coin: TYI_USD_PAYMENT_COIN,
          payer_address: wallet.address,
          tx_object: mintTxData,
          dest_chain_id: BASE_SEPOLIA_CHAIN_ID,
        });

        if (!quote) {
          throw new Error('No quote received from UGF');
        }
      } catch (quoteError) {
        throw new Error(`Quote fetch failed: ${quoteError.message}`);
      }

      // Execute UGF sponsored transaction
      setTxState((prev) => ({ ...prev, status: 'Relaying', message: 'Relaying via UGF Relayer...' }));

      let result;
      try {
        result = await ugfClient.chains.evm.sponsorAndExecute(
          quote.digest,
          signer,
          async (txSigner) => {
            return {
              to: contractAddress,
              data: mintTxData,
              value: '0',
            };
          },
          {
            onTick: (statusObj) =>
              setTxState((prev) => ({
                ...prev,
                status: 'Confirming',
                message: `Status: ${statusObj.status || 'Processing'}`,
              })),
          }
        );

        if (!result || !result.userTxHash) {
          throw new Error('No transaction hash returned');
        }
      } catch (executeError) {
        throw new Error(`Transaction execution failed: ${executeError.message}`);
      }

      // Success
      setTxState({
        isOpen: true,
        status: 'Success',
        hash: result.userTxHash,
        message: `Badge minted! Tx: ${result.userTxHash.slice(0, 10)}...`,
      });

      setMintedNft(true);
      setWallet((prev) => ({
        ...prev,
        mockUsdBalance: (parseFloat(prev.mockUsdBalance) - parseFloat(quote.payment_amount || 0)).toFixed(2),
      }));
      saveMintedBadge(result.userTxHash);
    } catch (error) {
      console.error('Mint transaction error:', error);
      setTxState({
        isOpen: true,
        status: 'Error',
        message: error.message || 'Transaction failed. Please try again.',
        hash: null,
      });
    }
  }, [walletProvider, wallet, saveMintedBadge]);

  /**
   * Mock transaction for demo/testing without UGF
   */
  const runMockTransaction = async () => {
    await new Promise((r) => setTimeout(r, 1500));
    setTxState((prev) => ({
      ...prev,
      status: 'Relaying',
      message: 'Transaction sent to UGF Relayer Network...',
    }));

    await new Promise((r) => setTimeout(r, 2000));
    setTxState((prev) => ({
      ...prev,
      status: 'Confirming',
      message: 'Waiting for Base Sepolia confirmation...',
    }));

    await new Promise((r) => setTimeout(r, 2500));

    const mockTxHash =
      '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    setTxState({
      isOpen: true,
      status: 'Success',
      hash: mockTxHash,
      message: `Badge minted (mock)! Tx: ${mockTxHash.slice(0, 10)}...`,
    });

    setMintedNft(true);
    setWallet((prev) => ({
      ...prev,
      mockUsdBalance: (parseFloat(prev.mockUsdBalance) - 0.15).toFixed(2),
    }));
    saveMintedBadge(mockTxHash);
  };

  /**
   * Close transaction modal
   */
  const closeTxModal = useCallback(() => {
    setTxState({ isOpen: false, status: '', message: '', hash: null });
  }, []);

  return (
    <>
      <AnimatePresence>
        {isAppLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[9999] bg-[#030509] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            {/* Animated glow blob */}
            <motion.div
              className="absolute w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[120px]"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Logo section */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="relative flex items-center justify-center">
                <motion.img
                  src="/logo.png"
                  alt="Loading"
                  className="h-28 md:h-32 w-auto object-contain drop-shadow-[0_0_30px_rgba(139,92,246,0.6)] relative z-20"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Outer ring */}
                <motion.div
                  className="absolute w-48 h-48 md:w-56 md:h-56 border-[1px] border-primary/30 rounded-full"
                  initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
                  animate={{ rotate: 360, scale: 1, opacity: 1 }}
                  transition={{
                    rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                    opacity: { duration: 1 },
                    scale: { duration: 1 },
                  }}
                />

                {/* Inner ring */}
                <motion.div
                  className="absolute w-32 h-32 md:w-40 md:h-40 border border-dashed border-primary/20 rounded-full"
                  initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
                  animate={{ rotate: -360, scale: 1, opacity: 1 }}
                  transition={{
                    rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
                    opacity: { duration: 1 },
                    scale: { duration: 1 },
                  }}
                />
              </div>

              {/* Counter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-20 text-center"
              >
                <p className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
                  {displayCount}%
                </p>
                <p className="text-slate-400 text-sm mt-4 tracking-widest">INITIALIZING</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main dashboard */}
      {!isAppLoading && (
        <LandingPage
          wallet={wallet}
          onConnect={handleConnect}
          onMint={handleMint}
          onSwitchNetwork={handleSwitchNetwork}
          customization={customization}
          setCustomization={setCustomization}
          myBadges={myBadges}
          txState={txState}
          mintedNft={mintedNft}
        />
      )}

      {/* Transaction status modal */}
      <TransactionStatus txState={txState} onClose={closeTxModal} />
    </>
  );
}

export default App;
