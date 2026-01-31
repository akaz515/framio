
import React, { useState, useRef, useEffect } from 'react';
import { FrameSettings } from './types';
import PhotoCanvas, { PhotoCanvasHandle } from './components/PhotoCanvas';

// TUTAJ WPISZ SWÓJ LINK DO PLIKU NA GITHUBIE
// Ważne: Link musi zaczynać się od raw.githubusercontent.com
const GITHUB_FRAME_URL = 'https://raw.githubusercontent.com/PiotrS91/pwr-frame/main/pwr-frame.svg';

const App: React.FC = () => {
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
  const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);
  const [userFileName, setUserFileName] = useState<string>('');
  const [frameFileName, setFrameFileName] = useState<string>('');
  const [isFrameLoading, setIsFrameLoading] = useState<boolean>(true);
  const [frameError, setFrameError] = useState<boolean>(false);
  
  const [settings, setSettings] = useState<FrameSettings>({
    zoom: 1.0,
    offsetX: 0,
    offsetY: 0,
  });
  
  const canvasHandleRef = useRef<PhotoCanvasHandle>(null);

  // Automatyczne ładowanie ramki z GitHuba przy starcie
  useEffect(() => {
    const loadDefaultFrame = () => {
      setIsFrameLoading(true);
      const img = new Image();
      // KLUCZOWE: crossOrigin pozwala na pobieranie danych obrazu do Canvas z innego serwera
      img.crossOrigin = "anonymous"; 
      img.onload = () => {
        setFrameImage(img);
        setFrameFileName('Pobrano z GitHub');
        setIsFrameLoading(false);
        setFrameError(false);
      };
      img.onerror = () => {
        console.error("Nie udało się pobrać ramki z GitHuba. Wymagane ręczne wgranie.");
        setIsFrameLoading(false);
        setFrameError(true);
      };
      img.src = GITHUB_FRAME_URL;
    };

    loadDefaultFrame();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, isFrame: boolean) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (isFrame) {
      setFrameFileName(file.name);
      setFrameError(false);
    } else {
      setUserFileName(file.name);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (isFrame) {
          setFrameImage(img);
        } else {
          setUserImage(img);
          setSettings({ zoom: 1.0, offsetX: 0, offsetY: 0 });
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const downloadImage = () => {
    const canvas = canvasHandleRef.current?.getCanvas();
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `AbsolwentPWr-${userFileName.split('.')[0] || 'zdjęcie'}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center py-6 px-4">
      <header className="mb-6 text-center">
        <div className="inline-block bg-[#9d132c] text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded mb-2 shadow-sm">
          Generator Zdjęć Profilowych
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-1 tracking-tight">#AbsolwentPWr</h1>
        <p className="text-gray-500 text-xs md:text-sm max-w-md mx-auto">
          Twoja oficjalna ramka absolwenta Politechniki Wrocławskiej w wysokiej jakości.
        </p>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            
            {/* STATUS RAMKI */}
            <div className={`p-4 rounded-2xl border-2 transition-all ${frameError ? 'border-red-200 bg-red-50' : 'border-emerald-100 bg-emerald-50'}`}>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plik Ramki (SVG/PNG)</h2>
                {isFrameLoading && <span className="text-[10px] text-[#9d132c] animate-pulse font-bold">ŁADOWANIE...</span>}
              </div>
              
              {!isFrameLoading && (
                <>
                  <input type="file" accept=".svg,.png,.jpg,.jpeg" onChange={(e) => handleFileUpload(e, true)} className="hidden" id="upload-frame" />
                  <label htmlFor="upload-frame" className={`flex flex-col items-center justify-center p-3 rounded-xl cursor-pointer transition-all font-bold text-xs ${frameError ? 'bg-red-500 text-white' : 'bg-white text-emerald-600 border border-emerald-200'}`}>
                    {frameError ? 'BŁĄD LINKU - WGRAJ RĘCZNIE' : 'ZMIEŃ RAMKĘ'}
                  </label>
                  <p className="text-[9px] text-gray-400 mt-2 truncate text-center font-mono opacity-60">
                    {frameFileName || 'Brak pliku'}
                  </p>
                </>
              )}
            </div>

            {/* KROK 2: TWOJE ZDJĘCIE */}
            <div className={`p-4 rounded-2xl border-2 transition-all ${frameImage && !userImage ? 'border-[#9d132c] bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Krok 2: Twoje zdjęcie</h2>
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, false)} className="hidden" id="upload-photo" />
              <label htmlFor="upload-photo" className={`flex flex-col items-center justify-center p-3 rounded-xl cursor-pointer transition-all font-bold text-xs shadow-sm ${frameImage ? 'bg-[#9d132c] text-white hover:bg-[#7a0e22]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                {userImage ? 'ZMIEŃ ZDJĘCIE' : 'WYBIERZ ZDJĘCIE'}
              </label>
              {userFileName && <p className="text-[9px] text-gray-400 mt-2 truncate text-center font-mono">{userFileName}</p>}
            </div>

            {/* KROK 3: DOSTOSOWANIE */}
            {userImage && frameImage && (
              <div className="space-y-5 pt-4 border-t border-gray-100">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Skala</span>
                    <span className="text-[10px] font-bold text-[#9d132c]">{Math.round(settings.zoom * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0.1" max="4" step="0.01" value={settings.zoom}
                    onChange={(e) => setSettings({...settings, zoom: parseFloat(e.target.value)})}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#9d132c]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Poziom (X)</span>
                    <input
                      type="range" min="-1500" max="1500" value={settings.offsetX}
                      onChange={(e) => setSettings({...settings, offsetX: parseInt(e.target.value)})}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Pion (Y)</span>
                    <input
                      type="range" min="-1500" max="1500" value={settings.offsetY}
                      onChange={(e) => setSettings({...settings, offsetY: parseInt(e.target.value)})}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-400"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => setSettings({zoom: 1, offsetX: 0, offsetY: 0})}
                  className="w-full text-center text-[9px] font-bold text-gray-400 hover:text-[#9d132c] transition-colors py-1"
                >
                  RESTART POZYCJI
                </button>
              </div>
            )}
          </div>

          {userImage && frameImage && (
            <button
              onClick={downloadImage}
              className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-bold shadow-xl hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              POBIERZ GOTOWE ZDJĘCIE
            </button>
          )}
        </aside>

        <main className="lg:col-span-8">
          <div className="bg-white p-4 md:p-6 rounded-[2rem] shadow-sm border border-gray-100 min-h-[500px] flex items-center justify-center relative">
            {isFrameLoading ? (
              <div className="flex flex-col items-center animate-pulse">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#9d132c] rounded-full animate-spin mb-4"></div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Pobieranie ramki z GitHub...</p>
              </div>
            ) : frameImage && userImage ? (
              <PhotoCanvas 
                ref={canvasHandleRef} 
                image={userImage} 
                frameImage={frameImage}
                settings={settings} 
              />
            ) : (
              <div className="text-center space-y-6 max-w-sm">
                {!frameImage ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                    <p className="text-red-700 font-bold">Nie udało się pobrać ramki automatycznie</p>
                    <p className="text-gray-400 text-xs">Upewnij się, że plik na GitHubie jest publiczny i link jest poprawny, lub wgraj ramkę ręcznie przyciskiem po lewej.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto text-[#9d132c] shadow-inner">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <p className="text-[#9d132c] font-black uppercase tracking-tight text-xl">Wgraj swoje zdjęcie</p>
                    <p className="text-gray-400 text-xs leading-relaxed">Twoje zdjęcie zostanie automatycznie dopasowane do okienka ramki Politechniki Wrocławskiej.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="mt-8 text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] text-center opacity-50">
        Politechnika Wrocławska &bull; Stowarzyszenie Absolwentów &bull; 2024
      </footer>
    </div>
  );
};

export default App;
