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
      load: PlantActions.LOAD,
      addNote: PlantActions.ADD_NOTE
    });

    this.exportPublicMethods({
      create: this.create,
      addNote: this.addNote,
      load: this.load
    });
  }

  create(plant) {
    this.plants.push[plant.plant];
  }

  load(result) {
    if(result.error) {
      this.loading = false;
      this.error = result.error;
      this.plants = [];
    } else {
      if(result.payload) {
        this.loading = false;
        this.error = null;
        this.plants = result.payload;
      } else {
        this.loading = true;
      }
    }
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
