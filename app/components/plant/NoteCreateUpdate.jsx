// Used to add a note to a plant

import React from 'react';
import * as actions from '../../actions';
import moment from 'moment';

export default class NoteCreateUpdate extends React.Component {

  constructor() {
    super();
    this.state = {
      date: moment().format('MM/DD/YY')
    };
  }

  componentDidMount() {
    this.state = {};
  }

  save(e) {
    // TODO: Need to validate and clean note
    const note = {
      ...this.state,
      plant: this.props.plant._id
    };
    console.log('NoteCreateUpdate.save:', note);
    this.props.dispatch(actions.createNoteRequest(note));
    e.preventDefault();
    e.stopPropagation();
  }

  cancel(e) {
    this.props.dispatch(actions.createNote({
      _id: this.props.plant._id,
      enable: false
    }));
    e.preventDefault();
    e.stopPropagation();
  }

  onChange(key, e) {
    this.setState({
      [key]: e.target.value
    });
  }

  render() {
    // const plantId = _.get(this, 'props.params.id', '');

    // const {
    //   plant,
    // } = this.props || {};

    const {
      noteText = '',
      date = ''
    } = this.state || {};

    const textAreaStyle = {
      width: '100%',
      color: 'black'
    };

    return (
      <div className='well'>

        <form className='editor'>

          <div className='pull-right'>
            <span style={{color: 'black'}}
              >{'Date:'}</span>
            <input
              onChange={this.onChange.bind(this, 'date')}
              style={{color: 'black'}}
              type='text'
              value={date}
            />
          </div>

          <div>
            <textarea
              onChange={this.onChange.bind(this, 'noteText')}
              placeholder='What has happened since your last note?'
              rows={4}
              style={textAreaStyle}
              value={noteText}
            />
          </div>

          <div style={{textAlign: 'center'}}>
            <button
              type='button'
              className='btn btn-primary btn-lg'
              onClick={this.save.bind(this)}>Save</button>
            <button
              type='button'
              className='btn btn-danger btn-lg'
              onClick={this.cancel.bind(this)}>Cancel</button>
          </div>

        </form>
      </div>
    );
  }
}

NoteCreateUpdate.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  plant: React.PropTypes.object.isRequired,
};
