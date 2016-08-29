// Responsible for showing a button or create note form

// import * as actions from '../../actions';
import Divider from 'material-ui/Divider';
import NoteCreateUpdate from './NoteCreateUpdate';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';

export default class CreateNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createNote: false
    };
    this.toggleCreateNote = this.toggleCreateNote.bind(this);
  }

  toggleCreateNote() {
    console.log('CreateNote.toggleCreateNote:', this.state.createNote);
    this.setState({
      createNote: !this.state.createNote
    });
  }

  render() {
    const {
      isOwner
    } = this.props || {};

    if(!isOwner) {
      return null;
    }

    const {createNote = false} = this.state || {};

    return (
      <div>
        {createNote &&
          <NoteCreateUpdate
            {...this.props}
            toggleCreateNote={this.toggleCreateNote}
          />
        }
        {!createNote &&
          <div style={{textAlign: 'right'}}>
            <Divider />
            <RaisedButton
              label='Create Note'
              onClick={this.toggleCreateNote}
            />
          </div>
        }
      </div>
    );
  }

}

CreateNote.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  plant: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};
