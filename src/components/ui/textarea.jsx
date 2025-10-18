import React from 'react';
export const Textarea = React.forwardRef(function Textarea(props, ref){
  return <textarea ref={ref} {...props} className={['block w-full rounded-lg border border-gray-300 px-3 py-2', props.className].filter(Boolean).join(' ')} />;
});
