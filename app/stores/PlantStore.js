import _ from 'lodash';
import alt from '../libs/alt';
import PlantActions from '../actions/PlantActions';

class PlantStore {
  constructor() {
    // PlantStore keeps an array of Plant objects
    // that belong to the user.
    this.plants = [];

    this.bindListeners({
      create: PlantActions.CREATE,
      createSuccess: PlantActions.CREATE_SUCCESS,
      createError: PlantActions.CREATE_ERROR,
      load: PlantActions.LOAD,
      loadSuccess: PlantActions.LOAD_SUCCESS,
      loadError: PlantActions.LOAD_ERROR,
      addNote: PlantActions.ADD_NOTE
    });

    this.exportPublicMethods({
      create: this.create,
      addNote: this.addNote,
      load: this.load
    });
  }

  create(plant) {
    this.plants.push[plant];
  }

  createSuccess(plant) {
    this.plants.push[plant];
  }

  createError(plant) {
    this.plants.push[plant];
  }

  load() {
    this.loading = true;
  }

  loadSuccess(payload) {
    this.loading = false;
    this.error = null;
    this.plants = payload.plants.reduce(function(acc, plant) {
      var clientId = _.uniqueId();
      acc[clientId] = {id: clientId, plant: plant, status: 'OK'};
      return acc;
    }, {});
  }

  loadError(error) {
    this.loading = false;
    this.error = error;
    this.plants = [];
  }

  addNote(note) {

    const plant = _.find(this.plants, (item) => {
      return item.id === note.plantId;
    });

    if(plant) {
      plant.notes = plant.notes || [];
      plant.notes.push[note];
    }

  }

}

export default alt.createStore(PlantStore, 'PlantStore');
