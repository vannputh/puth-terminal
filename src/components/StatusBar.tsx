"use client";

import React, { useState, useEffect, FC } from 'react';
import { format } from 'date-fns';

const StatusBar: FC = () => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setCurrentTime(new Date());
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const resizeHandler = () => checkMobile();
    window.addEventListener('resize', resizeHandler);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <div className="w-full bg-black text-indigo-500 p-1 text-xs md:text-xs flex justify-between items-center fixed bottom-0 left-0 border-t-2 border-green-500 z-10">
      <div className="truncate flex-shrink-0">vannputhika@terminal:~$</div>
      <div className="text-right text-xs md:text-xs ml-2 flex-shrink-0">
        {currentTime ? format(currentTime, isMobile ? 'dd/MM/yy HH:mm' : 'dd/MM/yyyy, hh:mm:ss a') : ''}
      </div>
    </div>
  );
};

export default StatusBar; 