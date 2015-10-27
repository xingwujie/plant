import alt from '../libs/alt';
import PlantActions from '../actions/PlantActions';

class PlantStore {
  constructor() {
    this.plants = [];

    this.bindListeners({
      create: PlantActions.CREATE
    });

    this.exportPublicMethods({
      create: this.create
    });
  }

  create(plant) {
    this.plants.push[plant];
  }

}

export default alt.createStore(PlantStore, 'PlantStore');
