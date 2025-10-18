import React from 'react';
export function Label({ className, ...p }){ return <label {...p} className={['block text-sm font-medium text-gray-700 mb-1', className].filter(Boolean).join(' ')} />; }
