import StateModel, {StateComponent} from './StateModel';
import Home from './states/Home';
import Settings from './states/Settings';
import Lobby from './states/Lobby';
import ArticleSelect from './states/ArticleSelect';
import Queen from './states/Queen';
import Bee from './states/Bee';
import Wasp from './states/Wasp';
import Wait from './states/Wait';
import {user} from './session/User';

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

const StateComponents = {
  [State.Home]: createFile(Home),
  [State.Settings]: createFile(Settings),
  [State.Lobby]: createFile(Lobby),
  [State.ArticleSelect]: createFile(ArticleSelect),
  [State.Queen]: createFile(Queen),
  [State.Bee]: createFile(Bee),
  [State.Wasp]: createFile(Wasp),
  [State.Wait]: createFile(Wait),
};

function createFile(Component: any): {model: StateModel, element: JSX.Element} {
  const model = new StateModel();
  return {
    model,
    element: <Component stateModel={model}/>
  };
}


