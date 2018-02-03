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

  // Close other opened recipe
  callback(param) {
    if (param === 'close') {

      // (step1) If turn on add input,
      if (this.props.state.add.showInput) {

        // (step2)find index of opened recipe
        const idx = this.props.state.list.findIndex(el => el.showIngs);

        // (step3) If opened recipe exist, close
        if(idx > -1) {
          this.props.updateState(
            update(this.props.state,
              {list: {[idx]: {showIngs: {$set: false}}}}
            )
          );
        }
      }

    }

    // else param === index
    else if (param === 'open') {

      const idx = (this.props.state.list.length - 1);

      const list1 = update(
          this.props.state, {list: {[idx]: {showIngs: {$set: true}}}}
        )

      const list2 = update(
          list1, {add: {showInput: {$set: false}}}
        )

      this.props.updateState(list2);
    }


  }

  // ADD button
  handleClickAddNew() {
    // input view switch
    this.props.updateState(
      update(this.props.state,
        {add: {showInput: {$apply: (bool)=>!bool}}}
      ),
      // callback
      this.callback.bind(this, 'close')
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
      title: this.state.title || 'untitled',
      ings: items.length > 0 ? items : ['blank'],
      showIngs: false,
    }

    // step2. update List
    // add list if text area is written
    if (this.state.title.length + this.state.ings.length > 0) {
      this.props.updateState(
        update(
          this.props.state, {list: {$push: [newRecipe]}}
        ),
        // callback
        this.callback.bind(this, 'open')
      )
    }
    // Click "Cancel", close input.
    else {
      this.props.updateState(
        update(
          this.props.state, {add: {showInput: {$set: false}}}
        )
      )
    }

    // step3. reset this.state
    this.handleThisState('reset');

  }

  render() {
    return (
      <div className="Add">
        <div
          className="add-title"
          onClick={this.handleClickAddNew.bind(this)}
        >Add new</div>

        {/* input toggle */}
        {this.props.state.add.showInput ?

          <div className="add-input-container">
            <form onSubmit={this.handleSubmit.bind(this)}>

              {/* Input title */}
              <input
                className="input-title"
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
                {this.state.title.length + this.state.ings.length > 0 ?
                  'Add' : 'Cancel'}
              </button>

            </form>
          </div>

        : "" }

      </div>
    );
  }
}