import {Link} from 'react-router';
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

    const link = `/plant/${id}`;

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
