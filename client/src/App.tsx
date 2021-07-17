import './styles/app.sass';
import React from 'react';
import Home from './pages/Home';
import {ClearSession} from './components/ClearSession';
import Lobby from './pages/Lobby';
import Game from './pages/Game';

export default class App extends React.Component {
  constructor(props: any) {
    super(props);

  }

  render(): React.ReactNode {
    return (
      <>
        <Home />
        <Lobby />
        <Game />
        <ClearSession />
      </>
    );
  }
}
