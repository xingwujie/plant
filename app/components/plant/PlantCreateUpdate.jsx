// Used to add/edit a plant to/in the user's collection
// Url Create: /plant
// Url Update: /plant/<slug>/<plant-id>

const isEmpty = require('lodash/isEmpty');
const {makeSlug} = require('../../libs/utils');
const validators = require('../../models');
const actions = require('../../actions');
const Divider = require('material-ui/Divider').default;
const InputCombo = require('../InputCombo');
const Paper = require('material-ui/Paper').default;
const CancelSaveButtons = require('./CancelSaveButtons');
const React = require('react');
const TextField = require('material-ui/TextField').default;
const utils = require('../../libs/utils');

const cloneDeep = require('lodash/cloneDeep');
const validate = validators.plant;

class PlantCreateUpdate extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.cancel = this.cancel.bind(this);
    this.onChange = this.onChange.bind(this);
    this.save = this.save.bind(this);
  }

  cancel() {
    this.props.dispatch(actions.editPlantClose());
  }

  componentWillMount() {
    const {interimPlant} = this.props;
    const pageTitle = interimPlant._id
      ? `Edit ${interimPlant.title}`
      : 'Add New Plant';
    this.setState({pageTitle});
  }

  onChange(e) {
    this.props.dispatch(actions.editPlantChange({
      [e.target.name]: e.target.value
    }));
  }

  save(e) {
    const {interimPlant} = this.props;
    const isNew = !!interimPlant._id;
    const plant = cloneDeep(interimPlant);
    if(plant.purchasedDate) {
      plant.purchasedDate = utils.dateToInt(plant.purchasedDate);
    }
    if(plant.plantedDate) {
      plant.plantedDate = utils.dateToInt(plant.plantedDate);
    }
    // console.log('PlantCreateUpdate.sve plant:', plant);

    validate(plant, {isNew}, (errors, transformed) => {
      if(errors) {
        this.props.dispatch(actions.editPlantChange({errors}));
      } else {
        if(isNew) {
          this.props.dispatch(actions.createPlantRequest(transformed));
        } else {
          this.props.dispatch(actions.updatePlantRequest(transformed));
        }
        this.props.dispatch(actions.editPlantClose());
        this.context.router.push(`/plant/${makeSlug(transformed.title)}/${transformed._id}`);
      }
    });
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const {
      title = '',
      botanicalName = '',
      commonName = '',
      description = '',
      purchasedDate = '',
      plantedDate = '',
      price = '',
      errors = {}
    } = this.props.interimPlant;

    const {
      pageTitle = ''
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
          name='title'
          changeHandler={this.onChange}
        />
        <Divider />

        <InputCombo
          error={errors.botanicalName}
          label='Botanical Name'
          value={botanicalName}
          extraClasses='col-sm-6'
          placeholder={'e.g. Citrus sinensis \'Washington Navel\''}
          name='botanicalName'
          changeHandler={this.onChange}
        />
        <Divider />

        <InputCombo
          error={errors.commonName}
          label='Common Name'
          extraClasses='col-sm-6'
          value={commonName}
          placeholder={'e.g. Washington Navel Orange'}
          name='commonName'
          changeHandler={this.onChange}
        />
        <Divider />

        <TextField
          errorText={errors.description}
          floatingLabelText='Description'
          fullWidth={true}
          hintText={'Describe this plant and/or the location in your yard'}
          multiLine={true}
          name='description'
          onChange={this.onChange}
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
          placeholder={dateFormat}
          name='purchasedDate'
          changeHandler={this.onChange}
        />
        <Divider />

        <InputCombo
          error={errors.plantedDate}
          extraClasses='col-sm-4'
          label='Planted Date'
          value={plantedDate}
          placeholder={dateFormat}
          name='plantedDate'
          changeHandler={this.onChange}
        />
        <Divider />

        <InputCombo
          error={errors.price}
          extraClasses='col-sm-4'
          label='Price'
          value={price}
          placeholder={'$9.99'}
          name='price'
          changeHandler={this.onChange}
        />
        <Divider />

        {!isEmpty(errors) &&
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
  interimPlant: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};

module.exports = PlantCreateUpdate;
