/* Auto-create missing "@/components/ui/*" modules to prevent Vite build errors */
const fs = require('fs'); const path = require('path');
const SRC = path.join(process.cwd(),'src'); const UI_DIR = path.join(SRC,'components','ui');
const TPL = {
  input:`import React from 'react';export const Input=React.forwardRef(function Input(p,ref){return <input ref={ref} {...p} className={['block w-full rounded-lg border border-gray-300 px-3 py-2',p.className].filter(Boolean).join(' ')} />;});`,
  textarea:`import React from 'react';export const Textarea=React.forwardRef(function Textarea(p,ref){return <textarea ref={ref} {...p} className={['block w-full rounded-lg border border-gray-300 px-3 py-2',p.className].filter(Boolean).join(' ')} />;});`,
  label:`import React from 'react';export function Label({className,...p}){return <label {...p} className={['block text-sm font-medium text-gray-700 mb-1',className].filter(Boolean).join(' ')} />;}`,
  select:`import React,{createContext,useContext,useEffect,useRef,useState} from 'react';const C=createContext(null);const cx=(...a)=>a.filter(Boolean).join(' ');export function Select({defaultValue,value:cv,onValueChange,children,disabled,open:co,onOpenChange,className}){const [v,setV]=useState(defaultValue??'');const [o,setO]=useState(false);const val=cv!==undefined?cv:v;const op=co!==undefined?co:o;const setVal=(x)=> onValueChange?onValueChange(x):setV(x);const setOp=(x)=> onOpenChange?onOpenChange(x):setO(x);return <C.Provider value={{value:val,setValue:setVal,open:op,setOpen:setOp,disabled:!!disabled}}><div className={className}>{children}</div></C.Provider>;}export function SelectTrigger({placeholder='Select…',className,children,...p}){const {value,open,setOpen,disabled}=useContext(C)??{};return <button type='button' disabled={disabled} onClick={()=>setOpen&&setOpen(!open)} className={cx('cc-select-trigger inline-flex items-center justify-between w-full rounded-lg border px-3 py-2 text-sm bg-white',disabled&&'opacity-60 cursor-not-allowed',className)} {...p}><span className='truncate'>{value||placeholder}</span><svg width='16' height='16' viewBox='0 0 20 20' fill='none' className={cx('ml-2 transition-transform',open&&'rotate-180')}><path d='M5 7l5 6 5-6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/></svg>{children}</button>;}export function SelectValue({placeholder='Select…',className}){const {value}=useContext(C)??{};return <span className={className}>{value||placeholder}</span>;}export function SelectContent({className,children,sameWidth=true,...p}){const {open,setOpen}=useContext(C)??{};const ref=useRef(null);useEffect(()=>{function on(e){if(ref.current && !ref.current.contains(e.target)) setOpen?.(false);}if(open) document.addEventListener('mousedown',on);return ()=>document.removeEventListener('mousedown',on);},[open,setOpen]);if(!open) return null;return <div ref={ref} className={cx('cc-select-content absolute z-50 mt-2 max-h-72 overflow-auto rounded-lg border bg-white shadow-md',className)} style={{minWidth:sameWidth?'100%':undefined}} {...p}>{children}</div>;}export function SelectItem({value,children,className,...p}){const {value:val,setValue,setOpen}=useContext(C)??{};const sel=val===value;return <div role='option' aria-selected={sel} onClick={()=>{setValue?.(value);setOpen?.(false);}} className={cx('px-3 py-2 text-sm cursor-pointer hover:bg-gray-100',sel&&'bg-gray-100 font-medium',className)} {...p}>{children??String(value)}</div>;}if(typeof document!=='undefined'&&!document.getElementById('cc-select-style')){const s=document.createElement('style');s.id='cc-select-style';s.textContent='.cc-select-trigger{border-color:#e5e7eb}.cc-select-content{border-color:#e5e7eb}';document.head.appendChild(s);}`,
  card: fs.readFileSync(path.join(SRC,'components','ui','card.jsx'),'utf8'),
  button: fs.readFileSync(path.join(SRC,'components','ui','button.jsx'),'utf8'),
};
const FALLBACK = (name)=>`import React from 'react'; export default function ${name.replace(/[^a-z0-9]/ig,'_')}(p){return <div {...p}/>}`;

const exts=new Set(['.js','.jsx','.ts','.tsx']);
function walk(d, out=[]){
  for(const e of fs.readdirSync(d,{withFileTypes:true})){
    if(e.name.startsWith('.')) continue;
    const p=path.join(d,e.name);
    if(e.isDirectory()) walk(p,out);
    else if(exts.has(path.extname(e.name))) out.push(p);
  }
  return out;
}
function ensureDir(p){ fs.mkdirSync(path.dirname(p),{recursive:true}); }

(function main(){
  if(!fs.existsSync(SRC)){ console.error('❌ src/ not found'); process.exit(1); }
  ensureDir(UI_DIR);
  const files=walk(SRC); const needs=new Set(); const rx=/from\s+["']@\/components\/ui\/([^"']+)["']/g;
  for(const f of files){ const s=fs.readFileSync(f,'utf8'); for(const m of s.matchAll(rx)){ const name=m[1].trim(); if(name) needs.add(name); } }
  let created=0;
  for(const name of needs){
    const base=path.join(UI_DIR,name);
    const exists=['.jsx','.tsx','.js','.ts'].some(ext=>fs.existsSync(base+ext));
    if(exists) continue;
    const tpl = TPL[name] || FALLBACK(name);
    ensureDir(base+'.jsx'); fs.writeFileSync(base+'.jsx',tpl,'utf8'); console.log('🧩 created', path.relative(process.cwd(),base+'.jsx')); created++;
  }
  console.log(created?`✅ created ${created} ui stub(s)`: '✅ no missing ui stubs');
})();
