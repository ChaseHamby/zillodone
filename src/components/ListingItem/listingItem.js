import React from 'react';

import './listingItem.scss';

class ListingItem extends React.Component {
  render() {
    const { listing } = this.props;
    return (
      <h2>{listing.address}</h2>
    );
  }
}

export default ListingItem;