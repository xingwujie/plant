// Used to add a note to a plant

import * as actions from '../../actions';
import InputCombo from '../InputCombo';
import moment from 'moment';
import RaisedButton from 'material-ui/lib/raised-button';
import React from 'react';
// import Divider from 'material-ui/lib/divider';

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
      date = moment().format('MM/DD/YYYY')
    } = this.state || {};

    const textAreaStyle = {
      width: '100%'
    };

    const errors = {};

    return (
      <div className='well'>

        <form className='editor'>

          <InputCombo
            error={errors.purchasedDate}
            label='Note Date'
            value={date}
            placeholder={`MM/DD/YYYY`}
            changeHandler={this.onChange.bind(this, 'date')}
          />

          <div>
            <textarea
              onChange={this.onChange.bind(this, 'noteText')}
              placeholder='What has happened since your last note?'
              rows={4}
              style={textAreaStyle}
              value={noteText}
            />
          </div>

          <div style={{textAlign: 'right'}}>
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
