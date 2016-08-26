// Used to show a list of plants for a user.
// Url: /plants/<optional-user-id>

import {Link} from 'react-router';
import Base from '../Base';
// import PlantActions from '../../actions/PlantActions';
import PlantItem from './PlantItem';
// import PlantStore from '../../stores/PlantStore';
import React from 'react';
import store from '../../store';
import {GridList} from 'material-ui/GridList';
import {isLoggedIn} from '../../libs/auth-helper';
import * as actions from '../../actions';

export default class Plants extends React.Component {

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = store.getState();

    const {
      user = {},
      plants = []
    } = this.state || {};
    if(plants.length === 0 && isLoggedIn()) {
      store.dispatch(actions.loadPlants(user._id));
    }
  }

  componentWillMount() {
    const state = store.getState();
    this.setState(state);
    this.unsubscribe = store.subscribe(this.onChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange() {
    const state = store.getState();
    this.setState(state);
  }

  renderNoPlants(user) {
    return (
      <Base>
        <div>
          <h2 style={{textAlign: 'center'}}>{user.name} Plant List</h2>
          <div className='plant-item-list'>
              <div className='addFirstClassBtn'>
                <Link className='btn btn-primary' to='/plant'>Add your first plant</Link>
              </div>
          </div>
        </div>
      </Base>
    );
  }

  render() {
    var {
      user = {},
      plants = []
    } = this.state || {};

    if(!plants.length) {
      return this.renderNoPlants(user);
    }

    const tileElements = plants.map(plant => <PlantItem
        key={plant._id}
        {...plant}
        name={user.name}
      />
    );

    const gridListStyle = {overflowY: 'auto', marginBottom: 24};

    return (
      <Base>
        <div>
          <h2 style={{textAlign: 'center'}}>{user.name} Plant List ({plants.length})</h2>

          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
            <GridList
              cellHeight={200}
              cellWidth={200}
              style={gridListStyle}
              >
              {tileElements}
            </GridList>
          </div>

        </div>
      </Base>
    );
  }
}
