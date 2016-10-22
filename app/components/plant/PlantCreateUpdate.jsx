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
const utils = require('../../libs/utils');
const Immutable = require('immutable');
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const MapsAddLocation = require('material-ui/svg-icons/maps/add-location').default;

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
    this.addGeo = this.addGeo.bind(this);
  }

  addGeo() {
    if(utils.hasGeo()) {
      utils.getGeo({}, (err, geoJson) => {
        if(err) {
          console.error(err);
        } else {
          this.props.dispatch(actions.editPlantChange({
            loc: Immutable.fromJS(geoJson)
          }));
        }
      });
    } else {
      console.error('No geo service found on device');
    }
  }

  cancel() {
    this.props.dispatch(actions.editPlantClose());
  }

  componentWillUnmount() {
    this.props.dispatch(actions.editPlantClose());
  }

  componentWillMount() {
    const {interimPlant} = this.props;
    const pageTitle = interimPlant.get('isNew')
      ? 'Add New Plant'
      : `Edit ${interimPlant.get('title')}`;
    this.setState({pageTitle});
  }

  onChange(e) {
    this.props.dispatch(actions.editPlantChange({
      [e.target.name]: e.target.value
    }));
  }

  save(e) {
    const plant = this.props.interimPlant.toJS();
    const {isNew = false} = plant;
    if(plant.purchasedDate) {
      plant.purchasedDate = utils.dateToInt(plant.purchasedDate);
    }
    if(plant.plantedDate) {
      plant.plantedDate = utils.dateToInt(plant.plantedDate);
    }

    plant.userId = this.props.user.get('_id');

    validate(plant, {isNew}, (errors, transformed) => {
      if(errors) {
        console.warn('Validation errors:', errors);
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
    const { interimPlant } = this.props;
    const title = interimPlant.get('title', '');
    const botanicalName = interimPlant.get('botanicalName', '');
    const commonName = interimPlant.get('commonName', '');
    const description = interimPlant.get('description', '');
    const purchasedDate = interimPlant.get('purchasedDate', '');
    const plantedDate = interimPlant.get('plantedDate', '');
    const price = interimPlant.get('price', '');
    const errors = interimPlant.get('errors', Immutable.Map()).toJS();

    const geoPosDisplay = interimPlant.has('loc')
      ? `${interimPlant.getIn(['loc', 'coordinates', '0'])} / ${interimPlant.getIn(['loc', 'coordinates', '1'])}`
      : '-- / --';

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

    const textAreaStyle = {
      textAlign: 'left'
    };

    const dateFormat = 'MM/DD/YYYY';
    const hasGeo = utils.hasGeo();

    return (
      <Paper style={paperStyle} zDepth={1}>
        <h2 style={{textAlign: 'center'}}>{pageTitle}</h2>

        <InputCombo
          changeHandler={this.onChange}
          error={errors.title}
          label='Title'
          name='title'
          placeholder={'How do you refer to this plant? (e.g. Washington Navel)'}
          value={title}
        />
        <Divider />

        <InputCombo
          changeHandler={this.onChange}
          error={errors.botanicalName}
          extraClasses='col-sm-6'
          label='Botanical Name'
          name='botanicalName'
          placeholder={'e.g. Citrus sinensis \'Washington Navel\''}
          value={botanicalName}
        />
        <Divider />

        <InputCombo
          changeHandler={this.onChange}
          error={errors.commonName}
          extraClasses='col-sm-6'
          label='Common Name'
          name='commonName'
          placeholder={'e.g. Washington Navel Orange'}
          value={commonName}
        />
        <Divider />

        <InputCombo
          changeHandler={this.onChange}
          error={errors.description}
          label='Description'
          multiLine={true}
          name='description'
          placeholder={'Describe this plant and/or the location in your yard'}
          style={textAreaStyle}
          value={description}
        />
        <Divider />

        <InputCombo
          changeHandler={this.onChange}
          error={errors.purchasedDate}
          extraClasses='col-sm-4'
          label='Acquire Date'
          name='purchasedDate'
          placeholder={dateFormat}
          value={purchasedDate}
        />
        <Divider />

        <InputCombo
          changeHandler={this.onChange}
          error={errors.plantedDate}
          extraClasses='col-sm-4'
          label='Planted Date'
          name='plantedDate'
          placeholder={dateFormat}
          value={plantedDate}
        />
        <Divider />

        <InputCombo
          changeHandler={this.onChange}
          error={errors.price}
          extraClasses='col-sm-4'
          label='Price'
          name='price'
          placeholder={'$9.99'}
          type='number'
          value={price}
        />
        <Divider />

        {hasGeo &&
          <div>
            <FloatingActionButton
              onClick={this.addGeo}
              title='Add Location'
            >
              <MapsAddLocation />
            </FloatingActionButton>
            <InputCombo
              changeHandler={this.onChange}
              disabled={true}
              error={errors.geoPosition}
              extraClasses='col-sm-4'
              label='Geo Position'
              name='geoPosition'
              placeholder={'Location of this plant'}
              value={geoPosDisplay}
            />
            <Divider />
          </div>
        }

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
  interimPlant: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
    toJS: React.PropTypes.func.isRequired,
  }).isRequired,
  user: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
  }).isRequired
};

module.exports = PlantCreateUpdate;
