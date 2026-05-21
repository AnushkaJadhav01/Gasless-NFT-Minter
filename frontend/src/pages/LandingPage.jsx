import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Coins, 
  Rocket, 
  CheckCircle2, 
  ChevronRight, 
  Terminal, 
  ExternalLink,
  Cpu, 
  Sparkles, 
  Sliders, 
  Palette,
  Atom,
  Clock,
  Sparkle,
  Menu,
  X,
  Check
} from 'lucide-react';
import WalletConnect from '../components/WalletConnect';
import DocsModal from '../components/DocsModal';
import FloatingCrystal from '../components/FloatingCrystal';

// Customization Mappings
const themes = {
  purple: {
    name: 'Cyber Purple',
    gradient: 'from-purple-600 to-indigo-700',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'rgba(139, 92, 246, 0.55)',
    accent: '#8b5cf6'
  },
  emerald: {
    name: 'Neon Emerald',
    gradient: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    glow: 'rgba(16, 185, 129, 0.55)',
    accent: '#10b981'
  },
  orange: {
    name: 'Solar Orange',
    gradient: 'from-orange-500 to-rose-600',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    glow: 'rgba(249, 115, 22, 0.55)',
    accent: '#f97316'
  },
  blue: {
    name: 'Ice Blue',
    gradient: 'from-sky-500 to-blue-600',
    border: 'border-sky-500/30',
    text: 'text-sky-400',
    glow: 'rgba(14, 165, 233, 0.55)',
    accent: '#0ea5e9'
  }
};

const cores = {
  zap: { name: 'Energy Core', icon: Zap },
  shield: { name: 'Sentinel Shield', icon: Shield },
  sparkles: { name: 'Rarity Sparkle', icon: Sparkles },
  cpu: { name: 'Compute Core', icon: Cpu }
};

// Original showcase data as blueprints
const nftPreviews = [
  { id: 1, name: "Genesis Pioneer", element: "Neon Plasma", color: "from-purple-600 to-indigo-700", core: 'zap', initials: 'GEN' },
  { id: 2, name: "UGF Voyager", element: "Cyber Core", color: "from-emerald-400 to-teal-600", core: 'cpu', initials: 'UGF' },
  { id: 3, name: "Base Sentinel", element: "Quantum Crystal", color: "from-orange-500 to-rose-600", core: 'shield', initials: 'BSE' }
];

const techStack = [
  { name: "React", icon: <Terminal className="w-6 h-6" /> },
  { name: "Base Sepolia", icon: <Shield className="w-6 h-6" /> },
  { name: "Universal Gas Framework", icon: <Zap className="w-6 h-6" /> },
  { name: "Solidity", icon: <Terminal className="w-6 h-6" /> },
  { name: "Ethers.js", icon: <Rocket className="w-6 h-6" /> }
];

const features = [
  {
    icon: <Coins className="w-8 h-8 text-primary" />,
    title: "No ETH Required",
    description: "Mint directly on Base Sepolia without ever needing to bridge or hold native ETH."
  },
  {
    icon: <Zap className="w-8 h-8 text-secondary" />,
    title: "Powered by UGF",
    description: "The Universal Gas Framework abstracts away complex gas mechanics securely in the background."
  },
  {
    icon: <Rocket className="w-8 h-8 text-accent" />,
    title: "Instant NFT Minting",
    description: "Pay with Mock USD seamlessly and watch your NFT arrive in your wallet instantly."
  }
];

const steps = [
  { title: "Connect Wallet", desc: "Link your MetaMask (even with 0 ETH)" },
  { title: "Customize Badge", desc: "Personalize your initials, icon core, and theme colors" },
  { title: "UGF Handles Gas", desc: "Relayers execute and fully sponsor your transaction" },
  { title: "Badge Minted!", desc: "Instantly unlock your personal collector locker" }
];

