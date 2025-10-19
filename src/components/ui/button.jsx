import React from 'react';
const cls=(...a)=>a.filter(Boolean).join(' ');
export const Button = React.forwardRef(function Button({ className, variant='default', size='md', as:Tag='button', ...p }, ref){
  const base='inline-flex items-center justify-center rounded-lg border text-sm font-medium transition-colors focus:outline-none px-4 py-2';
  const variants={ default:'bg-black text-white hover:opacity-90 border-transparent', outline:'bg-white text-black border-gray-300 hover:bg-gray-50', ghost:'bg-transparent text-black border-transparent hover:bg-gray-50' };
  const sizes={ sm:'px-3 py-1.5 text-sm', md:'px-4 py-2 text-sm', lg:'px-5 py-3 text-base' };
  return <Tag ref={ref} className={cls(base, variants[variant]||variants.default, sizes[size]||sizes.md, className)} {...p} />;
});
