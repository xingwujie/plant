// Used to show each plant on a user's plant list page.
// Url: /plants/<optional-user-id>
import {Link} from 'react-router';
import {makeSlug} from '../../libs/utils';
import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AddIcon from 'material-ui/svg-icons/content/add';

export default class PlantItem extends React.Component {

  constructor() {
    super();
    this.createNote = this.createNote.bind(this);
  }

  createNote() {
    this.props.createNote(this.props.plant);
  }

  render() {
    const {
      isOwner = false,
      plant = {}
    } = this.props;

    const {
      title,
      _id,
    } = plant;


    const link = `/plant/${makeSlug(title)}/${_id}`;

    return (
      <h4>
        {isOwner &&
          <span>
            <FloatingActionButton
              onClick={this.createNote}
              title='Add Note'
            >
              <AddIcon />
            </FloatingActionButton>
          </span>
        }
        <Link
          style={{margin: '20px'}}
          to={link}
        >
          <span>{title}</span>
        </Link>
      </h4>
    );
  }
}

PlantItem.propTypes = {
  createNote: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  plant:  React.PropTypes.shape({
    _id: React.PropTypes.string.isRequired,
    // imageUrl: React.PropTypes.string,
    // name: React.PropTypes.string,
    title: React.PropTypes.string
  }).isRequired
};
