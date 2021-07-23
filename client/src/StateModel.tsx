import {action, computed, makeAutoObservable, observable} from 'mobx';
import React from 'react';


export default class StateModel {
  constructor() { makeAutoObservable(this); }

  @observable enabled = false;

  @action setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  @computed get enabledStyle() {
    return {display: this.enabled ? 'block' : 'none'};
  }
}

export interface StateComponentProps {
  stateModel: StateModel;
}

export class StateComponent extends React.Component<StateComponentProps> {}
