// Used to add/edit a plant to/in the user's collection
// Url Create: /plant
// Url Update: /plant/<slug>/<plant-id>

import _ from 'lodash';
import {makeSlug} from '../../libs/utils';
import validators from '../../models';
import * as actions from '../../actions';
import Divider from 'material-ui/Divider';
import InputCombo from '../InputCombo';
import Paper from 'material-ui/Paper';
import CancelSaveButtons from './CancelSaveButtons';
import React from 'react';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import * as utils from '../../libs/utils';

const validate = validators.plant;

export default class PlantCreateUpdate extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentWillMount() {
    const pageTitle = this.props.plant.mode === 'edit'
      ? `Edit ${this.props.plant.title}`
      : 'Add New Plant';
    this.setState({
      title: '',
      botanicalName: '',
      commonName: '',
      description: '',
      purchasedDate: '',
      plantedDate: '',
      price: '',
      errors: {},
      ...this.props.plant,
      pageTitle
    });
  }

  cancel() {
    if(this.props.plant.mode === 'edit') {
      this.props.dispatch(actions.setPlantMode({
        _id: this.props.plant._id,
        mode: 'read'
      }));
    } else {
      // Transition to /plants/:slug/:id
      const plantUrl = utils.makePlantsUrl(this.props.user);
      this.context.router.push(plantUrl);
    }
  }

  save(e) {
    const isNew = this.props.plant.mode === 'create';
    validate(this.state, {isNew}, (err, transformed) => {
      if(err) {
        this.setState({errors: err});
      } else {
        if(isNew) {
          this.props.dispatch(actions.createPlantRequest(transformed));
        } else {
          this.props.dispatch(actions.updatePlantRequest(transformed));
        }
        this.context.router.push(`/plant/${makeSlug(transformed.title)}/${transformed._id}`);
      }
    });
    e.preventDefault();
    e.stopPropagation();
  }

  handleChange(propName, e) {
    var change = {
      [propName]: e.target.value
    };
    this.setState(change);
  }

  render() {
    const {
      title,
      botanicalName,
      commonName,
      description,
      purchasedDate,
      plantedDate,
      price,
      errors = {},
      pageTitle
    } = this.state || {};

    const paperStyle = {
      padding: 20,
      width: '100%',
      margin: 20,
      textAlign: 'center',
      display: 'inline-block',
    };

    const underlineStyle = {
      display: 'none',
    };

    const textFieldStyle = {
      marginLeft: 20
    };

    const textAreaStyle = {
      ...textFieldStyle,
      textAlign: 'left'
    };

    const dateFormat = 'MM/DD/YYYY';

    return (
      <Paper style={paperStyle} zDepth={1}>
        <h2 style={{textAlign: 'center'}}>{pageTitle}</h2>

        <InputCombo
          error={errors.title}
          label='Title'
          value={title}
          placeholder={'How do you refer to this plant? (e.g. Washington Navel)'}
          changeHandler={this.handleChange.bind(this, 'title')}
        />
        <Divider />

        <InputCombo
          error={errors.botanicalName}
          label='Botanical Name'
          value={botanicalName}
          extraClasses='col-sm-6'
          placeholder={'e.g. Citrus sinensis \'Washington Navel\''}
          changeHandler={this.handleChange.bind(this, 'botanicalName')}
        />
        <Divider />

        <InputCombo
          error={errors.commonName}
          label='Common Name'
          extraClasses='col-sm-6'
          value={commonName}
          placeholder={'e.g. Washington Navel Orange'}
          changeHandler={this.handleChange.bind(this, 'commonName')}
        />
        <Divider />

        <TextField
          errorText={errors.description}
          floatingLabelText='Description'
          fullWidth={true}
          hintText={'Describe this plant and/or the location in your yard'}
          multiLine={true}
          onChange={this.handleChange.bind(this, 'description')}
          style={textAreaStyle}
          underlineStyle={underlineStyle}
          value={description}
        />
        <Divider />

        <InputCombo
          error={errors.purchasedDate}
          extraClasses='col-sm-4'
          label='Purchase Date'
          value={purchasedDate}
          value={purchasedDate && moment.isMoment(purchasedDate) ? purchasedDate.format(dateFormat) : purchasedDate}
          placeholder={dateFormat}
          changeHandler={this.handleChange.bind(this, 'purchasedDate')}
        />
        <Divider />

        <InputCombo
          error={errors.plantedDate}
          extraClasses='col-sm-4'
          label='Planted Date'
          value={plantedDate && moment.isMoment(plantedDate) ? plantedDate.format(dateFormat) : plantedDate}
          placeholder={dateFormat}
          changeHandler={this.handleChange.bind(this, 'plantedDate')}
        />
        <Divider />

        <InputCombo
          error={errors.price}
          extraClasses='col-sm-4'
          label='Price'
          value={price}
          placeholder={'$9.99'}
          changeHandler={this.handleChange.bind(this, 'price')}
        />
        <Divider />

        {!_.isEmpty(errors) &&
          <div>
            <p className='text-danger col-xs-12'>{'There were errors. Please check your input.'}</p>
            <Divider />
          </div>
        }

        <CancelSaveButtons
          clickSave={this.save.bind(this)}
          clickCancel={this.cancel.bind(this)}
          showButtons={true}
        />

      </Paper>
    );
  }
};

PlantCreateUpdate.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  mode: React.PropTypes.string.isRequired,
  plant: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};
