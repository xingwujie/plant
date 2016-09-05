import * as actions from '../../actions';
import Paper from 'material-ui/Paper';
import React from 'react';
import EditDeleteButtons from './EditDeleteButtons';
import NoteUpdate from './NoteUpdate';

export default class NoteRead extends React.Component {

  constructor(props) {
    super(props);
    this.checkDelete = this.checkDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
  }

  checkDelete() {
    this.setState({showDeleteConfirmation: true});
  }

  confirmDelete(yes) {
    if(yes) {
      this.props.dispatch(actions.deleteNoteRequest(this.props.note._id));
    } else {
      this.setState({showDeleteConfirmation: false});
    }
  }

  renderEdit() {
    return (
      <NoteUpdate
        cancel={() => this.setState({editMode: false})}
        dispatch={this.props.dispatch}
        isOwner={this.props.isOwner}
        note={this.props.note}
        plant={this.props.plant}
      />
    );
  }

  buildImageUrl(image) {
    const folder = process.env.NODE_ENV === 'production' ? 'up' : 'test';
    return `https://i.plaaant.com/${folder}/orig/${image.id}.${image.ext}`;
  }

  renderImage(image) {
    const imageStyle = {
      maxWidth: '100%',
      padding: '1%'
    };

    return (
      <div key={image.id}>
        <img style={imageStyle} src={this.buildImageUrl(image)} />
      </div>
    );
  }

  renderImages(note) {
    return (note.images || []).map(image => {
      return this.renderImage(image);
    });
  }

  renderRead() {
    const paperStyle = {
      padding: 20,
      width: '100%',
      margin: 20,
      display: 'inline-block'
    };

    const {
      showDeleteConfirmation = false
    } = this.state || {};

    const {
      isOwner,
      note
    } = this.props;

    const images = this.renderImages(note);

    return (
      <Paper key={note._id} style={paperStyle} zDepth={1}>
        <h5>{note.date.format('DD-MMM-YYYY')}{` (${note.date.fromNow()})`}</h5>
        <div>{note.note}</div>
        <EditDeleteButtons
          clickEdit={() => this.setState({editMode: true})}
          clickDelete={this.checkDelete}
          confirmDelete={this.confirmDelete.bind(note._id)}
          showDeleteConfirmation={showDeleteConfirmation}
          showButtons={isOwner}
          deleteTitle={''}
        />
        {!!images.length && images}
      </Paper>
      );
  }

  render() {
    const {
      editMode = false
    } = this.state || {};

    return editMode
      ? this.renderEdit()
      : this.renderRead();
  }

}

NoteRead.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  note: React.PropTypes.object.isRequired,
  plant: React.PropTypes.object.isRequired,
  // sinceLast: React.PropTypes.string.isRequired,
};
