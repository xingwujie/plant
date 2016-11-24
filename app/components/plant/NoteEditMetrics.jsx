const React = require('react');
const InputCombo = require('../InputCombo');
const Errors = require('../Errors');

class NoteEditMetrics extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    console.log('onChange:', e.target.name);
    // this.props.dispatch(actions.editNoteChange({plantIds}));
  }

  render() {
    const {metrics} = this.props;

    const mets = metrics.map(metric =>
      <InputCombo
        changeHandler={this.onChange}
        label={metric.label}
        name={metric.name}
        placeholder={metric.placeholder}
        value={metric.value}
      />
    );

    return (
      <div style={{textAlign: 'left'}}>
        <Errors errors={this.props.error} />
        <div>{'Associated plants:'}</div>
        <div>{mets}</div>
      </div>
    );
  }
}

NoteEditMetrics.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  error: React.PropTypes.string,
  metrics: React.PropTypes.array.isRequired,
};

module.exports = NoteEditMetrics;
