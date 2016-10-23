// Used to show a list of plants for a user.
// Url: /plants/<optional-user-id>

const Base = require('../Base');
const React = require('react');
const store = require('../../store');
const actions = require('../../actions');
const gis = require('../../libs/gis');
const Immutable = require('immutable');
// const {Layer, Rect, Stage, Group} = require('react-konva');
const {Layer, Rect, Stage} = require('react-konva');

class LayoutMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      color: 'green'
    };
    this.handleClick = this.handleClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      users: store.getState('users'),
      plants: store.getState('plants'),
    };

    if(props.params && props.params.id) {
      const {id: userId} = props.params;
      const user = store.getState().getIn(['users', userId], Immutable.Map());
      // This is the user id for this page.
      if(!user.has('plantIds')) {
        store.dispatch(actions.loadPlantsRequest(userId));
      }
    }
  }

  componentWillMount() {
    const state = {
      users: store.getState('users'),
      plants: store.getState('plants'),
    };
    this.setState(state);
    this.unsubscribe = store.subscribe(this.onChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange() {
    const state = {
      users: store.getState('users'),
      plants: store.getState('plants'),
    };
    this.setState(state);
  }

  renderTitle() {
    const {id: userId} = (this.props || {}).params || {};
    const userName = store.getState().getIn(['users', userId, 'name']);
    return (
      <h2 style={{textAlign: 'center'}}>{`${userName} Layout Map`}</h2>
    );
  }

  handleClick() {
    this.setState({
      color: 'orange'
    });
  }

  renderPlantLocation(plant) {
    return (
      <Rect
        x={plant.x} y={plant.y} width={10} height={10}
        fill={this.state.color}
        shadowBlur={10}
        onClick={this.handleClick}
      />
    );
  }

  renderPlantLocations(width) {
    if(width < 30) {
      console.error('Width is less than 30');
      return null;
    }

    if(this.props.params && this.props.params.id) {
      const {id: userId} = this.props.params;
      const user = store.getState().getIn(['users', userId], Immutable.Map());
      if(!user.size) {
        return null;
      }

      const plants = store.getState().get('plants', Immutable.Set());
      const userPlants = plants.filter(plant => plant.get('userId') === userId && plant.has('loc'));
      if(!userPlants || !userPlants.size) {
        return null;
      }

      const scaledPlants = gis.scaleToCanvas(userPlants, width);
      return {
        canvasHeight: scaledPlants.canvasHeight,
        plants: scaledPlants.plant.map(this.renderPlantLocation)
      };
    } else {
      return null;
    }

  }

  render () {
    const canvasWidth = 700;
    const plants = this.renderPlantLocations(canvasWidth);

    return (
      <Base>
        <div>
          {this.renderTitle()}
          <div>{'Some text'}</div>
          {!!plants &&
            <Stage width={canvasWidth} height={plants.canvasHeight}>
              <Layer>
                {plants.plants}
              </Layer>
            </Stage>
          }
        </div>
      </Base>
    );
  }
}

LayoutMap.propTypes = {
  params:  React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired,
  }).isRequired,
};

module.exports = LayoutMap;
