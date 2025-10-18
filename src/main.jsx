import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './setupRuntimeDebug.js';
import { ErrorBoundary } from './ErrorBoundary.jsx';
import { mountHealthOverlay } from './HealthOverlay.jsx';

function DynamicApp(){
  const [Comp, setComp] = React.useState(()=>() => <div style={{padding:16,fontFamily:'ui-sans-serif,system-ui'}}>Loading…</div>);
  React.useEffect(()=>{
    (async () => {
      try {
        let AppMod;
        try { AppMod = await import('./App.jsx'); }
        catch { AppMod = await import('./App.tsx'); }
        const App = AppMod?.default;
        setComp(()=> App ? App : () => <div style={{padding:16,color:'#b91c1c'}}>No default export from App.*</div>);
      } catch (e) {
        const msg = String(e?.message || e);
        console.error('Failed to load App.*', e);
        setComp(()=>() => (
          <div style={{padding:16,fontFamily:'ui-sans-serif,system-ui'}}>
            <h2 style={{color:'#b91c1c'}}>Failed to load App</h2>
            <pre style={{whiteSpace:'pre-wrap',background:'#fef2f2',border:'1px solid #fecaca',padding:'12px',borderRadius:'8px',color:'#7f1d1d'}}>{msg}</pre>
          </div>
        ));
      }
    })();
  }, []);
  return <ErrorBoundary><Comp/></ErrorBoundary>;
}

function ensureRoot(){
  let el = document.getElementById('root');
  if(!el){ el = document.createElement('div'); el.id='root'; document.body.appendChild(el); }
  return el;
}

ReactDOM.createRoot(ensureRoot()).render(
  <React.StrictMode>
    <DynamicApp/>
  </React.StrictMode>
);

// Mount live health overlay independently of the main App
mountHealthOverlay();
