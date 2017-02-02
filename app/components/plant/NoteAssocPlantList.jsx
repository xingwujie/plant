// When showing a Note this component lists the associated plants.

const React = require('react');

class NoteAssocPlantList extends React.Component {
  constructor() {
    super();
    this.maxItems = 3;
  }

  getTitles(associatePlantIds, plants) {
    return associatePlantIds.take(this.maxItems).reduce((acc, plantId) => {
      const plant = plants.get(plantId);
      if(plant) {
        acc.push(plant.get('title', ''));
      }
      return acc;
    }, []);
  }

  render() {
    const {
      associatedPlantIds,
      currentPlantId,
      plants
    } = this.props;

    const filteredIds = associatedPlantIds.filter(plantId => plantId !== currentPlantId);
    if(!filteredIds.size) {
      return null;
    }

    const associatedPlants = this.getTitles(filteredIds, plants, true);

    const numberNotListed = filteredIds.size - associatedPlants.length;

    const text = `This note also applies to ${associatedPlants.join(', ')}
${numberNotListed > 0 ? ` and ${numberNotListed} other plant(s)` : ''}`;

    const style = {
      textAlign: 'left',
      fontSize: 'smaller',
    };

    return (
      <div style={style}>
        {text}
      </div>
    );
  }
}

NoteAssocPlantList.propTypes = {
  associatedPlantIds: React.PropTypes.object.isRequired, // Immutable.js List
  currentPlantId: React.PropTypes.string.isRequired,
  plants: React.PropTypes.object.isRequired, // Immutable.js Map
};

module.exports = NoteAssocPlantList;
