import React, { useState, useEffect, useRef } from 'react';
import { Wallet, LogOut, Copy, Check, ChevronDown, User, Sparkles, Edit3, Save, X, Globe, ArrowRight, Dices } from 'lucide-react';
import { useDisconnect } from '@web3modal/ethers/react';

// Premium gradients for custom avatars with styled tags and details
const avatarGradients = {
  violet: {
    name: 'Sunset Violet',
    tag: 'V-01',
    vibe: 'RETRO-GLOW',
    classes: 'from-violet-600 via-indigo-600 to-fuchsia-500',
    glowColor: 'rgba(139, 92, 246, 0.45)',
    borderFocus: 'focus-within:border-violet-500/60 focus-within:ring-1 focus-within:ring-violet-500/10',
    textClasses: 'text-violet-400',
    bgLight: 'bg-violet-500/5'
  },
  emerald: {
    name: 'Cyber Mint',
    tag: 'E-02',
    vibe: 'MATRIX-RUN',
    classes: 'from-teal-500 via-emerald-500 to-cyan-500',
    glowColor: 'rgba(20, 184, 166, 0.45)',
    borderFocus: 'focus-within:border-emerald-500/60 focus-within:ring-1 focus-within:ring-emerald-500/10',
    textClasses: 'text-emerald-400',
    bgLight: 'bg-emerald-500/5'
  },
  amber: {
    name: 'Neon Solar',
    tag: 'S-03',
    vibe: 'FLAME-CORE',
    classes: 'from-amber-500 via-orange-500 to-rose-500',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    borderFocus: 'focus-within:border-amber-500/60 focus-within:ring-1 focus-within:ring-amber-500/10',
    textClasses: 'text-amber-400',
    bgLight: 'bg-amber-500/5'
  },
  sky: {
    name: 'Ocean Drift',
    tag: 'D-04',
    vibe: 'PLASMA-FLOW',
    classes: 'from-sky-500 via-blue-600 to-indigo-700',
    glowColor: 'rgba(14, 165, 233, 0.45)',
    borderFocus: 'focus-within:border-sky-500/60 focus-within:ring-1 focus-within:ring-sky-500/10',
    textClasses: 'text-sky-400',
    bgLight: 'bg-sky-500/5'
  }
};

// Curated pool of high-end Web3 gamertags/aliases for randomizing
const web3Names = [
  'CyberApe', 'NeoPioneer', 'GigaSentry', 'DeltaVoyager', 
  'HyperSpark', 'AetherBlade', 'BaseSentinel', 'QuantumCoder', 
  'GaslessChad', 'RelayerBoss', 'ZenithAdopter', 'AstroDeFi',
  'OmegaCrypt', 'HelixSentry', 'VoltPioneer', 'SonicRelay'
];

const walletsList = [
  {
    id: 'metamask',
    name: 'MetaMask',
    iconColor: 'bg-orange-500/10 text-orange-400 border border-orange-500/10',
    logo: (
      <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 11.6l-2-7.2-6.4 4.5 1.5 2.1 4.9.6-1.5 2.7 3.5-2.7zm-20 0l2-7.2 6.4 4.5-1.5 2.1-4.9.6 1.5 2.7-3.5-2.7zM12 18.5l-4-5 1.5-2h5l1.5 2-4 5zm0-13.7l3 5.7h-6l3-5.7z"/>
      </svg>
    )
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    iconColor: 'bg-blue-600/10 text-blue-400 border border-blue-500/10',
    logo: (
      <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="2" width="20" height="20" rx="10" />
        <rect x="7" y="7" width="10" height="10" rx="2" fill="white" />
      </svg>
    )
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    iconColor: 'bg-sky-500/10 text-sky-400 border border-sky-500/10',
    logo: (
      <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.7 7.7a7.2 7.2 0 00-10.2 0L8.4 8.8l1.1 1.1 1.1-1.1a5.6 5.6 0 017.9 0l1.2 1.2 1.1-1.1-1.1-1.2zm-15.4 0L3.2 8.9l1.1 1.1 1.1-1.1a5.6 5.6 0 017.9 0l1.1 1.1 1.1-1.1-1.1-1.2a7.2 7.2 0 00-10.2 0zM12 11.2l-2.4 2.4 1.1 1.1L12 13.4l1.3 1.3 1.1-1.1-2.4-2.4z"/>
      </svg>
    )
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    iconColor: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10',
    logo: (
      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500"></div>
    )
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    iconColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10',
    logo: (
      <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L4 5v6c0 5.5 3.5 10.1 8 11 4.5-.9 8-5.5 8-11V5l-8-3zm0 2c1.7 0 3.3.4 4.8 1.2L12 17.5 7.2 5.2c1.5-.8 3.1-1.2 4.8-1.2z"/>
      </svg>
    )
  }
];

