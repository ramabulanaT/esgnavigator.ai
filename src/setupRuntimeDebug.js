(function(){
  // Force visible body (guard against global CSS hiding content)
  try{
    const s=document.createElement('style'); s.id='cc-reset';
    s.textContent='html,body,#root{min-height:100%;} body{display:block !important;background:#fff !important;}';
    document.head.appendChild(s);
  }catch(e){}
  function show(msg){
    try{
      let el=document.getElementById('esg-debug-banner');
      if(!el){
        el=document.createElement('div');
        el.id='esg-debug-banner';
        el.style.cssText='position:fixed;top:0;left:0;right:0;z-index:999999;padding:8px 12px;background:#111827;color:#fef2f2;font:12px/1.4 ui-sans-serif,system-ui;max-height:40vh;overflow:auto';
        document.body.appendChild(el);
      }
      const pre=document.createElement('pre'); pre.style.cssText='margin:0;white-space:pre-wrap'; pre.textContent=msg; el.appendChild(pre);
    }catch(e){ console.error(e); }
  }
  window.addEventListener('error', (e)=> show(`Runtime error: ${e.message}`));
  window.addEventListener('unhandledrejection', (e)=> show(`Unhandled promise: ${e.reason}`));
})();
