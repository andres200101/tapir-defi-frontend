// src/hooks/useCountUp.js
import { useEffect, useState } from "react";

export default function useCountUp(value, duration = 800) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value);
    if (isNaN(end)) return setDisplay(0);
    if (end === 0) return setDisplay(0);

    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setDisplay(start);
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(display);
}
