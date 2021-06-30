import React from 'react';

const Detail = ({ album, artists, name }) => {
  return (
    <div>
      <img src={album.images[0].url} alt={name}></img>
      <label htmlFor={name}>{name}</label>
      <label htmlFor={artists[0].name}>{artists[0].name}</label>
    </div>
  );
};

export default Detail;
