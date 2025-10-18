import React from 'react';
export class ErrorBoundary extends React.Component {
  constructor(p){ super(p); this.state={ error:null }; }
  static getDerivedStateFromError(err){ return { error: err }; }
  componentDidCatch(err, info){ console.error('ErrorBoundary', err, info); }
  render(){
    if (!this.state.error) return this.props.children;
    const msg = String(this.state.error?.message || this.state.error || 'Unknown error');
    return (
      <div style={{fontFamily:'ui-sans-serif,system-ui',padding:'16px'}}>
        <h2 style={{color:'#b91c1c'}}>Something went wrong</h2>
        <pre style={{whiteSpace:'pre-wrap',background:'#fef2f2',border:'1px solid #fecaca',padding:'12px',borderRadius:'8px',color:'#7f1d1d'}}>{msg}</pre>
        <p>Open DevTools → Console for details.</p>
      </div>
    );
  }
}
