// Used to add a note to a plant

import React from 'react';
import * as actions from '../../actions';

export default class NoteCreateUpdate extends React.Component {

  componentDidMount() {
    this.state = {};
  }

  save(e) {
    console.log('NoteCreateUpdate.save');
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

  render() {
    // const plantId = _.get(this, 'props.params.id', '');

    // const {
    //   plant,
    // } = this.props || {};

    return (
      <div className='well'>

        <form className='editor'>

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
