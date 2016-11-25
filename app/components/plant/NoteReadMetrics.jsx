const React = require('react');
const utils = require('../../libs/utils');
// const Immutable = require('immutable');

class NoteReadMetrics extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const mets = this.props.note.get('metrics');
    if(!mets) {
      return null;
    }

    const metrics = mets.toJS();

    const renderedMetrics = utils.metaMetrics.toJS().map(metaMetric => {
      if(!metrics[metaMetric.key]) {
        return null;
      }
      return (
        <li key={metaMetric.key}>
          {`${metaMetric.label}: ${metrics[metaMetric.key]}`}
        </li>
      );
    });

    return (
      <div>
        <h5>{'Metrics:'}</h5>
        <ul>
          {renderedMetrics}
        </ul>
      </div>
    );
  }

}

NoteReadMetrics.propTypes = {
  note: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
    toJS: React.PropTypes.func.isRequired,
  }).isRequired,
};

module.exports = NoteReadMetrics;
