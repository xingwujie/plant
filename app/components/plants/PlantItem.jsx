// Used to show each plant on a user's plant list page.
// Url: /plants/<optional-user-id>
import {Link} from 'react-router';
import {makeSlug} from '../../libs/utils';
import React from 'react';

export default class PlantItem extends React.Component {

  constructor() {
    super();
  }

  render() {
    var {
      name, //eslint-disable-line no-shadow
      id,
      imageUrl
    } = this.props || {};

    const link = `/plant/${makeSlug(name)}/${id}`;

    return (
      <div className='plant-item'>
        <Link
          to={link}>
          {imageUrl &&
            <img src={imageUrl} />
          }
          <div>{name}</div>
        </Link>
      </div>
    );
  }
}

PlantItem.propTypes = {
  name: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
  imageUrl: React.PropTypes.string,
};
