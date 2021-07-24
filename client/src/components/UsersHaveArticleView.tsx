import React from 'react';
import {observer} from 'mobx-react';
import {game} from '../game/Game';
import {ReadonlyReady} from './ReadonlyReady';


export const UsersHaveArticleView: React.FC = observer(() => {
  return (
    <>
      { game.otherUsers.users.map((user, i) => {
        return <div key={i}>
          <span>{ user.username }</span>
          <ReadonlyReady ready={user.hasArticle} />
        </div>;
      }) }
    </>
  );
});
