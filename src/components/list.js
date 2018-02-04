import React, { Component } from 'react';
import update from 'immutability-helper';

export default class List extends Component {
  constructor (props) {
    super(props);
    this.state = {
      title: '',
      ings: [],
    }
  }

  componentWillMount() {
    console.log('component will mount - list.js');
    const getStateData = JSON.parse(window.localStorage.getItem('listState'));
    console.log(getStateData);
    this.setState(getStateData);

  }

  componentDidUpdate() {
    console.log('componentDidUpdate - list.js');
    console.log(this.state);
    const stateData = JSON.stringify(this.state);
    window.localStorage.setItem('listState', stateData);
  }

  // showIngs toggler
  showIngsToggle(originList, idx) {
    return update(originList,
      {list: {[idx]: {showIngs: {$apply: (bool)=>!bool}}}}
    )
  }

  // edit toggler
  editToggle(originState, id, idx) {
    console.log(originState)
    // fetch data from this recipe
    const newList = {
      title: originState.list[idx].title,
      ings: originState.list[idx].ings,
    }
    this.setState(
      update(this.state, {$set: newList}),
      // callback for open this recipe's ingrediants
      () => (
        this.props.updateState(
          update(this.props.state, {list: {[idx]: {showIngs: {$set: true}}}})
        )
      )
    );


    // Close all ings pannel
    const openIngsIdx = originState.list.findIndex((recipe=>(recipe.showIngs)));
    let edit;

    if (openIngsIdx > -1) {
      const closeAllIngs = update(originState, {list: {[openIngsIdx]: {showIngs: {$set: false}}}});
      edit = update(closeAllIngs, {edit: {$set: id}});
    } else {
      edit = update(originState, {edit: {$set: id}});
    }
    // Open edit pannel

    this.props.updateState(edit);

    // console.log(originState);


  }

  recipeToggle(id, idx) {
    // this.props.recipeToggle(id, idx);

    // recipe OPEN -> CLOSE
    if (this.props.state.list[idx].showIngs) {
      this.props.updateState(this.showIngsToggle(this.props.state, idx));
    } else {
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
    const newState = update(state, { list: { $splice: [[ idx, 1 ]] } });
    this.props.updateState(newState);
  }

  // recipeEdit(state, idx) {
    // this.props.updateState(
    //   this.editToggle(state, idx)
    // );
  // }

  callback(param) {
    if (param === 'close') {
      this.props.updateState(update(this.props.state, {edit: {$set: null}}));
    }

    // else param === index
    else if (param === 'open') {

    }


  }

  handleSubmit(id, e) {
    e.preventDefault();
    // console.log(this.state);

    // find index of this in list array
    const idx = this.props.state.list.findIndex((obj) => (obj.id === id));

    // Convert this.state.ings as comma(,) separated array
    const items = this.state.ings
      .toString()
      .split(',')
      .map((item) => (item.replace(/^ */, '')))
      .filter((item) => (item.length > 0));

    // Pass to updateState
    // step1. update title
    const editRecipe = {
      id: id,
      title: this.state.title || 'untitled',
      ings: items.length > 0 ? items : ['blank'],
      showIngs: true,
    }

    // step2. update List
    // change existing list
    if (this.state.title.length + this.state.ings.length > 0) {
      this.props.updateState(
        update(
          this.props.state, {list: {[idx]: {$set: editRecipe}}}
        ),
        // callback
        this.callback.bind(this, 'close')
      )
    }

  }

  handleThisState(param, e) {

    if (param === 'title') {

      this.setState(update(this.state, {title: {$set: e.target.value}}))

    } else if (param === 'ings') {
      this.setState(update(this.state, {ings: {$set: e.target.value}}))

    }
  }

  handleCancel(e) {
    e.preventDefault();

    const emptyState = {
      title: '',
      ings: []
    }
    // empty this.state
    this.setState(update(this.state, {$set: emptyState}));

    // close edit pannel
    this.props.updateState(update(this.props.state, {edit: {$set: null}}))
    return;
  }

  render() {
    return (
      <div className="list">
        {this.props.state.list.map((el, idx)=>
          (
            <div className="recipe" key={idx}>

              <div className="recipe-title">
                <h2 onClick={this.recipeToggle.bind(this, el.id, idx)}>{el.title}</h2>
                <h3 onClick={this.editToggle.bind(this, this.props.state, el.id, idx)}>edit</h3>
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
                : ""
              }

              {/* click edit -> open input pannel */}
              {el.id === this.props.state.edit ?
                <div className="recipe-edit">

                  <form onSubmit={this.handleSubmit.bind(this, el.id)}>

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

                    <button type="submit">Ok</button>
                    <button onClick={this.handleCancel.bind(this)}>Cancel</button>

                  </form>
                </div>
                : ""
              }
            </div>
          )
        )}

      </div>
    );
  }
}