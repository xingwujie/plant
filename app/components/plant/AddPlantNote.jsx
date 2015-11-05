import _ from 'lodash';
import PlantActions from '../../actions/PlantActions';
import React from 'react';

export default class AddPlantNote extends React.Component {

  componentDidMount() {
    this.state = {};
  }

  save(e) {
    // TODO: This validation needs to be isomorphic and called client and server:
    if(this.state.date && (this.state.description || this.state.height || this.state.width)) {
      const note = _.pick(this.state,
        ['date', 'description', 'height', 'width']
      );

      PlantActions.addNote(note, (err) => {
        if(!err) {
          alert('Note saved');
        } else {
          alert('Error: ' + err.message);
        }
      });
    } else {
      alert('Must have Date and one of Note/Height/Width');
      // NotifierActions.error({
      //   title: 'Missing Title',
      //   message: 'You must have a value for the Title at a minimum.'
      // });
    }
    e.preventDefault();
    e.stopPropagation();
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
    // const plantId = _.get(this, 'props.params.id', '');

    const {
      date,
      description,
      height,
      width
    } = this.state || {};

    const plant = _.get(this, 'props.plant', {});

    return (
      <div>
        <h2>Add Notes</h2>
        <div>Plant: {plant.title}</div>
        {plant.description && <div>Description: {plant.description}</div>}
          <form className='editor'>

            <div className='form-group'>
              <label>Date:</label>
              <input className='form-control'
                type='textarea' value={date}
                placeholder='MM/DD/YYYY'
                onChange={this.handleChange.bind(this, 'date')} />
            </div>

            <div className='form-group'>
              <label>Note:</label>
              <textarea className='form-control'
                rows='3' value={description}
                placeholder='Add a note about this plant...'
                onChange={this.handleChange.bind(this, 'description')} />
            </div>

            <div className='form-group'>
              <label>Height:</label>
              <input autoFocus className='form-control'
                type='text' value={height}
                placeholder='e.g. 3 or 5.5 (in feet or fractions of feet)'
                onChange={this.handleChange.bind(this, 'height')} />
            </div>

            <div className='form-group'>
              <label>Width:</label>
              <input autoFocus className='form-control'
                type='text' value={width}
                placeholder='e.g. 3 or 5.5 (in feet or fractions of feet)'
                onChange={this.handleChange.bind(this, 'width')} />
            </div>

            <button type='button' onClick={this.save.bind(this)}>Save</button>

          </form>
      </div>
    );
  }
}
