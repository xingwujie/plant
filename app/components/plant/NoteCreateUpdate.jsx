// Used to add a note to a plant

import React from 'react';
import * as actions from '../../actions';
import moment from 'moment';
import RaisedButton from 'material-ui/lib/raised-button';

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
      width: '100%'
    };

    return (
      <div className='well'>

        <form className='editor'>

          <div className='pull-right'>
            <span style={{marginRight: '5px'}}>{'Date:'}</span>
            <input
              onChange={this.onChange.bind(this, 'date')}
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
            <RaisedButton
              label='Cancel'
              onClick={this.cancel.bind(this)}
            />
            <RaisedButton
              label='Save'
              onClick={this.save.bind(this)}
              style={{marginLeft: '10px'}}
            />
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
