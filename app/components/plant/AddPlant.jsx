import _ from 'lodash';
import Base from '../Base';
import DatePicker from 'react-day-picker';
import PlantActions from '../../actions/PlantActions';
import React from 'react';

export default class ManagePlant extends React.Component {

  componentDidMount() {
    this.save = this.save.bind(this);
  }

  save(e) {
    if(this.state.title) {
      var plant = _.pick(this.state,
        ['title', 'cultivar', 'description', 'purchasedDate', 'plantedDate', 'price']
      );
      PlantActions.create(plant);
    } else {
      alert('Must have Title');
      // NotifierActions.error({
      //   title: 'Missing Title',
      //   message: 'You must have a value for the Title at a minimum.'
      // });
    }
    e.preventDefault();
    e.stopPropagation();
    // TODO: Open Plant page and allow for adding of a note.
  }

  handleChange(propName, e) {
    // List check box names in here.
    const checkBoxes = [];
    var change = {
      [propName]: _.contains(checkBoxes, propName) ? e.target.checked : e.target.value
    };
    this.setState(change);
  }

  render() {
    var {
      title,
      cultivar,
      description,
      purchasedDate,
      plantedDate,
      price
    } = this.state || {};

    return (
      <Base>
        <h2>Add Plant</h2>
          <form className='editor'>

            <div className='form-group'>
              <label>Title:</label>
              <input autoFocus className='form-control'
                type='text' value={title}
                placeholder='How do you refer to this plant?'
                onChange={this.handleChange.bind(this, 'title')} />
            </div>

            <div className='form-group'>
              <label>Cultivar:</label>
              <input className='form-control'
                type='text' value={cultivar}
                placeholder='Cultivar or variety or general name'
                onChange={this.handleChange.bind(this, 'cultivar')} />
            </div>

            <div className='form-group'>
              <label>Description:</label>
              <input className='form-control'
                type='textarea' value={description}
                placeholder='Describe this plant and/or the location in your yard'
                onChange={this.handleChange.bind(this, 'description')} />
            </div>

            <div className='form-group'>
              <label>Purchase Date:</label>
              <input className='form-control'
                type='textarea' value={purchasedDate}
                placeholder={new Date()}
                onChange={this.handleChange.bind(this, 'purchasedDate')} />
            </div>

            <div className='form-group'>
              <label>Planted Date:</label>
              <input className='form-control'
                type='textarea' value={plantedDate}
                placeholder={new Date()}
                onChange={this.handleChange.bind(this, 'plantedDate')} />
            </div>

            <div className='form-group'>
              <label>Price:</label>
              <input className='form-control'
                type='text' value={price}
                placeholder='$XX.xx'
                onChange={this.handleChange.bind(this, 'price')} />
            </div>

            <button type='button' onClick={this.save}>Save</button>

          </form>
      </Base>
    );
  }
}
