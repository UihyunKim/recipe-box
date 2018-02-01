import React, { Component } from 'react';
import update from 'immutability-helper';

export default class Add extends Component {

  showInputView() {
    this.props.updateState(update(this.props.state, {add: {showInput: {$apply: (bool)=>!bool}}}));
    // console.log(this.props.state.add.showInput)
  }

  render() {
    return (
      <div className="Add">
        <div className="add-title" onClick={this.showInputView.bind(this)}>Add new</div>

        {/* input toggle */}
        {this.props.state.add.showInput ?
          <div className="add-input-container">
            <form onSubmit={this.handleSubmit}>
              <input
                className="input-title"
                onChange={this.handleChange}
                value={this.state.text}
              />
              <button>
                Add
              </button>
            </form>
          </div>
          :
          ""
        }
      </div>
    );
  }
}