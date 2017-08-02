const React = require('react');
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const ClearIcon = require('material-ui/svg-icons/content/clear').default;
const DoneIcon = require('material-ui/svg-icons/action/done').default;
const AddPhotoIcon = require('material-ui/svg-icons/image/add-a-photo').default;
const PropTypes = require('prop-types');

function cancelSaveButtons(props = {}) {
  const {
    showButtons,
  } = props;

  if (!showButtons) {
    return null;
  }

  const {
    clickAddPhoto,
  } = props;

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
          onClick={props.clickCancel}
          secondary
          style={{ marginLeft: '10px' }}
          title="Cancel"
        >
          <ClearIcon />
        </FloatingActionButton>

        <FloatingActionButton
          onClick={props.clickSave}
          style={{ marginLeft: '10px' }}
          title="Save"
        >
          <DoneIcon />
        </FloatingActionButton>
      </div>
    </h2>
  );
}

cancelSaveButtons.propTypes = {
  clickAddPhoto: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  clickCancel: PropTypes.func.isRequired,
  clickSave: PropTypes.func.isRequired,
  showButtons: PropTypes.bool.isRequired,
};

cancelSaveButtons.defaultProps = {
  clickAddPhoto: null,
};

module.exports = cancelSaveButtons;
