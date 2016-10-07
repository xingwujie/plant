
const actions = require('../../actions');
const React = require('react');
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const RaisedButton = require('material-ui/RaisedButton').default;
const ArrowLeft = require('material-ui/svg-icons/hardware/keyboard-arrow-left').default;
const ArrowRight = require('material-ui/svg-icons/hardware/keyboard-arrow-right').default;

class NoteAssocPlant extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    };
    this.toggle = this.toggle.bind(this);
    this.expand = this.expand.bind(this);
  }

  toggle(plantId) {
    const plantIds = this.props.plantIds.indexOf(plantId) >= 0
      ? this.props.plantIds.filter(pId => pId !== plantId)
      : this.props.plantIds.concat(plantId);

    this.props.dispatch(actions.editNoteChange({plantIds}));
  }

  expand() {
    const expanded = !this.state.expanded;
    this.setState({expanded});
  }

  render() {
    const {expanded} = this.state;
    const {plantIds, plants} = this.props;

    const checkedPlants = plantIds.map(plantId => {
      const plant = plants.get(plantId);
      if(!plant) {
        console.warn(`Missing plant for plantId ${plantId}`);
        return null;
      }

      return <RaisedButton
        key={plantId}
        label={plant.get('title')}
        primary={true}
      />;
    });

    const uncheckedPlants = expanded
      ? plants.reduce((acc, plant) => {
        if(plantIds.indexOf(plant.get('_id') >= 0)) {
          acc.push(<RaisedButton
            key={plant.get('_id')}
            label={plant.get('title')}
          />);
          return acc;
        }
      }, [])
      : null;

    const arrow = <FloatingActionButton
      onClick={this.expand}
      secondary={true}
      title='Expand/Collapse Unchecked Plants'
    >
      {expanded
        ? <ArrowLeft />
        : <ArrowRight />
      }
    </FloatingActionButton>;


    return (
      <div>
        {'Associated plants:'}
        {checkedPlants}
        {uncheckedPlants}
        {arrow}
      </div>
    );
  }
}

NoteAssocPlant.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  plantIds: React.PropTypes.array.isRequired,
  plants: React.PropTypes.object.isRequired, // Immutable.js Map
};

module.exports = NoteAssocPlant;
