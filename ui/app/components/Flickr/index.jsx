/* global document, fetch, React, ReactDOM */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Flickr = () => {
  const [listImages, setListImages] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:3000/api/geo');
      const result = await response.json();
      console.log(result);

      setListImages(result.images.map((img) => (
        <li key={img.src}>
          <img src={img.src} alt={img.caption} />
        </li>
      )));
    }
    fetchData();
  }, []);

  if (!listImages) return null;
  return (
    <ul>{listImages}</ul>
  );
};

ReactDOM.render(
  <Flickr />,
  document.getElementById('app'),
  );
