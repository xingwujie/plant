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
      loadOne: PlantActions.LOAD_ONE,
      update: PlantActions.UPDATE,
      delete: PlantActions.DELETE,
      addNote: PlantActions.ADD_NOTE
    });

    this.exportPublicMethods({
      create: this.create,
      update: this.update,
      delete: this.delete,
      addNote: this.addNote,
      load: this.load,
      getPlant: this.getPlant
    });
  }

  create(plant) {
    this.plants.push[plant.plant];
  }

  update(updatedPlant) {
    _.remove(this.plants, (plant) => {
      return plant._id === updatedPlant._id;
    });
    this.plants.push[updatedPlant];
  }

  delete(id) {
    _.remove(this.plants, (plant) => {
      return plant._id === id;
    });
  }

  // Accessor - use this.state.plants to reference plants
  getPlant(plantId) {
    const plants = this.state.plants;
    const plant = _.find(plants, (p) => {
      return p._id === plantId;
    });
    return plant;
  }

  // Called in response to the "full" plant request ajax Action with all details
  // being loaded from DB.
  loadOne(plant) {
    const plants = this.plants;
    if(plant && plant._id) {
      // Remove plant from collection if it's already in there
      _.remove(plants, (p) => {
        return p._id === plant._id;
      });
      // Full note so set summary to false
      plant.summary = false;
      plants.push(plant);
    } else {
      console.log('PlantStore.loadOne returning false');
      return false; // prevents emit (I think)
    }
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
        this.plants = result.payload || [];
        this.plants.forEach((plant) => {
          // summary means that the notes and other attributes about the plant haven't been loaded
          plant.summary = true;
          plant.notes = plant.notes || [];
        });
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
