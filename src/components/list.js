import React, { Component } from 'react';
import update from 'immutability-helper';

export default class List extends Component {

// Simple showings toggler
  showIngsToggle(originList, idx) {
    const bool = originList.list[idx].showIngs;
    return update(originList, {list: {[idx]: {showIngs: {$set: !bool}}}})
  }

  recipeToggle(id, idx) {
    // this.props.recipeToggle(id, idx);

    // recipe OPEN -> CLOSE
    if (this.props.state.list[idx].showIngs) {
      this.props.updateState(this.showIngsToggle(this.props.state, idx));
    }

    else {
      // find other recipe OPEN,
      const promise = new Promise((resolve, reject)=> {
        resolve(this.props.state.list.findIndex(el => el.showIngs));
      });

      // other recipe OPEN -> CLOSE
      promise
        .then((idxShowIngs) => {
          if (idxShowIngs > -1) {
            this.props.updateState(this.showIngsToggle(this.props.state, idxShowIngs))
          }
        })
        .then(()=> {
          // Make the recipe OPEN,
          this.props.updateState(this.showIngsToggle(this.props.state, idx))
        })
    };

  }

  recipeDelete(state, idx) {
    // this.props.recipeDelete(id, idx);
    const newState = update(state, { list: { $splice: [[ idx, 1 ]] } });
    this.props.updateState(newState);
  }

  render() {
    return (
      <div className="list">
        {this.props.state.list.map((el, idx)=>
          (
            <div className="recipe" key={idx}>

              <div className="recipe-title">
                <h2 onClick={this.recipeToggle.bind(this, el.id, idx)}>{el.title}</h2>
                <h3 onClick={this.recipeDelete.bind(this, this.props.state, idx)}>del</h3>
              </div>

              {el.showIngs ?
                <div className="recipe-ings">
                  <ul>
                    {el.ings.map((ing, idx) => (
                        <li key={idx}>{ing}</li>
                    ))}
                  </ul>
                </div>
                :
                ""
              }
            </div>
          )
        )}

      </div>
    );
  }
}