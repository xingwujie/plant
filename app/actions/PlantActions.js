import $ from 'jquery';
import alt from '../libs/alt';

class PlantActions {
  create(plant, cb) {
    console.log('PlantAction.create:', plant);
    $.ajax({
      type: 'POST',
      url: '/api/plant/create',
      data: plant,
      success: (createdPlant) => {
        this.dispatch(createdPlant);
        // TODO: Remove this and replace with a PlantStore listener in the AddPlant.jsx file
        cb(null, createdPlant);
      }
    });
  }

  addNote(note) {
    console.log('PlantAction.addNote:', note);
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
