const actions = require('../../actions');
const React = require('react');
const Immutable = require('immutable');
const Toggle = require('material-ui/Toggle').default;
const InputCombo = require('../InputCombo');
const Divider = require('material-ui/Divider').default;
const RadioButton = require('material-ui/RadioButton').RadioButton;
const RadioButtonGroup = require('material-ui/RadioButton').RadioButtonGroup;

class PlantEditTerminated extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    // console.log('onChange', e.target.name, e.target.checked, e.target.value);
    const {name: inputName} = e.target;
    const value = inputName === 'isTerminated' ? e.target.checked : e.target.value;

    this.props.dispatch(actions.editPlantChange({
      [inputName]: value
    }));
  }

  render() {
    const styles = {
      radioGroup: {
        display: 'flex',
      },
      radioButton: {
        marginBottom: 16,
        width: 'inherit',
      },
    };
    const { interimPlant } = this.props;
    const isTerminated = interimPlant.get('isTerminated', false);
    const terminatedDate = interimPlant.get('terminatedDate', '');
    const terminatedReason = interimPlant.get('terminatedReason', 'died');
    const terminatedDescription = interimPlant.get('terminatedDescription', '');

    console.log('terminated render:', {isTerminated, terminatedDate, terminatedReason, terminatedDescription});

    const errors = interimPlant.get('errors', Immutable.Map()).toJS();
    const dateFormat = 'MM/DD/YYYY';

    return (
      <div>
        <Toggle
          defaultToggled={isTerminated}
          label='Terminated'
          labelPosition='left'
          name='isTerminated'
          onToggle={this.onChange}
          style={{paddingLeft: '5px', maxWidth: '150px'}}
        />
        {isTerminated &&
          <div>
            <InputCombo
              changeHandler={this.onChange}
              error={errors.terminatedDate}
              label='Termination Date'
              name='terminatedDate'
              placeholder={dateFormat}
              value={terminatedDate}
            />
            <RadioButtonGroup
              defaultSelected={terminatedReason}
              name='terminatedReason'
              onChange={this.onChange}
              style={styles.radioGroup}
            >
              <RadioButton
                label='Culled'
                style={styles.radioButton}
                value='culled'
              />
              <RadioButton
                label='Died'
                style={styles.radioButton}
                value='died'
              />
              <RadioButton
                label='Transferred'
                style={styles.radioButton}
                value='transferred'
              />
            </RadioButtonGroup>
            <InputCombo
              changeHandler={this.onChange}
              error={errors.terminatedDescription}
              label='Termination Description'
              name='terminatedDescription'
              placeholder={'(Optional) Describe why this plant was terminated.'}
              value={terminatedDescription}
            />

            <Divider />
          </div>
        }
      </div>
    );
  }
};

PlantEditTerminated.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  interimPlant: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
    toJS: React.PropTypes.func.isRequired,
  }).isRequired,
};

module.exports = PlantEditTerminated;
