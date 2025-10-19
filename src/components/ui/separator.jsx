import React from 'react';
export function Separator({ className, ...p }){ return <hr {...p} className={['border-0 h-px bg-gray-200 my-4', className].filter(Boolean).join(' ')} />; }
