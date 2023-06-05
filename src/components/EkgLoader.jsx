import React from 'react';

export default function EkgLoader({className, style, strokeColor = "#605DEC"}) {
  return (
    <>
      <div className={`ekgLoader ${className}`} style={style}>
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
             x="0px" y="0px" viewBox="-470 260 500 50" xmlSpace="preserve" width='100%' height='50px'>
          <polyline fill="none" className="ekg" stroke={strokeColor} strokeWidth="2" strokeLinecap="square"
                    strokeMiterlimit="10"
                    points="-470,281
           -436,281 -418.9,281 -423.9,281 -363.2,281 -355.2,269 -345.2,303 -335.2,263 -325.2,291
             -319.2,281 100,281 "/>
        </svg>
      </div>

    </>

  )
    ;
}