import React from 'react';
import EkgLoader from "./EkgLoader.jsx";

export default function Loader({className}) {
  return (
    <div className={`loaderPage ${className}`}>
        <EkgLoader strokeColor='white'/>
      <div className="loading-text">
        <span>C</span>
        <span>a</span>
        <span>r</span>
        <span>g</span>
        <span>a</span>
        <span>n</span>
        <span>d</span>
        <span>o</span>
      </div>
    </div>
  );
}
