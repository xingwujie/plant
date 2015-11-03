import $ from 'jquery';
import alt from '../libs/alt';
import d from 'debug';

const debug = d('plant:PlantActions');

class PlantActions {
  create(plant, cb) {
    debug('PlantAction.create:', plant);
    $.ajax({
      type: 'POST',
      url: '/api/plant',
      data: plant,
      success: (createdPlant) => {
        this.dispatch(createdPlant);
        // TODO: Remove this and replace with a PlantStore listener in the AddPlant.jsx file
        cb(null, createdPlant);
      }
    });
  }

  // Get all the plants this user has created
  retrieve() {
    debug('PlantAction.retrieve');
    $.ajax({
      type: 'GET',
      url: '/api/plant',
      success: (plants) => {
        this.dispatch(plants);
      }
    });
  }

  addNote(note) {
    debug('PlantAction.addNote:', note);
    $.ajax({
      type: 'POST',
      url: '/api/plant-note',
      data: note,
      success: (createdNote) => {
        this.dispatch(createdNote);
      }
    });
  }

}

export default alt.createActions(PlantActions);
