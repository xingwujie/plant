// Used to add a note to a plant

import React from 'react';

export default class NoteCreateUpdate extends React.Component {

  componentDidMount() {
    this.state = {};
  }

  save(e) {
    console.log('NoteCreateUpdate.save');
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    // const plantId = _.get(this, 'props.params.id', '');

    const {
      plant,
    } = this.props || {};

    return (
      <div className='well'>
        <h2>Add Note</h2>
        <div>Plant: {plant.title}</div>
        {plant.description && <div>Description: {plant.description}</div>}
          <form className='editor'>

            <div style={{textAlign: 'center'}}>
              <button
                type='button'
                className='btn btn-primary btn-lg'
                onClick={this.save.bind(this)}>Save Note</button>
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
