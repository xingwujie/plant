import alt from '../libs/alt';
import PlantActions from '../actions/PlantActions';

class PlantStore {
  constructor() {
    this.bindActions(PlantActions);

  }
  update(input) {
    const inputs = this.inputs;
    inputs[input.key] = input.value;
    this.setState({inputs});
  }
}

export default alt.createStore(PlantStore, 'PlantStore');
