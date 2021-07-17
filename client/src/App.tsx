import './styles/app.sass';
import React from 'react';
import Home from './pages/Home';
import {ClearSession} from './components/ClearSession';

export default class App extends React.Component {
  constructor(props: any) {
    super(props);

  }

  render(): React.ReactNode {
    return (
      <>
        <Home />
        <ClearSession />
      </>
    );
  }
}
