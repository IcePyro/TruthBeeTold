import './styles/app.sass';
import React from 'react';
import {ClearSession} from './components/ClearSession';
import {action, computed, makeAutoObservable, observable} from 'mobx';
import {observer} from 'mobx-react';
import States, {State} from './States';
import StateModel from './StateModel';
import {user} from './session/User';

class AppModel {
  constructor() {makeAutoObservable(this);}

  @observable state: State = State.Home;

  @action switchState(nextState: State) {
    console.log(`Switching from state ${this.state} to state ${nextState}`);
    this.currentModel.setEnabled(false);
    this.state = nextState;
    this.currentModel.setEnabled(true);
  }

  @computed get currentModel(): StateModel {
    return States.model(this.state);
  }
}

@observer
export default class App extends React.Component {
  private model = new AppModel();

  public componentDidMount() {
    States.init();

    user.socket.on('statetransition', (state: number) => {
      this.model.switchState(States.serverToClientState(state));
    });
  }

  render(): React.ReactNode {
    return (
      <>
        { States.stateElements }
        <ClearSession />
      </>
    );
  }
}
