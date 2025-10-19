import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './setupRuntimeDebug.js';
import { ErrorBoundary } from './ErrorBoundary.jsx';
import { mountHealthOverlay } from './HealthOverlay.jsx';

function FallbackUI(){
  return (
    <div style={{padding:16,fontFamily:'ui-sans-serif,system-ui'}}>
      <h2>ESG Navigator</h2>
      <p>If your dashboard does not load, check <a href="/diagnostics.html">Diagnostics</a>.</p>
    </div>
  );
}

function DynamicApp(){
  const [Comp, setComp] = React.useState(()=>() => <div style={{padding:16,fontFamily:'ui-sans-serif,system-ui'}}>Loading…</div>);
  React.useEffect(()=>{
    (async () => {
      try {
        let AppMod;
        try { AppMod = await import('./App.jsx'); }
        catch { AppMod = await import('./App.tsx'); }
        const App = AppMod?.default;
        setComp(()=> App ? App : FallbackUI);
      } catch (e) {
        console.error('Failed to load App.*', e);
        setComp(()=>FallbackUI);
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

const root = ReactDOM.createRoot(ensureRoot());
root.render(<React.StrictMode><DynamicApp/></React.StrictMode>);

// time-based guard: if nothing painted, show fallback UI
setTimeout(()=>{
  try{
    const r = document.getElementById('root');
    if (r && r.childElementCount === 0) {
      console.warn('No content rendered after 1s, forcing fallback');
      root.render(<React.StrictMode><FallbackUI/></React.StrictMode>);
    }
  }catch(e){}
}, 1000);

// Always mount the live health badge
mountHealthOverlay();
