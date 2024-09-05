import React from 'react';

export const UKFlag: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="24" height="12" {...props}>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
    </clipPath>
    <path d="M0,0 v30 h60 v-30 z" fill="#00247d"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#cf142b" strokeWidth="4"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6"/>
  </svg>
);

export const GreeceFlag: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 18" width="24" height="16" {...props}>
    <rect width="27" height="18" fill="#0D5EAF"/>
    <path fill="#FFF" d="M0,2h27v2H0zm0,4h27v2H0zm0,4h27v2H0zm0,4h27v2H0z"/>
    <rect width="10" height="10" fill="#FFF"/>
    <rect width="6" height="10" fill="#0D5EAF" x="2"/>
    <rect width="10" height="6" fill="#0D5EAF" y="2"/>
  </svg>
);