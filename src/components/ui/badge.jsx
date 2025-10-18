import React from 'react';
export function Badge({ children, className, variant='default', ...p }){
  const v = variant==='secondary' ? 'bg-gray-100 text-gray-800' : 'bg-black text-white';
  return <span {...p} className={['inline-block text-xs font-medium px-2.5 py-1 rounded-full', v, className].filter(Boolean).join(' ')}>{children}</span>;
}
