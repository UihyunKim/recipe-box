import React, { Component } from 'react';
import update from 'immutability-helper';
const uuid = require('uuid/v1');

export default class Add extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      ings: '',
    }
  }

  // ADD button
  handleClick() {
    // input view switch
    this.props.updateState(update(this.props.state,
      {add: {showInput: {$apply: (bool)=>!bool}}})
    );

    // empty input text area
    this.handleThisState('reset');

  }

  handleThisState(target, e) {
    if (target === "reset") {
      this.setState(update(this.state,
        {$set: { title: '', ings: '', }}
      ))
    }

    else {
      this.setState(update(this.state,
        {[target]: {$set: e.target.value}}
      ))
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    // Convert this.state.ings as comma(,) separated array
    const items = this.state.ings
      .split(',')
      .map((item) => (item.replace(/^ */, '')))
      .filter((item) => (item.length > 0));

    // Pass to updateState
    // step1. update title
    const newRecipe = {
      id: uuid(),
      title: this.state.title,
      ings: items,
      showIngs: false,
    }

    // step2. update List
    this.props.updateState(update(this.props.state,
      {list: {$push: [newRecipe]}}
    ))

    // step3. reset this.state
    this.handleThisState('reset');

  }

  render() {
    return (
      <div className="Add">
        <div
          className="add-title"
          onClick={this.handleClick.bind(this)}
        >Add new</div>

        {/* input toggle */}
        {this.props.state.add.showInput ?

          <div className="add-input-container">
            <form onSubmit={this.handleSubmit.bind(this)}>

              {/* Input title */}
              <input
                className="input-title"
                // onChange={this.handleChangeTitle.bind(this)}
                onChange={this.handleThisState.bind(this, 'title')}
                value={this.state.title}
              />

              {/* Input ingrediants */}
              <input
                className="input-ings"
                onChange={this.handleThisState.bind(this, 'ings')}
                value={this.state.ings}
              />

              <button>
                Add
              </button>

            </form>
          </div>

        : "" }

        {/* {console.log(this.state)} */}
      </div>
    );
  }
}