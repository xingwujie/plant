// Used to show each plant on a user's plant list page.
// Url: /plants/<optional-user-id>
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

    // TODO: Create a slug from the name
    const slug = 'slug';

    const link = `/plant/${slug}/${id}`;

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
