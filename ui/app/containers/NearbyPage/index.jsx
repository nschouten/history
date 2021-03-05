import React, { memo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

  const credentials = require('./credentials');
  /**
   * Parse querystring from route
   * @param {string} find query name
   * @param {string} from route or URL
   * @returns {string}
   */

  function parseQueryString(find, from) {
    if (!find || !from) return '';
    const parts = RegExp(`[?&]${find}(=([^&#]*)|&|#|$)`).exec(from);
    // console.log(parts);
    return parts ? parts[2] : '';
  }

  // location is provided by react-router-dom
  function NearbyPage({ location: { search: query } }) {
    const coordinates = parseQueryString('coordinates', query);
    // console.log('these are the coordinates:', coordinates);

    const [listImages, setListImages] = useState([]);
    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
      async function fetchData() {
        const serviceRoot = 'https://www.flickr.com/services/rest/';
        const baseQuery = `?method=flickr.photos.search&api_key=${credentials.flickr.api_key}&format=json&nojsoncallback=1`;
        const geoQuery = '&lat=49.282705&lon=-123.115326&radius=1';

        const serviceUrl = `${serviceRoot}${baseQuery}${geoQuery}`;
        const response = await fetch(serviceUrl);
        const result = await response.json();
        // console.log('these are the results', result);

        const flickrImgPath = (image) => `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_w.jpg`;
        // console.log('this is the img path', flickrImgPath);

        const images = result.photos.photo.map((photo) => ({
        src: flickrImgPath(photo),

      }));

      console.log('these are the images', images);

        setListImages(images.map((img) => (
          <li key={img.src} style={{ listStyleType: 'none' }}>
            <img src={img.src} alt={img.title} className={img.title} onClick={e=>{
              showImage(e, img.src);
              }} style={{ width: 100 }}/>
          </li>
        )));
      }
      fetchData();
    }, []);

    const showImage = (e, imagesrc) => {
      setActiveImage(imagesrc);
      e.target.style.border='2px solid pink';
    }

    if (!listImages) return (
      <h1>Sorry, no available pictures were found</h1>);

    return (
      <article>
        <Helmet>
          <title>Nearby</title>
          <meta name="description" content="Description of Nearby" />
        </Helmet>
        <FormattedMessage {...messages.header} />
        {coordinates}
        {
          activeImage &&
          <img src={activeImage}/>
        }
        <ul>{listImages}</ul>

      </article>
    );
  }

export default memo(NearbyPage);
