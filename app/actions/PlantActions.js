import $ from 'jquery';
import alt from '../libs/alt';

class PlantActions {
  create(plant) {
    console.log('PlantAction.create:', plant);
    $.ajax({
      type: 'POST',
      url: '/api/plant/create',
      data: plant,
      success: (createPlant) => {
        this.dispatch(createPlant);
      }
    });
  }

}

export default alt.createActions(PlantActions);
