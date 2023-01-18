import React, { useState, useEffect } from 'react';
import { fetchStartTime } from '../Database/firestore';
export function Timer({ minutes, onExpire }) {
  const [timer, settimer] = useState('20:00');
  const [StartTime, setStartTime] = useState(new Date());
  useEffect(() => {
    fetchStartTime(setStartTime);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const timeObject = new Date();
      let minute;
      if (timer !== '00:00' && timer !== 'Expired') {
        let diff = (timeObject.getTime() - StartTime.getTime()) / 1000;
        if (diff <= 0) {
          alert("Game hasn't started yet");
          settimer(() => 'Expired');
        } else {
          let minuteInt = minutes - parseInt(diff / 60, 10) - 1;
          if (minuteInt < 0) {
            settimer(() => 'Expired');
          } else {
            let seconds = parseInt(diff % 60, 10);
            seconds = 59 - seconds;
            if (minuteInt < 10) {
              minute = '0' + minuteInt;
            } else {
              minute = minuteInt + '';
            }
            if (seconds < 10) seconds = '0' + seconds;
            settimer(minute + ':' + seconds);
          }
        }
      } else {
        //called at round end
        onExpire();
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [timer]);
  return <p>{timer}</p>;
}