import React from 'react';

export default function Spinner({className, style}) {
  return (
    <>
      <div className={`spinner ${className}`} style={style}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
}