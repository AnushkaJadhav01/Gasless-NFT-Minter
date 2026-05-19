import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Sparkles } from 'lucide-react';

const DocsModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 bg-[#030509]/80 backdrop-blur-xl"
          onClick={onClose}
        >
          {/* Subtle glowing elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

          <motion.div 
            initial={{ scale: 0.98, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 15, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="w-full max-w-4xl max-h-[85vh] bg-[#090d16] border border-white/[0.08] rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.04] bg-[#0c1220]/50 backdrop-blur-md relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Sparkles className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">How Gasless Minting Works</h2>
                  <p className="text-xs text-slate-400">A simple, step-by-step guide to zero-fee transactions</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 border border-white/[0.05] hover:scale-105 active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Container */}
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8 relative z-10">
              
              {/* Introduction Card */}
              <div className="p-6 rounded-[2rem] bg-gradient-to-r from-primary/10 to-secondary/10 border border-white/[0.05] relative overflow-hidden">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="text-accent animate-pulse" size={18} /> What makes this special?
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Normally, doing anything on the blockchain requires you to pay a transaction fee (called "gas") in Ethereum (ETH). If you have 0 ETH, you are stuck. 
                  Our app uses a technology that completely removes this barrier! **You pay absolutely $0 in real Ethereum gas fees.**
                </p>
              </div>

              {/* Simple 3-Step Process Visualizer */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">The 3-Step Process</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Step 1 */}
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 font-bold text-lg">
                      1
                    </div>
                    <h4 className="font-semibold text-white">We Check the Fee</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Our system calculates the tiny network fee required to mint your badge and translates it to standard Mock USD.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 font-bold text-lg">
                      2
                    </div>
                    <h4 className="font-semibold text-white">You Sign Free Approval</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      You click "Approve" in your wallet. This is a completely free signature—no money leaves your wallet, and you spend 0 ETH.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 font-bold text-lg">
                      3
                    </div>
                    <h4 className="font-semibold text-white">We Sponsor the Gas!</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Our secure relayer pays the real Ethereum gas fee on Base Sepolia for you. Your NFT mints instantly to your wallet!
                    </p>
                  </div>

                </div>
              </div>

              {/* Simple Q&A Section */}
              <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <HelpCircle size={16} /> Frequently Asked Questions
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Q1 */}
                  <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] space-y-2">
                    <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Do I need to buy Ethereum (ETH) to use this?
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed pl-3.5">
                      **No!** You can have exactly 0 ETH in your wallet. Our system sponsors the gas fees completely, making it 100% free for you.
                    </p>
                  </div>

                  {/* Q2 */}
                  <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] space-y-2">
                    <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      Is this safe for my wallet?
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed pl-3.5">
                      **Yes, completely.** The signature you provide is just a secure proof that authorizes the gas sponsorship. It has absolutely no access to your other digital assets or funds.
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DocsModal;
