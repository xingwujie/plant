// Used to show each plant on a user's plant list page.
// Url: /plants/<optional-user-id>
import {Link} from 'react-router';
import {makeSlug} from '../../libs/utils';
import React from 'react';
import {GridTile} from 'material-ui/GridList';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import IconButton from 'material-ui/IconButton';

export default class PlantItem extends React.Component {

  constructor() {
    super();
  }

  render() {
    var {
      title,
      _id,
      imageUrl,
      name // eslint-disable-line no-shadow
    } = this.props || {};

    // const phImage = 'http://www.maerskline.com/~/media/maersk-line/Countries/int/Images/Customer%20Cases/fruit_2_u_case.jpg';
    const phImage = 'http://www.ascensioneating.com/wp-content/uploads/2012/12/aa-fruit-2.jpg';
    const link = `/plant/${makeSlug(title)}/${_id}`;

    return (
      <Link
        to={link}>
        <GridTile
          key={imageUrl || phImage}
          title={title}
          subtitle={<span>by <b>{name}</b></span>}
          actionIcon={<IconButton><StarBorder color='white'/></IconButton>}
          >
            <img src={imageUrl || phImage}
         />
        </GridTile>
      </Link>
    );
  }
}

PlantItem.propTypes = {
  name: React.PropTypes.string.isRequired,
  _id: React.PropTypes.string.isRequired,
  imageUrl: React.PropTypes.string,
};