const WalletConnect = ({ wallet, onConnect, onSwitchNetwork }) => {
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  
  // Custom Profile States
  const [username, setUsername] = useState('');
  const [selectedGradient, setSelectedGradient] = useState('violet');
  
  // Edit Profile Temp States
  const [tempUsername, setTempUsername] = useState('');
  const [tempGradient, setTempGradient] = useState('violet');
  
  const dropdownRef = useRef(null);

  // Load Custom Profile from LocalStorage when connected
  useEffect(() => {
    if (wallet.address) {
      const savedProfile = localStorage.getItem(`ugf_profile_${wallet.address.toLowerCase()}`);
      if (savedProfile) {
        const { username: savedName, gradient: savedGrad } = JSON.parse(savedProfile);
        setUsername(savedName || `Pioneer_${wallet.address.slice(-4)}`);
        setSelectedGradient(savedGrad || 'violet');
      } else {
        const defaultName = `Pioneer_${wallet.address.slice(-4)}`;
        setUsername(defaultName);
        setSelectedGradient('violet');
      }
    }
  }, [wallet.address]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsEditing(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCopy = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleEditInit = () => {
    setTempUsername(username);
    setTempGradient(selectedGradient);
    setIsEditing(true);
  };

  const handleRandomize = () => {
    setIsRolling(true);
    setTimeout(() => setIsRolling(false), 600);
    const randomIdx = Math.floor(Math.random() * web3Names.length);
    setTempUsername(web3Names[randomIdx]);
  };

  const handleSaveProfile = () => {
    const trimmed = tempUsername.trim().slice(0, 14);
    const finalName = trimmed || `Pioneer_${wallet.address.slice(-4)}`;
    setUsername(finalName);
    setSelectedGradient(tempGradient);
    
    if (wallet.address) {
      localStorage.setItem(
        `ugf_profile_${wallet.address.toLowerCase()}`, 
        JSON.stringify({ username: finalName, gradient: tempGradient })
      );
    }
    setIsEditing(false);
  };

  const triggerConnect = () => {
    setIsOpen(false);
    onConnect();
  };

  const activeGradClasses = avatarGradients[selectedGradient]?.classes || avatarGradients.violet.classes;
  const activeTempGradClasses = avatarGradients[tempGradient]?.classes || avatarGradients.violet.classes;
  const tempTheme = avatarGradients[tempGradient] || avatarGradients.violet;

  if (wallet.address) {
    return (
      <div className="relative" ref={dropdownRef}>
        
        {/* Sleek Connected Navbar Profile Pill */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 bg-[#090e1a]/80 border border-white/[0.06] hover:border-primary/30 rounded-full transition-all duration-300 shadow-md active:scale-98 cursor-pointer select-none"
        >
          <div className={`w-6.5 h-6.5 rounded-full bg-gradient-to-br ${activeGradClasses} flex items-center justify-center text-[10px] font-black text-white shadow-inner relative z-10`}>
            <div className="absolute inset-0 rounded-full bg-black/10 mix-blend-overlay"></div>
            {username.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-white tracking-wide max-w-[85px] truncate">{username}</div>
            <div className="text-[9px] font-mono text-slate-500 tracking-wider">
              {wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}
            </div>
          </div>
          <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-slate-500'}`} />
        </button>

        {/* High-End, Human-Designed Obsidian Dropdown Card */}
        {isOpen && (
          <div className="absolute right-0 mt-3 w-[21rem] bg-[#06080e]/98 border border-white/[0.07] rounded-[2rem] p-5 shadow-2xl backdrop-blur-3xl z-[999] transition-all">
            
            {/* Extremely micro, thin ambient lighting line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            
            {!isEditing ? (
              // PROFILE VIEW STAGE
              <div className="space-y-5">
                
                {/* User avatar header banner */}
                <div className="flex items-start justify-between pb-3.5 border-b border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeGradClasses} flex items-center justify-center shadow-lg relative overflow-hidden group`}>
                      <div className="absolute inset-0 bg-black/5 mix-blend-overlay"></div>
                      <span className="text-sm font-black text-white tracking-wider">{username.slice(0,2).toUpperCase()}</span>
                    </div>
                    
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono uppercase text-slate-500 tracking-[0.18em] font-bold">Collector Profile</div>
                      <h4 className="text-sm font-bold text-white tracking-wide truncate mt-0.5">{username}</h4>
                    </div>
                  </div>

                  {/* Edit profile launcher */}
                  <button
                    onClick={handleEditInit}
                    className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/20 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10px] font-semibold tracking-wider font-mono uppercase"
                  >
                    <Edit3 size={11} /> Edit
                  </button>
                </div>

                {/* Network Node and Switch Button */}
                <div className="p-3 bg-black/35 rounded-2xl border border-white/[0.04] flex items-center justify-between shadow-inner">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-slate-500 font-bold">Network Node</span>
                    {wallet.isOnCorrectChain ? (
                      <span className="text-[10px] font-mono text-slate-300 font-medium flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Base Sepolia
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-rose-400 font-medium flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> Wrong Network
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-lg transition-all flex items-center gap-1.5 font-mono text-[9px] text-slate-300 hover:text-white cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={10} className="text-emerald-400" />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy size={10} />
                        <span>{wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Switch network banner if on wrong network */}
                {!wallet.isOnCorrectChain && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onSwitchNetwork();
                    }}
                    className="w-full py-3 bg-amber-950/20 hover:bg-amber-950/30 border border-amber-500/20 hover:border-amber-500/35 text-amber-400 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Globe size={12} className="animate-spin" style={{ animationDuration: '4s' }} /> Switch to Base Sepolia
                  </button>
                )}

                {/* Financial Ledger Section */}
                <div className="space-y-2">
                  <div className="text-[9px] font-mono uppercase text-slate-500 tracking-[0.2em] font-bold">Asset Ledger</div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3.5 bg-black/20 rounded-2xl border border-white/[0.03] flex flex-col justify-between">
                      <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                        <Globe size={9} className="text-blue-500" /> ETH
                      </span>
                      <span className="text-xs font-mono font-extrabold text-white mt-1.5">
                        {Number(wallet.ethBalance).toFixed(4)}
                      </span>
                    </div>
                    
                    <div className="p-3.5 bg-black/20 rounded-2xl border border-white/[0.03] flex flex-col justify-between">
                      <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles size={9} className="text-cyan-400" /> MOCK USD
                      </span>
                      <span className="text-xs font-mono font-extrabold text-cyan-400 mt-1.5">
                        ${wallet.mockUsdBalance}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Switching network area */}
                <div className="space-y-2.5">
                  <div className="text-[9px] font-mono uppercase text-slate-500 tracking-[0.2em] font-bold">Switch Wallet Connection</div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {walletsList.map((w) => (
                      <button
                        key={w.id}
                        onClick={triggerConnect}
                        title={`Switch to ${w.name}`}
                        className={`h-9 rounded-xl bg-black/40 border border-white/[0.04] hover:border-white/20 flex items-center justify-center transition-all cursor-pointer hover:bg-white/[0.02]`}
                      >
                        {w.logo}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logout Action */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    disconnect();
                  }}
                  className="w-full py-3 bg-red-950/20 hover:bg-red-950/30 border border-red-500/10 hover:border-red-500/20 text-red-400/90 hover:text-red-400 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut size={12} /> Disconnect Session
                </button>

              </div>
            ) : (
              // EDIT PROFILE MODE STAGE (UPGRADED HIGH-END CYBER PRESET ENGINE - PREMIUM AESTHETIC - LARGE FONTS)
              <div className="space-y-6 animate-float" style={{ animationDuration: '10s' }}>
                
                {/* Header title */}
                <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.04]">
                  <h4 className="text-base font-black uppercase text-white tracking-[0.25em] flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${tempTheme.textClasses} bg-current`}></span>
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${tempTheme.textClasses} bg-current`}></span>
                    </span>
                    Calibrate Profile
                  </h4>
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/25 text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Highly Visual Avatar signature selector - CURATED CYBER CHIPS */}
                <div className="space-y-3.5">
                  <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 block">
                    Signature Theme Matrix
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(avatarGradients).map((key) => {
                      const grad = avatarGradients[key];
                      const isSel = tempGradient === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setTempGradient(key)}
                          className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex items-center gap-3.5 bg-black/40 hover:bg-white/[0.01] group relative overflow-hidden ${
                            isSel 
                              ? 'border-white/20 bg-white/[0.02]' 
                              : 'border-white/[0.04] hover:border-white/10'
                          }`}
                          style={{
                            boxShadow: isSel ? `0 4px 20px -5px ${grad.glowColor}, inset 0 0 10px ${grad.glowColor}` : 'none'
                          }}
                        >
                          {/* Glowing tag code in the top corner */}
                          <div className={`absolute top-2 right-3 font-mono text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${isSel ? grad.textClasses : 'text-slate-500'}`}>
                            {grad.tag}
                          </div>
                          
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad.classes} shadow-md group-hover:scale-105 transition-transform flex-shrink-0 relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                          </div>
                          
                          <div className="min-w-0">
                            <span className={`text-sm font-extrabold block truncate transition-colors ${isSel ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                              {grad.name.split(' ')[1]}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500 font-bold tracking-widest block uppercase mt-0.5">
                              {grad.vibe}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Commandprefix input box with animated dice spinner and custom active border glows */}
                <div className="space-y-3.5">
                  <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 flex justify-between items-center">
                    <span>Alias Handle</span>
                    <span className={`text-[11px] font-mono font-bold transition-colors duration-300 ${tempTheme.textClasses}`}>
                      Max 14 characters
                    </span>
                  </label>
                  
                  <div 
                    className={`relative flex items-center bg-black/55 rounded-2xl border p-2 transition-all duration-300 ${tempTheme.borderFocus}`}
                    style={{
                      boxShadow: `0 0 15px -8px ${tempTheme.glowColor}`
                    }}
                  >
                    <span className={`font-mono text-xs font-black px-4 py-2 bg-white/[0.03] border border-white/[0.04] rounded-xl uppercase tracking-widest select-none transition-colors duration-300 ${tempTheme.textClasses}`}>
                      ALIAS
                    </span>
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value.slice(0, 14))}
                      placeholder="Set Alias"
                      className="flex-1 bg-transparent text-white font-mono font-bold text-sm px-4 py-2 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleRandomize}
                      className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center mr-1"
                      title="Randomize Alias"
                    >
                      <Dices size={16} className={`transition-all duration-500 ${isRolling ? 'rotate-180 scale-115 text-primary animate-pulse' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Highly visual holographic preview badge card with scanning indicators */}
                <div 
                  className="p-4.5 bg-black/45 rounded-[1.5rem] border border-white/[0.04] flex items-center gap-4.5 transition-all relative overflow-hidden"
                  style={{
                    boxShadow: `inset 0 0 25px -5px ${tempTheme.glowColor}`
                  }}
                >
                  {/* Outer Corner Crop Indicators */}
                  <div className="absolute top-2.5 left-2.5 text-[9px] font-mono text-slate-600 select-none">┌ ID: {tempTheme.tag}</div>
                  <div className="absolute top-2.5 right-2.5 text-[9px] font-mono text-slate-600 select-none">┐</div>
                  <div className="absolute bottom-2.5 left-2.5 text-[9px] font-mono text-slate-600 select-none">└</div>
                  <div className="absolute bottom-2.5 right-2.5 text-[9px] font-mono text-slate-600 select-none">┘ {wallet.address.slice(2, 6).toUpperCase()}</div>

                  <div className="absolute inset-x-0 h-px bg-white/10 top-0 pointer-events-none animate-scanline opacity-40"></div>
                  
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeTempGradClasses} flex items-center justify-center text-base font-black text-white shadow-lg relative overflow-hidden flex-shrink-0`}>
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                    {tempUsername.slice(0, 2).toUpperCase() || 'P'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-black">Signature Tag preview</div>
                    <span className="text-base font-black text-white mt-1 block tracking-wider truncate uppercase font-mono">{tempUsername || 'Pioneer'}</span>
                    <span className="text-xs font-mono text-slate-500 block mt-0.5 uppercase tracking-widest">Vault ID: {wallet.address.slice(2, 8).toUpperCase()}</span>
                  </div>
                </div>

                {/* Save and Cancel actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="py-3.5 bg-white/[0.02] border border-white/[0.04] hover:border-white/15 text-slate-400 hover:text-white font-bold text-xs rounded-2xl transition-all cursor-pointer uppercase tracking-widest font-mono active:scale-98"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className={`py-3.5 bg-gradient-to-r ${tempTheme.classes} text-white font-black text-xs rounded-2xl hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5 uppercase tracking-widest font-mono`}
                    style={{
                      boxShadow: `0 4px 15px -3px ${tempTheme.glowColor}`
                    }}
                  >
                    <Save size={12} /> Save Changes
                  </button>
                </div>

              </div>
            )}

          </div>
        )}
      </div>
    );
  }

  // Not connected - directly invoke onConnect to launch the native Web3Modal selection
  return (
    <button
      onClick={onConnect}
      className="bg-[#090e1a]/85 border border-white/[0.06] hover:border-primary/40 text-slate-200 hover:text-white px-5 py-2.5 rounded-full font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-2 active:scale-96 shadow-lg cursor-pointer font-mono"
    >
      <Wallet size={13} className="text-primary" />
      <span>Connect Wallet</span>
    </button>
  );
};

export default WalletConnect;
