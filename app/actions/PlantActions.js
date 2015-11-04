import _ from 'lodash';
import $ from 'jquery';
import alt from '../libs/alt';
import LoginStore from '../stores/LoginStore';

function setJwtHeader(request) {
  const jwt = _.get(LoginStore, 'state.user.jwt', '');
  if(jwt) {
    request.setRequestHeader('Authorization', 'Bearer ' + jwt);
  }
}

class PlantActions {

  create(plant, cb) {
    console.log('PlantAction.create:', plant);
    // console.log('PlantAction.create: this:', Object.keys(this));
    // const _this = this;
    $.ajax({
      type: 'POST',
      url: '/api/plant',
      data: plant,
      beforeSend: setJwtHeader,
      success: (createdPlant) => {
        this.dispatch(createdPlant);
        // TODO: Remove this and replace with a PlantStore listener in the AddPlant.jsx file
        cb(null, createdPlant);
      }
    });
  }

  // Get all the plants this user has created
  retrieve() {
    console.log('PlantAction.retrieve');
    $.ajax({
      type: 'GET',
      url: '/api/plants',
      success: (plants) => {
        this.dispatch(plants);
      }
    });
  }

  addNote(note) {
    console.log('PlantAction.addNote:', note);
    $.ajax({
      type: 'POST',
      url: '/api/plant-note',
      data: note,
      beforeSend: this.setJwtHeader,
      success: (createdNote) => {
        this.dispatch(createdNote);
      }
    });
  }

}

export default alt.createActions(PlantActions);
