import {action, computed, makeAutoObservable, observable} from 'mobx';
import React from 'react';


export default class StateModel {
  constructor() { makeAutoObservable(this); }

  @observable enabled = false;

  @action setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

export interface StateComponentProps {
  stateModel: StateModel;
}

export class StateComponent extends React.Component<StateComponentProps> {}
