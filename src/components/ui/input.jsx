import React from 'react';
export const Input = React.forwardRef(function Input(props, ref){
  return <input ref={ref} {...props} className={['block w-full rounded-lg border border-gray-300 px-3 py-2', props.className].filter(Boolean).join(' ')} />;
});
