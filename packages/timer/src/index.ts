import { useState, useEffect } from 'react';
import { addZero } from './utils/util';

let timer: NodeJS.Timer | null = null;

export interface TimeType {
  hour: string;
  minute: string;
  second: string;
}

export default function useTimer(props: { time?: TimeType }) {
  const time = props.time || {
    hour: '00',
    minute: '00',
    second: '00',
  };
  const [date, setDate] = useState(time)

  useEffect(() => {
    timer && clearInterval(timer);
    countDown();
    return () => {
      timer && clearInterval(timer);
    }
  }, [props.time]);

  // 倒计时
  const countDown = () => {
    timer = setInterval(() => {
      setDate((date: TimeType) => {
        let { hour, minute, second } = date;
        if (second >= '59') {
          second = '00';
          const newMinute = Number(minute) + 1;
          minute = newMinute > 9 ? newMinute.toString() : addZero(newMinute);
        } else if (minute >= '59') {
          minute = '00';
          const newHour = Number(hour) + 1;
          hour = newHour > 9 ? newHour.toString() : addZero(newHour);
        } else {
          const newSecond = Number(second) + 1;
          second = newSecond > 9 ? newSecond.toString() : addZero(newSecond);
        }
        return {
          hour,
          minute,
          second,
        }
      })
    }, 1000)
  };

  return date;
}