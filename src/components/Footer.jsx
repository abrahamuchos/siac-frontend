import React from 'react';
import ferrerLogo from '../assets/img/ferrer-logo-about.png';

export default function Footer() {
  return (
    <footer>
      <small className="text-muted text-center">Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. <span></span>
        <a href="/#" className='text-muted text-decoration-none'>Términos y
          condiciones</a>. <span></span>{new Date().getFullYear()} SIAC.
      </small>
      <div className='ferrer-logo'>
        <img src={ferrerLogo} alt="Ferrer Logo"/>
      </div>
    </footer>
  );
}