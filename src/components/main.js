import React, { Component } from 'react';
import List from './list';
import Add from './add';
import update from 'immutability-helper';
// const uuid = require('uuid/v1');


export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          id: "uuid1",
          title: "Kimbop",
          ings: ["kim", "bop"],
          showIngs: true,
        },
        {
          id: "uuid2",
          title: "Japchae",
          ings: ["dangmeyon", "carrot", "sauce"],
          showIngs: false,
        },
      ],
      add: {
        showInput: false,
      },
      edit: null,
    }
  }

  componentWillMount() {
    const getStateData = JSON.parse(window.localStorage.getItem('stateData'));
    this.setState(getStateData);

  }

  componentDidUpdate() {
    const stateData = JSON.stringify(this.state);
    window.localStorage.setItem('stateData', stateData);
  }


  // list updater
  updateState (newState, callback) {
    this.setState(newState, callback);
  }

  render() {
    return (
      <div className="Main">
        <Add
          state={this.state}
          updateState={this.updateState.bind(this)}
        />
        <List
          state={this.state}
          updateState={this.updateState.bind(this)}
        />
      </div>
    );
  }
}