const LandingPage = ({ 
  wallet, 
  onConnect, 
  onMint, 
  txState, 
  mintedNft, 
  customization, 
  setCustomization, 
  myBadges,
  onSwitchNetwork
}) => {
  const [isDocsOpen, setIsDocsOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const isMinting = txState?.isOpen && txState?.status !== 'Success' && txState?.status !== 'Error';

  const activeTheme = themes[customization?.theme || 'purple'];
  const ActiveCoreIcon = cores[customization?.core || 'zap'].icon;

  const handleInitialsChange = (e) => {
    const val = e.target.value.toUpperCase().slice(0, 3);
    setCustomization(prev => ({ ...prev, initials: val }));
  };

  const handleThemeChange = (themeKey) => {
    setCustomization(prev => ({ ...prev, theme: themeKey }));
  };

  const handleCoreChange = (coreKey) => {
    setCustomization(prev => ({ ...prev, core: coreKey }));
  };

  const handleGlowChange = (e) => {
    setCustomization(prev => ({ ...prev, glow: parseInt(e.target.value) }));
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 font-sans selection:bg-primary/30 relative overflow-x-hidden">
      
      {/* Sophisticated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#030509]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-background/60 backdrop-blur-xl border-b border-white/5 sticky top-0 shadow-lg">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Gasless NFT Minter Logo" className="h-14 md:h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-transform hover:scale-105" />
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            {!wallet.address ? (
              <>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                <a href="#demo" className="hover:text-white transition-colors">Mint</a>
              </>
            ) : (
              <>
                <Link to="/" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors">Home</Link>
                <a href="#demo" className="hover:text-white transition-colors">Dashboard Workspace</a>
                <a href="#collection" className="hover:text-white transition-colors">My Locker</a>
              </>
            )}
            <button onClick={() => setIsDocsOpen(true)} className="hover:text-white transition-colors cursor-pointer">Docs</button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <WalletConnect wallet={wallet} onConnect={onConnect} onSwitchNetwork={onSwitchNetwork} />
          
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={18} className="text-primary animate-pulse" /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden fixed inset-x-0 top-[76px] bg-[#06080f]/95 backdrop-blur-2xl border-b border-white/[0.06] z-40 p-5 flex flex-col gap-4 shadow-2xl"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          
          {!wallet.address ? (
            <>
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white transition-colors text-sm py-2 font-semibold tracking-wide font-mono uppercase"
              >
                Home
              </Link>
              <a 
                href="#how-it-works" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white transition-colors text-sm py-2 font-semibold tracking-wide font-mono uppercase"
              >
                How It Works
              </a>
              <a 
                href="#demo" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white transition-colors text-sm py-2 font-semibold tracking-wide font-mono uppercase"
              >
                Mint
              </a>
            </>
          ) : (
            <>
              <Link 
                to="/" 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.scrollTo({top: 0, behavior: 'smooth'});
                }}
                className="text-slate-300 hover:text-white transition-colors text-sm py-2 font-semibold tracking-wide font-mono uppercase"
              >
                Home
              </Link>
              <a 
                href="#demo" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white transition-colors text-sm py-2 font-semibold tracking-wide font-mono uppercase"
              >
                Dashboard Workspace
              </a>
              <a 
                href="#collection" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white transition-colors text-sm py-2 font-semibold tracking-wide font-mono uppercase"
              >
                My Locker
              </a>
            </>
          )}
          
          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsDocsOpen(true);
            }} 
            className="text-left text-slate-300 hover:text-white transition-colors text-sm py-2 font-semibold tracking-wide font-mono uppercase cursor-pointer"
          >
            Docs
          </button>
        </motion.div>
      )}

      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

      <main className="relative z-10">
        
        {!wallet.address && (
          <>
            {/* 1. Hero Section */}
            <section className="min-h-[85vh] flex flex-col items-center justify-center px-4 text-center relative">
              <FloatingCrystal />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-4xl mx-auto space-y-8 relative z-10"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-sm text-slate-300 font-medium mb-4 border border-white/10">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-50"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  Live on Base Sepolia
                </div>
                
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white drop-shadow-2xl">
                  Mint Customizable NFTs <br className="hidden md:block"/>
                  <span className="gradient-text animate-gradient-x">
                    With Zero ETH Gas
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Design your own personalized pioneer badge in real-time and mint it on Base Sepolia using Mock USD. The Universal Gas Framework handles all network gas fees instantly.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                  <button 
                    onClick={onConnect}
                    className="px-8 py-3.5 rounded-full bg-white text-black font-semibold text-base transition-all flex items-center gap-2 hover:bg-gray-200 hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-white/10"
                  >
                    Connect Wallet <ChevronRight className="w-4 h-4" />
                  </button>
                  <a 
                    href="#how-it-works"
                    className="px-8 py-3.5 rounded-full bg-transparent border border-white/20 text-white font-semibold text-base transition-all flex items-center gap-2 hover:bg-white/5 hover:-translate-y-0.5"
                  >
                    How It Works
                  </a>
                </div>
              </motion.div>
            </section>

            {/* 2. Feature Section */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="glass-panel glass-panel-hover p-10 rounded-3xl group relative overflow-hidden transition-all duration-300"
                  >
                    <div className="absolute -inset-px bg-gradient-to-br from-primary/30 to-secondary/30 opacity-0 group-hover:opacity-20 transition-opacity rounded-3xl"></div>
                    <div className="mb-6 p-4 rounded-2xl bg-slate-800/50 inline-block shadow-inner shadow-black/50 border border-white/5 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 3. How It Works Section */}
            <section id="how-it-works" className="py-24 px-6 relative">
              <div className="max-w-6xl mx-auto">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                  <p className="text-slate-400 max-w-xl mx-auto">A seamless 4-step process powered by Account Abstraction and cross-chain relayers.</p>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                  {/* Connecting line for desktop */}
                  <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
                  
                  {steps.map((step, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.15 }}
                      className="relative z-10 flex flex-col items-center text-center p-8 glass-panel glass-panel-hover rounded-3xl"
                    >
                      <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center font-mono text-xl mb-5 text-slate-300">
                        {idx + 1}
                      </div>
                      <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                      <p className="text-sm text-slate-400">{step.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* 4. Demo Section / Interactive Customized Dashboard */}
        <section id="demo" className="py-20 px-6 relative border-y border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 blur-[100px]"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-extrabold tracking-tight mb-4">
                {wallet.address ? "🎨 Customizer & Minter Workspace" : "Live Demo Sandbox"}
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                {wallet.address 
                  ? "Design and configure your custom badge. Watch the live relayer calculate quotes and mint gasless on-chain!" 
                  : "Connect your wallet above to unlock our live customization suite and mint your custom pioneer NFT badge."}
              </p>
            </motion.div>

            {!wallet.address ? (
              // Empty Wallet prompt card
              <div className="max-w-md mx-auto relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-primary to-secondary rounded-3xl opacity-20 blur-lg"></div>
                <div className="relative glass-panel p-12 rounded-3xl text-center space-y-6">
                  <Atom className="w-16 h-16 text-primary mx-auto animate-spin" style={{ animationDuration: '6s' }} />
                  <h3 className="text-xl font-bold">Workspace Locked</h3>
                  <p className="text-slate-400 text-sm">
                    Please connect your Web3 wallet (MetaMask, Coinbase Wallet, etc.) to access the configuration dashboard. No gas tokens are required.
                  </p>
                  <button 
                    onClick={onConnect}
                    className="w-full py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    Connect Wallet Now
                  </button>
                </div>
              </div>
            ) : (
              // FULLY FUNCTIONAL 3-COLUMN INTERACTIVE CUSTOMIZER SUITE
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Column 1: Configurator Panel */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="lg:col-span-4 glass-panel p-6 md:p-8 rounded-[2rem] border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-slate-400 font-bold mb-6 flex items-center gap-2">
                      <Sliders size={14} className="text-primary animate-pulse" /> 1. CONFIGURE DETAILS
                    </h3>
 
                    {/* Badge Initials Input */}
                    <div className="space-y-3 mb-6">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                        <span>Badge Initials</span>
                        <span className="text-[10px] text-slate-500 font-mono">Max 3 Chars</span>
                      </label>
                      
                      <div className="relative flex items-center bg-black/60 rounded-2xl border border-white/[0.06] hover:border-white/[0.12] p-1.5 focus-within:border-primary/50 transition-all duration-300">
                        <span className="font-mono text-[10px] text-slate-400 font-bold px-3 py-2 bg-white/[0.03] border border-white/[0.04] rounded-xl uppercase tracking-widest select-none">
                          TAG-INIT
                        </span>
                        <input 
                          type="text" 
                          value={customization.initials}
                          onChange={handleInitialsChange}
                          placeholder="UGF"
                          className="flex-1 bg-transparent text-white font-mono font-black text-sm px-4 outline-none uppercase"
                        />
                      </div>
                    </div>
 
                    {/* Color Theme Selector */}
                    <div className="space-y-3 mb-6">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <Palette size={14} /> Color Theme
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {Object.keys(themes).map((themeKey) => {
                          const theme = themes[themeKey];
                          const isSel = customization.theme === themeKey;
                          return (
                            <button
                              key={themeKey}
                              onClick={() => handleThemeChange(themeKey)}
                              className={`p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex items-center gap-2.5 bg-black/40 hover:bg-white/[0.01] relative overflow-hidden ${
                                isSel 
                                  ? 'border-white/20 bg-white/[0.02]' 
                                  : 'border-white/[0.04] hover:border-white/10'
                              }`}
                            >
                              <span className={`w-6 h-6 rounded-lg bg-gradient-to-br ${theme.gradient} shadow-md flex-shrink-0`}></span>
                              <div className="min-w-0">
                                <span className={`text-xs font-bold block truncate ${isSel ? 'text-white' : 'text-slate-400'}`}>
                                  {theme.name.split(' ')[1]}
                                </span>
                                <span className="text-[8px] font-mono text-slate-500 font-bold uppercase tracking-widest block mt-0.5">
                                  {themeKey === 'purple' ? 'V-01' : themeKey === 'green' ? 'E-02' : themeKey === 'orange' ? 'S-03' : 'D-04'}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
 
                    {/* Core Element Selector */}
                    <div className="space-y-3 mb-6">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Core Element Matrix
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {Object.keys(cores).map((coreKey) => {
                          const CoreIcon = cores[coreKey].icon;
                          const isSel = customization.core === coreKey;
                          return (
                            <button
                              key={coreKey}
                              onClick={() => handleCoreChange(coreKey)}
                              className={`p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex items-center gap-2.5 bg-black/40 hover:bg-white/[0.01] relative overflow-hidden ${
                                isSel 
                                  ? 'border-white/20 bg-white/[0.02]' 
                                  : 'border-white/[0.04] hover:border-white/10'
                              }`}
                            >
                              <CoreIcon size={16} className={`flex-shrink-0 ${isSel ? activeTheme.text : 'text-slate-500'}`} />
                              <div className="min-w-0">
                                <span className={`text-xs font-bold block truncate ${isSel ? 'text-white' : 'text-slate-400'}`}>
                                  {cores[coreKey].name.split(' ')[0]}
                                </span>
                                <span className="text-[8px] font-mono text-slate-500 font-bold uppercase tracking-widest block mt-0.5">
                                  {coreKey === 'zap' ? 'SYS-ACT' : coreKey === 'shield' ? 'SEC-PROT' : coreKey === 'coins' ? 'VAL-STR' : 'PROP-ENG'}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
 
                    {/* Glow Level */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <span>Glow Calibration</span>
                        <span className="font-mono text-primary font-bold">{customization.glow}%</span>
                      </div>
                      <div className="relative flex items-center">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={customization.glow}
                          onChange={handleGlowChange}
                          className="w-full accent-primary bg-white/10 h-1.5 rounded-lg outline-none cursor-pointer"
                        />
                      </div>
                      {/* Parameter notch lines */}
                      <div className="flex justify-between text-[6px] text-slate-600 font-mono tracking-widest select-none px-1">
                        <span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span><span>|</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtle UGF system status */}
                  <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                    <span>SYSTEM CORE: UGF RELAY-V2</span>
                    <span className="text-accent flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span> ONLINE
                    </span>
                  </div>
                </motion.div>

                {/* Column 2: Hologram Display Screen */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="lg:col-span-4 flex flex-col justify-between bg-slate-950/40 p-6 md:p-8 rounded-[2rem] border border-white/5 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[80px]"></div>
                  
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-slate-400 font-bold mb-6 flex items-center gap-2">
                      <Atom size={14} className="animate-spin text-secondary" style={{ animationDuration: '10s' }} /> 2. HOLOGRAM STAGE
                    </h3>
                  </div>
 
                  {/* 3D Holographic Card Stage */}
                  <div className="my-6 py-6 flex items-center justify-center relative bg-black/35 rounded-3xl border border-white/[0.04] overflow-hidden p-6 shadow-inner">
                    {/* Corner Crop Indicators */}
                    <div className="absolute top-3 left-3 text-[9px] font-mono text-slate-600 select-none">┌ UGF-PREVIEW</div>
                    <div className="absolute top-3 right-3 text-[9px] font-mono text-slate-600 select-none">┐ 0x{wallet.address.slice(2, 6).toUpperCase()}</div>
                    <div className="absolute bottom-3 left-3 text-[9px] font-mono text-slate-600 select-none">└ LAT-SEC</div>
                    <div className="absolute bottom-3 right-3 text-[9px] font-mono text-slate-600 select-none">┘ CH: {customization.glow}%</div>
                    
                    <motion.div 
                      className="relative w-52 h-64 rounded-3xl overflow-hidden glass-panel border border-white/15 flex flex-col items-center justify-center p-6 shadow-2xl transition-shadow duration-500 animate-float"
                      style={{
                        boxShadow: `0 0 35px -5px ${activeTheme.glow}`
                      }}
                    >
                      {/* Intricate circuitry overlay lines */}
                      <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay">
                        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 20 H90 V80 H10 Z M30 20 V80 M70 20 V80 M10 50 H90" stroke="white" strokeWidth="0.5" />
                          <circle cx="30" cy="50" r="1.5" fill="white" />
                          <circle cx="70" cy="50" r="1.5" fill="white" />
                        </svg>
                      </div>

                      {/* Gradient Backdrop */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${activeTheme.gradient} opacity-20 pointer-events-none`}></div>
                      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.06] mix-blend-overlay pointer-events-none"></div>
 
                      {/* Glowing Ring Core */}
                      <div className="relative w-28 h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
                        <ActiveCoreIcon 
                          size={46} 
                          className={`${activeTheme.text} drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] animate-pulse`} 
                          strokeWidth={1.5}
                        />
                        
                        {/* Interactive scanline effect */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/30 animate-scanline pointer-events-none"></div>
                      </div>
 
                      {/* Initials Print */}
                      <div className="text-center">
                        <h4 className="text-3xl font-black tracking-widest text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] font-mono">
                          {customization.initials || "PNE"}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 tracking-[0.3em] uppercase block mt-1">
                          {cores[customization.core].name}
                        </span>
                      </div>
                    </motion.div>
                  </div>
 
                  {/* Dynamic Simulation Live Quote log */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-slate-400">
                      <span className="flex items-center gap-1.5"><Zap size={10} className="text-primary"/> RELAYER FEE:</span>
                      <span className="text-white font-semibold">0.15 MOCK USD</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>GAS ESTIMATE:</span>
                      <span className="text-rose-400/90 font-semibold line-through">0.00045 ETH</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>UGF SPONSORSHIP:</span>
                      <span className="text-accent font-bold px-2 py-0.5 rounded bg-accent/10 border border-accent/10">100% COVERED</span>
                    </div>
                    <div className="pt-2 border-t border-white/[0.06] flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-bold">NET PROTOCOL COST:</span>
                      <span className="text-accent font-extrabold font-mono text-sm">0.00 ETH</span>
                    </div>
                  </div>
                </motion.div>

                {/* Column 3: Transaction Hub & Balance Status */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="lg:col-span-4 glass-panel p-6 md:p-8 rounded-[2rem] border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-slate-400 font-bold mb-6 flex items-center gap-2">
                      <Shield size={14} className="text-accent animate-pulse" /> 3. TRANSACTION HUB
                    </h3>
 
                    {/* Wallet address and stats */}
                    <div className="space-y-4">
                      
                      {/* ETH status */}
                      <div className="p-4 rounded-2xl bg-black/45 border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors shadow-inner">
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Vault Balance</span>
                          <span className="text-[9px] text-accent font-mono uppercase bg-accent/10 border border-accent/10 px-2 py-0.5 rounded-md mt-1.5 w-max">
                            0 ETH Mint Active
                          </span>
                        </div>
                        <div className="font-mono font-bold text-white text-base tracking-tight">
                          {Number(wallet.ethBalance).toFixed(5)} ETH
                        </div>
                      </div>
 
                      {/* Mock USD balance status */}
                      <div className="p-4 rounded-2xl bg-black/45 border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors shadow-inner">
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Testnet Balance</span>
                          <span className="text-[9px] text-slate-500 font-mono mt-1.5">Provided free for UGF</span>
                        </div>
                        <div className="font-mono font-bold text-accent text-lg flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                          <Zap size={14} className="animate-pulse" /> ${wallet.mockUsdBalance}
                        </div>
                      </div>
 
                      {/* Connection details */}
                      <div className="pt-2">
                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest font-bold mb-2.5">Connected Account</div>
                        <div className="flex justify-between items-center p-3.5 bg-white/5 rounded-xl border border-white/5">
                          <span className="text-xs text-slate-300 font-medium">Base Sepolia</span>
                          <span className="text-xs font-mono text-slate-400 bg-black/30 px-2.5 py-1.5 rounded-lg border border-white/5 shadow-inner">
                            {wallet.address.slice(0,6)}...{wallet.address.slice(-4)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
 
                  {/* Mint Button execution stage */}
                  <div className="mt-8 space-y-4">
                    
                    <button 
                      onClick={onMint}
                      disabled={isMinting}
                      className={`w-full py-4.5 px-6 rounded-2xl font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative overflow-hidden group border shadow-lg ${
                        isMinting 
                          ? 'bg-white/5 text-white/50 border-white/10 cursor-not-allowed' 
                          : 'bg-white text-black hover:bg-slate-200 border-white active:scale-[0.98]'
                      }`}
                      style={{
                        boxShadow: isMinting ? 'none' : '0 10px 30px -10px rgba(255, 255, 255, 0.25)'
                      }}
                    >
                      {isMinting ? (
                        <div className="flex items-center gap-2.5 py-1">
                          <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                          <span className="text-sm font-black uppercase tracking-wider">Relaying transaction...</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <Zap size={16} className="animate-pulse text-black" />
                            <span className="text-sm font-black uppercase tracking-wider">MINT GASLESS NFT BADGE</span>
                          </div>
                          <span className="text-[9px] font-mono tracking-widest text-slate-500 font-bold uppercase select-none">
                            SPONSORED BY RELAYER • BASE SEPOLIA
                          </span>
                        </>
                      )}
                    </button>
 
                    <div className="flex justify-between text-[11px] font-mono text-slate-500 px-1">
                      <span>GAS DELEGATOR STATUS:</span>
                      <span className="text-accent flex items-center gap-1"><Check size={10} className="text-accent animate-pulse"/> ACTIVE Relayer</span>
                    </div>
                  </div>
                </motion.div>
                
              </div>
            )}
          </div>
        </section>

        {/* 5. NFT Pioneer Collection / Locker Showcase */}
        <section id="collection" className="py-24 px-6 relative">
          <div className="max-w-6xl mx-auto">
            
            {wallet.address ? (
              // 1. Logged in custom collections locker
              <div className="space-y-16">
                <div>
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                  >
                    <h2 className="text-4xl font-extrabold mb-3 flex items-center justify-center gap-3">
                      <Shield className="text-primary animate-pulse" /> My Personal Badge Locker
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto">
                      Here are your customized, gas-free NFT badges successfully minted and locked on Base Sepolia.
                    </p>
                  </motion.div>

                  {myBadges.length === 0 ? (
                    // Locker empty placeholder
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass-panel p-16 rounded-3xl text-center space-y-4 max-w-md mx-auto border border-dashed border-white/10"
                    >
                      <Clock size={48} className="text-slate-500 mx-auto animate-pulse" />
                      <h4 className="text-xl font-bold">Locker is Empty</h4>
                      <p className="text-slate-400 text-sm">
                        You have not minted any customized badges yet! Go ahead and calibrate your own badge design above, then click mint to see it locked here.
                      </p>
                    </motion.div>
                  ) : (
                    // Render personal locker custom badges!
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                      {myBadges.map((badge, idx) => {
                        const themeObj = themes[badge.theme || 'purple'];
                        const CoreIconComp = cores[badge.core || 'zap'].icon;
                        return (
                          <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="glass-panel rounded-3xl overflow-hidden group cursor-pointer shadow-2xl transition-all hover:shadow-primary/20 hover:border-primary/50 relative"
                            style={{
                              boxShadow: `0 10px 30px -10px ${themeObj.glow}`
                            }}
                          >
                            {/* Card visual badge header */}
                            <div className={`h-48 w-full bg-gradient-to-br ${themeObj.gradient} p-6 relative overflow-hidden flex flex-col items-center justify-center`}>
                              <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-30 mix-blend-overlay"></div>
                              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                                <CoreIconComp size={38} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                              </div>
                              <h5 className="text-2xl font-black font-mono text-white tracking-widest">{badge.initials}</h5>
                            </div>
                            
                            {/* Card badge details footer */}
                            <div className="p-6 relative bg-slate-900/90 backdrop-blur-md">
                              <div className="absolute -top-6 right-6 bg-slate-900 border border-slate-700 rounded-full px-3.5 py-1 text-xs font-mono text-slate-300">
                                Minted
                              </div>
                              
                              <h4 className="text-lg font-bold mb-1">{badge.initials} Pioneer</h4>
                              <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                                <Clock size={12} /> Minted: {badge.timestamp}
                              </p>
                              
                              <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-2.5">
                                <div className="flex items-center gap-1 text-[11px] text-accent bg-accent/10 px-2.5 py-1 rounded-lg">
                                  <CheckCircle2 size={12} /> Gasless Mint
                                </div>
                                <a 
                                  href={`https://sepolia.basescan.org/tx/${badge.txHash}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[11px] text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-mono"
                                >
                                  Tx details <ExternalLink size={10} />
                                </a>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {/* Showcase global blueprint templates */}
                <div className="pt-16 border-t border-white/5">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                  >
                    <h3 className="text-2xl font-bold mb-2">Global Template Blueprints</h3>
                    <p className="text-slate-400 max-w-xl mx-auto">Original design blueprints to guide your creations.</p>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 opacity-75">
                    {nftPreviews.map((nft) => {
                      const CoreIconComp = cores[nft.core].icon;
                      return (
                        <div
                          key={nft.id}
                          className="glass-panel rounded-3xl overflow-hidden pointer-events-none border border-white/5 relative"
                        >
                          <div className={`h-40 w-full bg-gradient-to-br ${nft.color} p-6 relative overflow-hidden flex flex-col items-center justify-center`}>
                            <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none"></div>
                            <CoreIconComp size={32} className="text-white/80 mb-2" />
                            <span className="text-xl font-bold font-mono text-white/80">{nft.initials}</span>
                          </div>
                          <div className="p-5 relative bg-slate-900/60">
                            <h4 className="text-md font-bold mb-1 text-slate-300">{nft.name}</h4>
                            <p className="text-xs text-slate-500">{nft.element}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              // 2. Logged out default collection showcase
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl font-bold mb-4">Pioneer Blueprint Collection</h2>
                  <p className="text-slate-400 max-w-xl mx-auto">Exclusive blueprint templates designed for early adopters.</p>
                </motion.div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {nftPreviews.map((nft, idx) => {
                    const CoreIconComp = cores[nft.core].icon;
                    return (
                      <motion.div
                        key={nft.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.15 }}
                        whileHover={{ y: -15, scale: 1.02 }}
                        className="glass-panel rounded-3xl overflow-hidden group cursor-pointer shadow-2xl transition-all hover:shadow-primary/20 hover:border-primary/50"
                      >
                        <div className={`h-48 w-full bg-gradient-to-br ${nft.color} p-6 relative overflow-hidden flex flex-col items-center justify-center`}>
                          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-30 mix-blend-overlay"></div>
                          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                            <CoreIconComp size={32} className="text-white/80" />
                          </div>
                          <span className="text-xl font-bold font-mono text-white/90">{nft.initials}</span>
                        </div>
                        <div className="p-6 relative bg-slate-900/90">
                          <div className="absolute -top-6 right-6 bg-slate-900 border border-slate-700 rounded-full px-3 py-1 text-xs font-mono text-slate-300">
                            #{nft.id}000
                          </div>
                          <h4 className="text-xl font-bold mb-1">{nft.name}</h4>
                          <p className="text-sm text-slate-400 mb-4">{nft.element}</p>
                          <div className="flex items-center gap-2 text-xs text-accent bg-accent/10 px-3 py-1.5 rounded-lg w-fit">
                            <CheckCircle2 size={14} /> Minted Gasless
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 6. Tech Stack Section */}
        {!wallet.address && (
          <section className="py-24 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-20"></div>
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-extrabold mb-12"
              >
                Built With Next-Gen Tech
              </motion.h2>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {techStack.map((tech, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="glass-panel px-8 py-4 rounded-full flex items-center gap-4 shadow-xl hover:shadow-primary/20 hover:border-primary/40 transition-all cursor-pointer"
                  >
                    <span className="text-2xl">{tech.icon}</span>
                    <span className="font-semibold">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* 7. Footer */}
      <footer className="relative z-10 border-t border-slate-800 glass-panel py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Gasless NFT Minter Logo" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="flex gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Base Sepolia</span>
            <span className="flex items-center gap-2"><Zap size={14} className="text-accent" /> Built with UGF</span>
          </div>
          
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Terminal size={24} />
            </a>
          </div>
        </div>
        <div className="text-center text-slate-500 text-sm mt-8">
          © {new Date().getFullYear()} GaslessMinter. Open source demonstration.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
