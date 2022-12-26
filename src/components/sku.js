import React, { useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
export default function Sku({ id, parent, setSku, expiretime }) {
  const [timer, settimer] = useState('00:01');
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'sku',
      item: { id, parent, expiretime },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [id, timer]
  );
  //settimer(() => timeObject.getSeconds().toString());
  useEffect(() => {
    const timeout = setTimeout(() => {
      const timeObject = new Date();
      if (
        timer !== '00:00' &&
        timer !== 'Expired' &&
        expiretime !== 'Expired'
      ) {
        let diff = (timeObject.getTime() - expiretime.toDate()) / 1000;
        let minuteInt = 4 - parseInt(diff / 60, 10);
        let seconds = diff % 60;
        if (minuteInt < 0) {
          settimer(() => 'Expired');
        } else {
          seconds = 59 - parseInt(seconds, 10);
          if (minuteInt < 10) var minute = '0' + minuteInt;
          if (seconds < 10) seconds = '0' + seconds;
          settimer(minute + ':' + seconds);
        }
      } else {
        settimer(() => 'Expired');
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [timer, parent]);
  return (
    <div
      className="sku"
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        color: timer === 'Expired' ? 'red' : 'black',
        justifyContent: 'space-around',
      }}
      onClick={() => {
        setSku(id);
      }}
    >
      <p id={id}></p>
      <div>
        <p>{timer}</p>
      </div>
    </div>
  );
}
