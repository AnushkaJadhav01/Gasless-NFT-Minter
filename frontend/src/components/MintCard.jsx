import React from 'react';
import { Hexagon, CheckCircle2, Zap } from 'lucide-react';

const MintCard = ({ wallet, onMint, isMinting, hasMinted }) => {
  return (
    <div className="glass-panel w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group bg-surface/50 backdrop-blur-xl">
      {/* Subtle top highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      <div className="p-8 flex flex-col items-center relative z-10">
        <div className="w-28 h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative overflow-hidden group-hover:border-white/20 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
          {hasMinted ? (
            <Hexagon size={48} className="text-accent drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" fill="currentColor" fillOpacity={0.2} strokeWidth={1} />
          ) : (
            <Hexagon size={48} className="text-white/60" strokeWidth={1} />
          )}
          
          {isMinting && (
            <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
          )}
        </div>
        
        <h3 className="text-2xl font-semibold mb-2 tracking-tight">UGF Pioneer</h3>
        <p className="text-slate-400 text-center text-sm mb-8 leading-relaxed">
          Exclusive early adopter badge for testing the Universal Gas Framework on Base Sepolia.
        </p>

        {!wallet.address ? (
          <div className="w-full text-center p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm">
            Connect wallet to mint
          </div>
        ) : hasMinted ? (
          <div className="w-full py-3.5 px-4 rounded-xl bg-accent/10 border border-accent/20 text-accent font-medium flex items-center justify-center gap-2">
            <CheckCircle2 size={18} />
            Badge Minted
          </div>
        ) : (
          <button 
            onClick={onMint}
            disabled={isMinting}
            className={`w-full py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              isMinting 
                ? 'bg-white/5 text-white/50 cursor-not-allowed border border-white/10' 
                : 'bg-white text-black hover:bg-gray-200 active:scale-[0.98]'
            }`}
          >
            {isMinting ? (
              <>
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <Zap size={16} />
                Mint Gasless Badge
              </>
            )}
          </button>
        )}
        
        {wallet.address && !hasMinted && (
           <div className="mt-5 flex w-full justify-between text-xs font-medium px-1">
             <span className="text-slate-500">Network Fee</span>
             <span className="text-white flex items-center gap-1"><Zap size={10} className="text-slate-400"/> Paid via UGF</span>
           </div>
        )}
      </div>
    </div>
  );
};

export default MintCard;
