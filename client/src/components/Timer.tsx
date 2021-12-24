import React, {useEffect} from 'react';
import * as styles from '../styles/timer.module.scss';
import {ReadonlyReady} from './ReadonlyReady';
import {inverseLerp} from '../util/MathUtils';
import hsl2hex from 'hsl-to-hex';

export interface UsernameAndReady {
  username: string;
  ready: boolean;
}

interface TimerProps {
  players: UsernameAndReady[];
  startTime: number;
  endTime: number;
}

const startColorHsl = [115, 100, 38];
const endOffsetH = -115;

const startClockUpdater = (start: number, end: number) => {
  const canvas = document.getElementById('timer-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  const update = () => {
    if (ctx == null) return;

    const now = Date.now();
    const t = inverseLerp(start, end, now);

    const arcOffset = Math.PI * 1.5;

    ctx.clearRect(0, 0, 100, 100);
    ctx.fillStyle = hsl2hex(startColorHsl[0] + endOffsetH * Math.max(t, 0), startColorHsl[1], startColorHsl[2]);

    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, 0);
    ctx.arc(50, 50, 50, arcOffset, t * Math.PI * 2 + arcOffset);
    ctx.fill();

    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};

export const Timer: React.FC<TimerProps> = ({
  players,
  startTime,
  endTime
}) => {

  useEffect(() => startClockUpdater(startTime, endTime));
  
  return <div className={styles.wrapper}>
    <div className={styles.players}>
      {
        players.map((player, i) =>
          <div key={i}>
            <span>{ player.username }</span>
            <ReadonlyReady ready={player.ready}/>
          </div>)
      }
    </div>
    <canvas id="timer-canvas" width="100" height="100"/>
  </div>;
};
