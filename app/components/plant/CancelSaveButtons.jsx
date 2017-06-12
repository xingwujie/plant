const React = require('react');
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const ClearIcon = require('material-ui/svg-icons/content/clear').default;
const DoneIcon = require('material-ui/svg-icons/action/done').default;
const AddPhotoIcon = require('material-ui/svg-icons/image/add-a-photo').default;
const PropTypes = require('prop-types');

class CancelSaveButtons extends React.Component {

  render() {
    const {
      showButtons,
    } = this.props || {};

    if (!showButtons) {
      return null;
    }

    const {
      clickAddPhoto,
    } = this.props;

    return (
      <h2 className="vcenter">
        <div style={{ textAlign: 'right' }}>
          {clickAddPhoto &&
            <FloatingActionButton
              onClick={clickAddPhoto}
              secondary
              title="Upload Photo"
            >
              <AddPhotoIcon />
            </FloatingActionButton>
          }

          <FloatingActionButton
            onClick={this.props.clickCancel}
            secondary
            style={{ marginLeft: '10px' }}
            title="Cancel"
          >
            <ClearIcon />
          </FloatingActionButton>

          <FloatingActionButton
            onClick={this.props.clickSave}
            style={{ marginLeft: '10px' }}
            title="Save"
          >
            <DoneIcon />
          </FloatingActionButton>
        </div>
      </h2>
    );
  }
}

CancelSaveButtons.propTypes = {
  clickAddPhoto: PropTypes.func,
  clickCancel: PropTypes.func.isRequired,
  clickSave: PropTypes.func.isRequired,
  showButtons: PropTypes.bool.isRequired,
};

module.exports = CancelSaveButtons;
