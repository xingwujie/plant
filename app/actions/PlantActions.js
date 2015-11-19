import _ from 'lodash';
import $ from 'jquery';
import alt from '../libs/alt';
import LoginStore from '../stores/LoginStore';

function setJwtHeader(request) {
  const loginState = LoginStore.getState() || {};
  const jwt = _.get(loginState, 'user.jwt', '');
  if(jwt) {
    request.setRequestHeader('Authorization', 'Bearer ' + jwt);
  }
}

class PlantActions {

  // Success: Function( Anything data, String textStatus, jqXHR jqXHR )
  createSuccess(createdPlant) {
    console.log('PlantAction.createSuccess _id:', createdPlant._id);
    this.dispatch(createdPlant);
  }

  // Error: Function( jqXHR jqXHR, String textStatus, String errorThrown )
  createError(jqXHR, textStatus, errorThrown) {
    console.log('PlantAction.createError:', errorThrown);
    this.dispatch(errorThrown);
  }

  create(plant) {
    console.log('PlantAction.create:', plant);
    $.ajax({
      type: 'POST',
      url: '/api/plant',
      data: plant,
      beforeSend: setJwtHeader,
      success: this.createSuccess,
      error: this.createError
    });
  }

  // Get all the plants a user has created
  load(userId) {
    console.log('PlantAction.load');
    this.dispatch();
    $.ajax({
      type: 'GET',
      url: `/api/plants/${userId}`,
      beforeSend: setJwtHeader,
      success: this.loadSuccess,
      error: this.loadError
    });
  }

  // Success: Function( Anything data, String textStatus, jqXHR jqXHR )
  loadSuccess(payload) {
    console.log('PlantAction.loadSuccess:', payload);
    this.dispatch(payload);
  }

  // Error: Function( jqXHR jqXHR, String textStatus, String errorThrown )
  loadError(jqXHR, textStatus, errorThrown) {
    console.log('PlantAction.loadError:', errorThrown);
    this.dispatch(errorThrown);
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
