const React = require('react');
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const AddIcon = require('material-ui/svg-icons/content/add').default;
const {Link} = require('react-router');

class AddLocationButton extends React.Component {

  render() {
    const {
      mini = false,
      show,
      style = {}
    } = this.props;

    if(!show) {
      return null;
    }

    return (
      <Link to={'/location'}>
        <FloatingActionButton
          title='Add Location' mini={mini} style={style}
        >
          <AddIcon />
        </FloatingActionButton>
      </Link>
    );

  }
}

AddLocationButton.propTypes = {
  mini: React.PropTypes.bool,
  show: React.PropTypes.bool.isRequired,
  style: React.PropTypes.object,
};

module.exports = AddLocationButton;
