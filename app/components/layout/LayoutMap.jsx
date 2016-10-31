// Used to show a list of plants for a user.
// Url: /plants/<optional-user-id>

const Base = require('../Base');
const React = require('react');
const store = require('../../store');
const actions = require('../../actions');
const gis = require('../../libs/gis');
const Immutable = require('immutable');
// const {Layer, Rect, Stage, Group} = require('react-konva');
const {Layer, Text: KonvaText, Circle, Stage, Group} = require('react-konva');

class LayoutMap extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      color: 'green',
      plants: store.getState('plants'),
      users: store.getState('users'),
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
    /*
    var circle = new Konva.Circle({
      x: stage.getWidth() / 2,
      y: stage.getHeight() / 2,
      radius: 70,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4
    });

    var rect = new Konva.Rect({
      x: 50,
      y: 50,
      width: 100,
      height: 50,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4
    });
    var simpleText = new Konva.Text({
      x: stage.getWidth() / 2,
      y: 15,
      text: 'Simple Text',
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: 'green'
    });
     */
    /*
        */
    return (
      <Group key={plant._id}>
        <KonvaText
          x={plant.x - 10}
          y={plant.y}
          text={plant.title}
          fontSize={10}
          fontFamily='Calibri'
          fill='red'
        />
        <Circle
          fill={this.state.color}
          onClick={this.handleClick}
          radius={5}
          shadowBlur={10}
          x={plant.x}
          y={plant.y}
        />
      </Group>
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
        plants: scaledPlants.plants.map(this.renderPlantLocation.bind(this))
      };
    } else {
      return null;
    }

  }

  render () {
    const canvasWidth = 1000;
    const plantLocations = this.renderPlantLocations(canvasWidth);

    return (
      <Base>
        <div>
          {this.renderTitle()}
          {plantLocations
            ? <Stage width={canvasWidth} height={plantLocations.canvasHeight}>
              <Layer>
                {plantLocations.plants.valueSeq().toJS()}
              </Layer>
            </Stage>
            : <div>{'No plants have been mapped.'}</div>
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
