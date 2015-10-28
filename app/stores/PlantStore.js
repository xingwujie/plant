import _ from 'lodash';
import alt from '../libs/alt';
import PlantActions from '../actions/PlantActions';

class PlantStore {
  constructor() {
    this.plants = [];

    this.bindListeners({
      create: PlantActions.CREATE,
      addNote: PlantActions.ADD_NOTE
    });

    this.exportPublicMethods({
      create: this.create,
      addNote: this.addNote
    });
  }

  create(plant) {
    this.plants.push[plant];
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
