import React from 'react';
import { CheckCircle2, XCircle, Loader2, ExternalLink, X } from 'lucide-react';

const TransactionStatus = ({ state, onClose }) => {
  const isSuccess = state.status === 'Success';
  const isError = state.status === 'Error';
  const isLoading = !isSuccess && !isError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-2xl overflow-hidden border border-slate-700 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
          <h3 className="font-semibold text-lg">Transaction Status</h3>
          {(!isLoading) && (
            <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-8 flex flex-col items-center text-center">
          
          <div className="mb-6 relative">
            {isLoading && (
              <div className="w-16 h-16 text-primary animate-spin">
                <Loader2 size={64} />
              </div>
            )}
            {isSuccess && (
              <div className="w-16 h-16 text-accent animate-bounce-short">
                <CheckCircle2 size={64} />
              </div>
            )}
            {isError && (
              <div className="w-16 h-16 text-red-500">
                <XCircle size={64} />
              </div>
            )}
          </div>
          
          <h4 className="text-xl font-bold mb-2">
            {state.status}
          </h4>
          
          <p className="text-slate-400 text-sm mb-6">
            {state.message}
          </p>

          {state.hash && (
            <a 
              href={`https://sepolia.basescan.org/tx/${state.hash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:text-blue-400 transition-colors bg-blue-500/10 py-2 px-4 rounded-lg"
            >
              View on Basescan
              <ExternalLink size={14} />
            </a>
          )}

          {isSuccess && (
            <button onClick={onClose} className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-colors border border-slate-700">
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;
