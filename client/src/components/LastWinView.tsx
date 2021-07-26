import React from 'react';
import {game} from '../game/Game';
import {observer} from 'mobx-react';
import {findUserById} from '../game/CommonUser';

export const LastWinView: React.FC = observer(() => {
  const lastWin = game.wins.last;
  if (!lastWin) return <></>;

  const queen = findUserById(lastWin.queenId)?.username;
  const bee = findUserById(lastWin.beeId)?.username;
  const selected = findUserById(lastWin.selectedId)?.username;

  let message = '';
  if (lastWin.correct) {
    message = `Queen '${queen || ''}' selected wisely, the Bee '${bee || ''}' told the truth`;
  } else {
    message = `Queen '${queen || ''}' selected poorly, the Wasp '${selected || ''}' was lying. The Bee '${bee || ''}' was telling the truth`;
  }

  return (
    <div>{message}</div>
  );
});
