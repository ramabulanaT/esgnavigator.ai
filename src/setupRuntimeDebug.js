(function(){
  function show(msg){
    try{
      let el=document.getElementById('esg-debug-banner');
      if(!el){
        el=document.createElement('div');
        el.id='esg-debug-banner';
        el.style.cssText='position:fixed;top:0;left:0;right:0;z-index:999999;padding:10px 14px;background:#111827;color:#fef2f2;font:14px/1.4 ui-sans-serif,system-ui;max-height:40vh;overflow:auto';
        document.body.appendChild(el);
      }
      const pre=document.createElement('pre'); pre.style.cssText='margin:0;white-space:pre-wrap'; pre.textContent=msg; el.appendChild(pre);
    }catch(e){ console.error(e); }
  }
  window.addEventListener('error', (e)=> show(`Runtime error: ${e.message}`));
  window.addEventListener('unhandledrejection', (e)=> show(`Unhandled promise: ${e.reason}`));
})();
