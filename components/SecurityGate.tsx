import React, { useState } from 'react';
import { Lock, Check, X } from 'lucide-react';

interface SecurityGateProps {
  onAccessGranted: () => void;
}

const SecurityGate: React.FC<SecurityGateProps> = ({ onAccessGranted }) => {
  const [stage, setStage] = useState<'initial' | 'yes' | 'no'>('initial');
  const [yesAnswer, setYesAnswer] = useState('');
  const [noAnswer, setNoAnswer] = useState('');
  const [yesError, setYesError] = useState('');
  const [noError, setNoError] = useState('');

  const correctYesAnswer = 'SUGARPLUM';
  const blankedAnswer = 'S_G_RPL_M'; // UGAR is missing
  const correctNoAnswer = 'PLEASE LET ME HAVE ACCESS';

  const handleYes = () => {
    setStage('yes');
    setYesError('');
  };

  const handleNo = () => {
    setStage('no');
    setNoError('');
  };

  const handleYesSubmit = () => {
    const userAnswer = yesAnswer.toUpperCase().trim();
    if (userAnswer === correctYesAnswer) {
      onAccessGranted();
    } else {
      setYesError('❌ Wrong answer! Try again.');
      setYesAnswer('');
    }
  };

  const handleNoSubmit = () => {
    const userAnswer = noAnswer.trim();
    if (userAnswer === correctNoAnswer) {
      onAccessGranted();
    } else {
      setNoError(`❌ Incorrect. Type exactly: "${correctNoAnswer}"`);
      setNoAnswer('');
    }
  };

  const handleYesKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleYesSubmit();
  };

  const handleNoKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNoSubmit();
  };

  const handleBack = () => {
    setStage('initial');
    setYesAnswer('');
    setNoAnswer('');
    setYesError('');
    setNoError('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
            <Lock size={40} className="text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Initial Stage */}
        {stage === 'initial' && (
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Babe! <br /> is that you???
            </h1>
            <div className="flex gap-4">
              <button
                onClick={handleYes}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg"
              >
                YES
              </button>
              <button
                onClick={handleNo}
                className="flex-1 bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg"
              >
                NO
              </button>
            </div>
          </div>
        )}

        {/* YES Stage - OTP Answer */}
        {stage === 'yes' && (
          <div className="text-center space-y-6">
            <button
              onClick={handleBack}
              className="text-slate-500 hover:text-slate-700 text-sm font-semibold mb-4 transition-colors"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-black text-slate-900">WHO AM I?</h2>
            
            <div className="bg-slate-100 rounded-xl p-6 space-y-4">
              <p className="text-lg font-mono font-bold text-slate-700 tracking-widest">
                {blankedAnswer}
              </p>
              <p className="text-xs text-slate-500">
                Fill in the missing letters above
              </p>
            </div>

            <input
              type="text"
              value={yesAnswer}
              onChange={(e) => {
                setYesAnswer(e.target.value);
                setYesError('');
              }}
              onKeyPress={handleYesKeyPress}
              placeholder="Enter the answer"
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-center font-bold text-lg uppercase"
              autoFocus
            />

            {yesError && (
              <p className="text-red-600 font-semibold text-sm">{yesError}</p>
            )}

            <button
              onClick={handleYesSubmit}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Submit Answer
            </button>
          </div>
        )}

        {/* NO Stage - Typing Test */}
        {stage === 'no' && (
          <div className="text-center space-y-6">
            <button
              onClick={handleBack}
              className="text-slate-500 hover:text-slate-700 text-sm font-semibold mb-4 transition-colors"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-black text-slate-900">Request Access</h2>
            
            <div className="bg-slate-100 rounded-xl p-4">
              <p className="text-sm text-slate-700 font-semibold">
                TYPE PLEASE LET ME HAVE ACCESS BELOW
              </p>
            </div>

            <input
              type="text"
              value={noAnswer}
              onChange={(e) => {
                setNoAnswer(e.target.value);
                setNoError('');
              }}
              onKeyPress={handleNoKeyPress}
              placeholder="Type the message..."
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-center font-semibold"
              autoFocus
            />

            {noError && (
              <p className="text-red-600 font-semibold text-xs">{noError}</p>
            )}

            <button
              onClick={handleNoSubmit}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Submit Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityGate;
