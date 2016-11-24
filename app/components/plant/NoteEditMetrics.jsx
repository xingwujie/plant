const React = require('react');
const InputCombo = require('../InputCombo');
const Errors = require('../Errors');

class NoteEditMetrics extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.renderLength = this.renderLength.bind(this);
    this.renderCount = this.renderCount.bind(this);
    this.renderWeight = this.renderWeight.bind(this);
    this.renderToggle = this.renderToggle.bind(this);

    this.renderMetrics = Object.freeze({
      length: this.renderLength,
      count: this.renderCount,
      weight: this.renderWeight,
      toggle: this.renderToggle,
    });
  }

  onChange(e) {
    console.log('onChange:', e.target.name);
    // this.props.dispatch(actions.editNoteChange({plantIds}));
  }

  renderLength(metric, key) {
    return (<InputCombo
      key={key}
      changeHandler={this.onChange}
      label={metric.label}
      name={key}
      placeholder={metric.placeholder}
      value={metric.value || ''}
    />);
  }

  renderCount(met, key) {
    return this.renderLength(met, key);
  }

  renderWeight(met, key) {
    return this.renderLength(met, key);
  }

  renderToggle(met, key) {
    return this.renderLength(met, key);
  }

  render() {
    const metrics = this.props.metrics.toJS();

    const mets = Object.keys(metrics).map((key) => {
      const metric = metrics[key];
      return this.renderMetrics[metric.type](metric, key);
    });

    return (
      <div style={{textAlign: 'left'}}>
        <Errors errors={this.props.error} />
        <div>{mets}</div>
      </div>
    );
  }
}

NoteEditMetrics.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  error: React.PropTypes.string,
  metrics: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
    toJS: React.PropTypes.func.isRequired,
  }).isRequired,
};

module.exports = NoteEditMetrics;
