const React = require('react');
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const ClearIcon = require('material-ui/svg-icons/content/clear').default;
const DoneIcon = require('material-ui/svg-icons/action/done').default;
const AddPhotoIcon = require('material-ui/svg-icons/image/add-a-photo').default;

class CancelSaveButtons extends React.Component {

  render() {

    const {
      showButtons,
    } = this.props || {};

    if(!showButtons) {
      return null;
    }

    const {
      clickAddPhoto
    } = this.props;

    return (
      <h2 className='vcenter'>
        <div style={{textAlign: 'right'}}>
          {clickAddPhoto &&
            <FloatingActionButton
              onClick={clickAddPhoto}
              secondary={true}
              title='Upload Photo'
            >
              <AddPhotoIcon />
            </FloatingActionButton>
          }

          <FloatingActionButton
            onClick={this.props.clickCancel}
            secondary={true}
            style={{marginLeft: '10px'}}
            title='Cancel'
          >
            <ClearIcon />
          </FloatingActionButton>

          <FloatingActionButton
            onClick={this.props.clickSave}
            style={{marginLeft: '10px'}}
            title='Save'
          >
            <DoneIcon />
          </FloatingActionButton>
        </div>
      </h2>
    );
  }
}

CancelSaveButtons.propTypes = {
  clickAddPhoto: React.PropTypes.func,
  clickCancel: React.PropTypes.func.isRequired,
  clickSave: React.PropTypes.func.isRequired,
  showButtons: React.PropTypes.bool.isRequired,
};

module.exports = CancelSaveButtons;
