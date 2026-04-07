import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { PaperClipWidget } from './components/PaperClipWidget';
import { OfficePage } from './pages/Office';

function App() {
  const [view, setView] = useState<'dashboard' | 'office'>('dashboard');
  const [clock, setClock] = useState(new Date().toLocaleTimeString('ko-KR'));

  useEffect(() => {
    const t = setInterval(() => setClock(new Date().toLocaleTimeString('ko-KR')), 1000);
    return () => clearInterval(t);
  }, []);

  if (view === 'office') {
    return (
      <div className="relative h-screen">
        <OfficePage />
        <button
          onClick={() => setView('dashboard')}
          className="absolute top-2 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 border border-slate-700/50 rounded-lg text-xs text-slate-400 hover:text-white hover:border-slate-600 transition-all backdrop-blur-sm"
        >
          Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid" style={{ backgroundColor: '#0a0f1a' }}>
      <div className="max-w-5xl mx-auto p-6">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              ONS Studio
            </h1>
            <p className="text-[11px] text-slate-500 font-mono mt-1">{clock}</p>
          </div>
          <button
            onClick={() => setView('office')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/60 border border-slate-700/50 rounded-lg text-xs text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
          >
            <Building2 size={12} />
            Office View
          </button>
        </div>

        {/* Paper Clip Engine Dashboard — this is the main interface */}
        <PaperClipWidget />

      </div>
    </div>
  );
}

export default App;
