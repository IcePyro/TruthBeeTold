import StateModel from './StateModel';
import Home from './states/Home';
import Settings from './states/Settings';
import Lobby from './states/Lobby';
import ArticleSelect from './states/ArticleSelect';
import Queen from './states/Queen';
import Bee from './states/Bee';
import Wasp from './states/Wasp';
import Wait from './states/Wait';

export enum State {Home, Settings, Lobby,ArticleSelect, Queen, Bee, Wasp, Wait}

export default class States {
  public static init() {
    this.model(State.Home).setEnabled(true);
  }

  public static model(state: State): StateModel {
    return StateComponents[state].model;
  }

  public static get stateElements(): JSX.Element[] {
    return Object.values(StateComponents).map(file => file.element);
  }

  public static serverToClientState(serverState: number) {
    return ServerToClientStates[serverState];
  }
}

const ServerToClientStates: {[key: number]: number} = {
  0: State.Home,
  1: State.Settings,
  2: State.Lobby,
  3: State.ArticleSelect,
  4: State.Queen,
  5: State.Bee,
  6: State.Wasp,
  7: State.Wait,
};

const StateComponents: {[key: number]: {model: StateModel, element: JSX.Element}} = {};
addFile(State.Home, Home);
addFile(State.Settings, Settings);
addFile(State.Lobby, Lobby);
addFile(State.ArticleSelect, ArticleSelect);
addFile(State.Queen, Queen);
addFile(State.Bee, Bee);
addFile(State.Wasp, Wasp);
addFile(State.Wait, Wait);

function addFile(state: State, Component: any) {
  const model = new StateModel();
  StateComponents[state] = {
    model,
    element: <Component stateModel={model} key={state}/>
  };
}


