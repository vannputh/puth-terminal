"use client";

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const StatusBar = () => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set the initial time on the client
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-black text-indigo-500 p-1 text-xs flex justify-between fixed bottom-0 left-0 border-t-2 border-green-500">
      <div>daroh@terminal:~$</div>
      <div>
        {currentTime ? format(currentTime, 'dd/MM/yyyy, hh:mm:ss a') : ''}
      </div>
    </div>
  );
};

export default StatusBar; 