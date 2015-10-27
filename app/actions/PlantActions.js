import $ from 'jquery';
import alt from '../libs/alt';

class PlantActions {
  create(plant) {
    $.post({
      url: `/api/plant/create`,
      data: plant,
      success: (createPlant) => {
        this.dispatch(createPlant);
      }
    });
  }

}

export default alt.createActions(PlantActions);
