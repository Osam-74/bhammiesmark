
import React, { useState, useRef, useEffect } from 'react';
import { WatermarkSettings, FONT_FAMILIES, BatchImage } from './types';
import ControlSection from './components/ControlSection';
import PreviewCanvas from './components/PreviewCanvas';
import Header from './components/Header';
import { renderWatermark } from './utils/drawEngine';
import { Upload, Download, RefreshCcw, Image as ImageIcon, Type, LayoutGrid, ShieldCheck, Layers, X, Plus } from 'lucide-react';

const DEFAULT_SETTINGS: WatermarkSettings = {
  text: 'BHAMMIESMARK PROTECTED',
  showText: true,
  fontSize: 24,
  fontFamily: 'Inter',
  color: '#000000',
  showLogo: false,
  logoUrl: null,
  logoScale: 50,
  opacity: 0.3,
  angle: -45,
  spacingX: 100,
  spacingY: 80,
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<BatchImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [settings, setSettings] = useState<WatermarkSettings>(DEFAULT_SETTINGS);
  const [activeMenu, setActiveMenu] = useState<'text' | 'logo' | 'layout' | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2800);
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = (menu: 'text' | 'logo' | 'layout') => {
    setActiveMenu(prev => (prev === menu ? null : menu));
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages: BatchImage[] = [];
    let loadedCount = 0;

    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          newImages.push({
            id: Math.random().toString(36).substr(2, 9),
            file,
            img,
            name: file.name
          });
          loadedCount++;
          if (loadedCount === files.length) {
            setImages(prev => [...prev, ...newImages]);
            if (images.length === 0) setCurrentIndex(0);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
    // Clear input so same files can be re-uploaded if needed
    e.target.value = '';
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setLogoImage(img);
          setSettings(prev => ({ ...prev, showLogo: true, logoUrl: event.target?.result as string }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadSingle = (canvas: HTMLCanvasElement, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const handleDownloadCurrent = () => {
    if (!canvasRef.current || images.length === 0) return;
    setIsExporting(true);
    setTimeout(() => {
      downloadSingle(canvasRef.current!, `bhammiesmark_${images[currentIndex].name}`);
      setIsExporting(false);
    }, 100);
  };

  const handleDownloadAll = async () => {
    if (images.length === 0) return;
    setIsExporting(true);
    setExportProgress(0);

    if (!hiddenCanvasRef.current) {
      hiddenCanvasRef.current = document.createElement('canvas');
    }
    const canvas = hiddenCanvasRef.current;
    
    for (let i = 0; i < images.length; i++) {
      setExportProgress(Math.round(((i + 1) / images.length) * 100));
      const item = images[i];
      renderWatermark(canvas, item.img, logoImage, settings);
      downloadSingle(canvas, `bhammiesmark_${item.name}`);
      // Slight delay to prevent browser download blocking
      await new Promise(r => setTimeout(r, 400));
    }

    setIsExporting(false);
    setExportProgress(0);
  };

  const removeImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (currentIndex >= filtered.length) {
        setCurrentIndex(Math.max(0, filtered.length - 1));
      }
      return filtered;
    });
  };

  const handleReset = () => {
    if (window.confirm('Clear all images and reset settings?')) {
      setImages([]);
      setLogoImage(null);
      setSettings(DEFAULT_SETTINGS);
      setActiveMenu(null);
      setCurrentIndex(0);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
        <div className="flex flex-col items-center animate-splash">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-200 mb-6">
            <ShieldCheck size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">BhammiesMark</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Privacy First</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] animate-in fade-in duration-700 pb-24 md:pb-0">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] border-2 border-dashed border-slate-300 rounded-[3rem] bg-white shadow-sm p-12 transition-all hover:border-blue-400">
            <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 text-blue-600 shadow-inner">
              <Upload size={48} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight text-center">Mark Your Visuals</h2>
            <p className="text-slate-500 mb-8 text-center max-w-sm font-medium">
              Add professional watermarks to your photos. Works with single or multiple files. Entirely offline and secure.
            </p>
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl hover:shadow-blue-200/50 flex items-center gap-3 active:scale-95">
              <Upload size={24} />
              Upload Photos
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                multiple
                onChange={handleBulkUpload} 
              />
            </label>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 animate-in fade-in duration-500">
            {/* Preview View */}
            <div className="w-full bg-slate-50 rounded-[2.5rem] p-4 md:p-12 flex items-center justify-center min-h-[450px] border border-slate-100 relative shadow-inner overflow-hidden">
              <PreviewCanvas 
                canvasRef={canvasRef}
                baseImage={images[currentIndex].img}
                logoImage={logoImage}
                settings={settings}
              />
            </div>

            {/* Batch Thumbnail Strip */}
            <div className="w-full flex flex-col gap-3">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Batch Queue ({images.length})</h3>
                <label className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1 group">
                  <Plus size={12} className="group-hover:rotate-90 transition-transform" /> Add More Files
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleBulkUpload} />
                </label>
              </div>
              <div className="flex gap-4 overflow-x-auto py-2 px-2 custom-scrollbar mask-fade-right">
                {images.map((item, idx) => (
                  <div 
                    key={item.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative min-w-[100px] h-[70px] rounded-xl border-2 transition-all cursor-pointer overflow-hidden flex-shrink-0 ${currentIndex === idx ? 'border-blue-500 shadow-md ring-2 ring-blue-100' : 'border-slate-200 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={item.img.src} className="w-full h-full object-cover" alt="thumbnail" />
                    <button 
                      onClick={(e) => removeImage(item.id, e)}
                      className="absolute top-1 right-1 bg-white/90 hover:bg-red-500 hover:text-white text-slate-400 p-0.5 rounded-md transition-colors shadow-sm"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="hidden md:flex flex-col md:flex-row items-center gap-4 w-full max-w-2xl">
              <button 
                onClick={handleDownloadCurrent}
                disabled={isExporting}
                className="w-full md:w-1/2 bg-white border-2 border-slate-900 text-slate-900 font-black py-4 px-8 rounded-3xl flex items-center justify-center gap-3 transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-50"
              >
                <Download size={20} />
                Download Single
              </button>
              <button 
                onClick={handleDownloadAll}
                disabled={isExporting}
                className="w-full md:w-1/2 bg-slate-900 hover:bg-black text-white font-black py-4 px-8 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl hover:translate-y-[-2px] active:translate-y-[1px] disabled:opacity-50 relative overflow-hidden"
              >
                {isExporting && exportProgress > 0 && (
                  <div className="absolute inset-0 bg-blue-600/30 transition-all duration-300" style={{ width: `${exportProgress}%` }} />
                )}
                <Layers size={20} />
                {isExporting ? `Exporting ${exportProgress}%` : 'Process All (Bulk)'}
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="hidden md:block py-8 text-center text-slate-300">
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase">Private • Secure • Professional Batch Processing</p>
      </footer>

      {/* Mobile Bottom Control Menu */}
      {images.length > 0 && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-40 shadow-2xl shadow-slate-900/10 md:hidden">
          <div className="flex items-center justify-center gap-2 py-3 px-4 relative" ref={menuRef}>
            <button 
              onClick={() => toggleMenu('text')}
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all flex-1 ${activeMenu === 'text' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Type size={18} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Text</span>
            </button>
            <button 
              onClick={() => toggleMenu('logo')}
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all flex-1 ${activeMenu === 'logo' ? 'bg-purple-50 text-purple-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <ImageIcon size={18} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Logo</span>
            </button>
            <button 
              onClick={() => toggleMenu('layout')}
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all flex-1 ${activeMenu === 'layout' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <LayoutGrid size={18} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Layout</span>
            </button>
            <button 
              onClick={handleReset}
              className="flex flex-col items-center gap-1 px-5 py-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex-1"
            >
              <RefreshCcw size={18} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Reset</span>
            </button>

            {activeMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 px-4 flex justify-center animate-in slide-in-from-bottom-2 duration-200">
                <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl p-4 w-full max-w-sm">
                  <ControlSection 
                    activeSection={activeMenu}
                    settings={settings} 
                    setSettings={setSettings} 
                    onLogoUpload={handleLogoUpload}
                    onClose={() => setActiveMenu(null)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Mobile Download Buttons - Inside Bottom Nav */}
          {activeMenu === null && (
            <div className="flex gap-2 px-4 pb-3">
              <button 
                onClick={handleDownloadCurrent}
                disabled={isExporting}
                className="flex-1 bg-white border border-slate-900 text-slate-900 font-bold py-2 px-3 text-sm rounded-2xl flex items-center justify-center gap-2 transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-50"
              >
                <Download size={16} />
                <span className="hidden xs:inline">Single</span>
              </button>
              <button 
                onClick={handleDownloadAll}
                disabled={isExporting}
                className="flex-1 bg-slate-900 hover:bg-black text-white font-bold py-2 px-3 text-sm rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <Layers size={16} />
                <span className="hidden xs:inline">{isExporting ? `${exportProgress}%` : 'All'}</span>
              </button>
            </div>
          )}
        </nav>
      )}

      {/* Desktop Top Control Menu */}
      {images.length > 0 && (
        <nav className="hidden md:block bg-white border-b border-slate-100 sticky top-[73px] z-40 shadow-sm px-4">
          <div className="container mx-auto flex items-center justify-center gap-2 md:gap-8 py-2 relative" ref={menuRef}>
            <button 
              onClick={() => toggleMenu('text')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${activeMenu === 'text' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Type size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Text</span>
            </button>
            <button 
              onClick={() => toggleMenu('logo')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${activeMenu === 'logo' ? 'bg-purple-50 text-purple-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <ImageIcon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Logo</span>
            </button>
            <button 
              onClick={() => toggleMenu('layout')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${activeMenu === 'layout' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <LayoutGrid size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Layout</span>
            </button>
            <div className="h-8 w-[1px] bg-slate-100 hidden md:block"></div>
            <button 
              onClick={handleReset}
              className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <RefreshCcw size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Reset</span>
            </button>

            {activeMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 px-4 md:px-0 flex justify-center animate-in slide-in-from-top-2 duration-200">
                <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 w-full max-w-md">
                  <ControlSection 
                    activeSection={activeMenu}
                    settings={settings} 
                    setSettings={setSettings} 
                    onLogoUpload={handleLogoUpload}
                    onClose={() => setActiveMenu(null)}
                  />
                </div>
              </div>
            )}
          </div>
        </nav>
      )}

      <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-2xl md:hidden px-4">
        {/* These buttons are in the bottom nav now for mobile */}
      </div>
    </div>
  );
};

export default App;
