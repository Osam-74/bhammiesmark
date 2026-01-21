
import React from 'react';
import { WatermarkSettings, FONT_FAMILIES } from '../types';
import { Type, ImageIcon, LayoutGrid, X } from 'lucide-react';

interface ControlSectionProps {
  activeSection: 'text' | 'logo' | 'layout';
  settings: WatermarkSettings;
  setSettings: React.Dispatch<React.SetStateAction<WatermarkSettings>>;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
}

const ControlSection: React.FC<ControlSectionProps> = ({ activeSection, settings, setSettings, onLogoUpload, onClose }) => {
  const updateSetting = <K extends keyof WatermarkSettings>(key: K, value: WatermarkSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
          {activeSection} Settings
        </h4>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
          <X size={18} />
        </button>
      </div>

      {activeSection === 'text' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-2xl border border-blue-100 mb-4">
             <span className="text-sm font-bold text-blue-700">Enable Text</span>
             <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.showText}
                onChange={(e) => updateSetting('showText', e.target.checked)}
              />
              <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
            </label>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Watermark Message</label>
            <input 
              type="text" 
              value={settings.text}
              onChange={(e) => updateSetting('text', e.target.value)}
              placeholder="Type here..."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm font-bold text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Size ({settings.fontSize}px)</label>
              <input 
                type="range" min="8" max="150" step="1" 
                value={settings.fontSize}
                onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Color</label>
              <div className="h-10 flex items-center px-1 bg-white border border-slate-200 rounded-xl">
                <input 
                  type="color" 
                  value={settings.color}
                  onChange={(e) => updateSetting('color', e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer border-none bg-transparent"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Font Style</label>
            <select 
              value={settings.fontFamily}
              onChange={(e) => updateSetting('fontFamily', e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
            >
              {FONT_FAMILIES.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {activeSection === 'logo' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-2xl border border-purple-100 mb-4">
             <span className="text-sm font-bold text-purple-700">Enable Logo</span>
             <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.showLogo}
                onChange={(e) => updateSetting('showLogo', e.target.checked)}
              />
              <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
            </label>
          </div>

          {!settings.logoUrl ? (
            <label className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-50 transition-all group active:scale-[0.98]">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-300 group-hover:text-purple-500 mb-3 border border-slate-100">
                <ImageIcon size={24} />
              </div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Select Logo</span>
              <input type="file" className="hidden" accept="image/*" onChange={onLogoUpload} />
            </label>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                 <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden p-2 shadow-sm shrink-0">
                    <img src={settings.logoUrl} className="max-w-full max-h-full object-contain" alt="Logo preview" />
                 </div>
                 <label className="text-[10px] font-black text-white bg-slate-900 px-4 py-2 rounded-xl cursor-pointer hover:bg-black uppercase tracking-widest active:scale-95 transition-all">
                  Change
                  <input type="file" className="hidden" accept="image/*" onChange={onLogoUpload} />
                 </label>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Logo Scale</label>
                  <span className="text-xs font-mono font-bold text-purple-600">{settings.logoScale}%</span>
                </div>
                <input 
                  type="range" min="5" max="300" step="1" 
                  value={settings.logoScale}
                  onChange={(e) => updateSetting('logoScale', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {activeSection === 'layout' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Global Opacity</label>
              <span className="text-xs font-mono font-bold text-emerald-600">{Math.round(settings.opacity * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={settings.opacity}
              onChange={(e) => updateSetting('opacity', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Rotation Angle</label>
              <span className="text-xs font-mono font-bold text-emerald-600">{settings.angle}°</span>
            </div>
            <input 
              type="range" min="-90" max="90" step="1" 
              value={settings.angle}
              onChange={(e) => updateSetting('angle', parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Horizontal Gap</label>
                <span className="text-xs font-mono font-bold text-emerald-600">{settings.spacingX}px</span>
              </div>
              <input 
                type="range" min="0" max="600" step="5" 
                value={settings.spacingX}
                onChange={(e) => updateSetting('spacingX', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Vertical Gap</label>
                <span className="text-xs font-mono font-bold text-emerald-600">{settings.spacingY}px</span>
              </div>
              <input 
                type="range" min="0" max="600" step="5" 
                value={settings.spacingY}
                onChange={(e) => updateSetting('spacingY', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlSection;
