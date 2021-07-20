import React from 'react';
import '../styles/game.sass';
import PageModel from './PageModel';
import {observer} from 'mobx-react';

export interface GameProps {
  page: PageModel;
}

@observer
export default class Game extends React.Component<GameProps> {
  render(): React.ReactNode {
    return (<div style={this.props.page.enabledStyle}>
      <h1>Game</h1>
    </div>);
  }
}
