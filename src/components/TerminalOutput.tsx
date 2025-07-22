"use client";

import React from 'react';
import DOMPurify from 'dompurify';

interface TerminalOutputProps {
  html: string;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ html }) => {
  const sanitizedHtml = typeof window !== 'undefined' && DOMPurify.isSupported 
    ? DOMPurify.sanitize(html) 
    : html;

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
      suppressHydrationWarning={true}
    />
  );
};

export default TerminalOutput; 