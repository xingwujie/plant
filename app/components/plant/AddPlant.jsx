import _ from 'lodash';
import AuthRequired from '../auth/AuthRequired';
import Base from '../Base';
import PlantActions from '../../actions/PlantActions';
import React from 'react';

export default AuthRequired(class AddPlant extends React.Component {

  constructor(props, conText) {
    super(props, conText);
    this.context = conText;
  }

  componentDidMount() {
    this.state = {};
  }

  save(e) {
    if(this.state.title) {
      var plant = _.pick(this.state,
        ['title', 'botanicalName', 'commonName', 'description', 'purchasedDate', 'plantedDate', 'price']
      );
      PlantActions.create(plant, (err, savedPlant) => {
        console.log('PlantActions.create cb:', err, savedPlant);
        if(!err) {
          let { history: historyContext } = this.props;
          // TODO: Stick a real slug in here
          const slug = 'slug';
          historyContext.pushState(null, `/plant/${slug}/${savedPlant.id}`);
        } else {
          // TODO: Handle error with notifier
          alert('Error: ' + err.message);
        }
      });
    } else {
      // TODO: Handle error with notifier
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
      botanicalName,
      commonName,
      description,
      purchasedDate,
      plantedDate,
      price
    } = this.state || {};

    return (
      <Base>
        <h2 style={{textAlign: 'center'}}>Add Plant</h2>
          <form className='editor'>

            <div className='form-group title-input-combo col-xs-12'>
              <label>Title:</label>
              <input autoFocus className='form-control'
                type='text' value={title}
                placeholder='How do you refer to this plant? (e.g. Washington Navel)'
                onChange={this.handleChange.bind(this, 'title')} />
            </div>

            <div className='col-xs-12'>
              {'The rest of the fields are optional. You can come back and add them later if you want to start adding notes or other plants now.'}
            </div>

            <div className='form-group title-input-combo col-xs-12 col-sm-6'>
              <label>Botanical Name:</label>
              <input className='form-control'
                type='text' value={botanicalName}
                placeholder={'e.g. Citrus sinensis \'Washington Navel\''}
                onChange={this.handleChange.bind(this, 'botanicalName')} />
            </div>

            <div className='form-group title-input-combo col-xs-12 col-sm-6'>
              <label>Common Name:</label>
              <input className='form-control'
                type='text' value={commonName}
                placeholder='e.g. Washington Navel Orange'
                onChange={this.handleChange.bind(this, 'commonName')} />
            </div>

            <div className='form-group title-input-combo col-xs-12'>
              <label>Description:</label>
              <textarea className='form-control'
                rows='2' value={description}
                placeholder='Describe this plant and/or the location in your yard'
                onChange={this.handleChange.bind(this, 'description')} />
            </div>

            <div className='form-group title-input-combo col-xs-12 col-sm-4'>
              <label>Purchase Date:</label>
              <input className='form-control'
                type='text' value={purchasedDate}
                placeholder='MM/DD/YYYY'
                onChange={this.handleChange.bind(this, 'purchasedDate')} />
            </div>

            <div className='form-group title-input-combo col-xs-12 col-sm-4'>
              <label>Planted Date:</label>
              <input className='form-control'
                type='text' value={plantedDate}
                placeholder='MM/DD/YYYY'
                onChange={this.handleChange.bind(this, 'plantedDate')} />
            </div>

            <div className='form-group title-input-combo col-xs-12 col-sm-4'>
              <label>Price:</label>
              <input className='form-control'
                type='text' value={price}
                placeholder='$XX.xx'
                onChange={this.handleChange.bind(this, 'price')} />
            </div>

            <div className='form-group col-xs-12' style={{textAlign: 'center'}}>
              <button style={{fontSize: 'xx-large'}} className='btn btn-primary' type='button' onClick={this.save.bind(this)}>Save</button>
            </div>

          </form>
      </Base>
    );
  }
});
