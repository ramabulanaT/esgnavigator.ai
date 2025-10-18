import React, {createContext,useContext,useState,useId} from 'react';
const TabsCtx = createContext(null);
export function Tabs({ defaultValue, value:controlled, onValueChange, children, className }){
  const [val, setVal] = useState(defaultValue);
  const v = controlled ?? val;
  const set = (x)=> (onValueChange? onValueChange(x) : setVal(x));
  return <TabsCtx.Provider value={{value:v,set}}><div className={className}>{children}</div></TabsCtx.Provider>;
}
export function TabsList({ children, className }){ return <div className={['inline-flex rounded-lg border border-gray-300 p-1 bg-white',className].filter(Boolean).join(' ')}>{children}</div>; }
export function TabsTrigger({ value, children, className }){
  const ctx = useContext(TabsCtx); const active = ctx?.value===value;
  return <button type="button" onClick={()=>ctx?.set(value)} className={['px-3 py-1.5 rounded-md text-sm', active?'bg-black text-white':'text-black hover:bg-gray-100', className].filter(Boolean).join(' ')}>{children}</button>;
}
export function TabsContent({ value, children, className }){
  const ctx = useContext(TabsCtx); if(ctx?.value!==value) return null;
  return <div className={className}>{children}</div>;
}
