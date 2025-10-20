import { useState, useEffect, useRef } from 'react';

export function timerString(millis: number) {
  var minutes = Math.floor(millis / 60000);
  var seconds = Math.floor((millis % 60000) / 1000);
  var ms = Math.floor((millis % 1000) / 10);
  return (minutes > 0 ? minutes + ':' : '')+ (seconds < 10 ? '0' : '') + seconds.toFixed(0) + "." + ms;
}

export function Stopwatch({ onChange }) {
  const [startTime, setStartTime] = useState(new Date());
  const [timer, setTimer] = useState(0);

  const timerId = useRef(null);

  useEffect(() => {
    timerId.current = setInterval(() => {
      const timeMs = new Date() - startTime;
      setTimer(timeMs);
      onChange(timeMs);
    });

    return () => {
      clearInterval(timerId.current);
    };
  }, []);

  return timerString(timer);
}