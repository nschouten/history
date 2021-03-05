/* eslint consistent-return:0 import/order:0 */
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const ngrokMod = require('ngrok');
const { resolve } = require('path');
const cors = require('cors');

const logger = require('./logger');
const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');

const isDev = process.env.NODE_ENV !== 'production';
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? ngrokMod : false;

const app = express();
// const port = 3000;
const credentials = require('./credentials.js');


app.use(cors({
  origin: [
    'http://localhost:3000',
  ],
}));

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

app.get('/api/geo', async (req, res) => {
  try {
    const serviceRoot = 'https://www.flickr.com/services/rest/';
    const baseQuery = `?method=flickr.photos.search&api_key=${credentials.flickr.api_key}&format=json&nojsoncallback=1`;
    const geoQuery = '&lat=49.282705&lon=-123.115326&radius=1';

    const serviceURL = `${serviceRoot}${baseQuery}${geoQuery}`;
    const response = await fetch(serviceURL);
    const result = await response.json();

    const flickrImgPath = (image) => `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_w.jpg`;

    const images = result.photos.photo.map((photo) => ({
      src: flickrImgPath(photo),
    }));

    res.send({ images });
  } catch (error) {
    res.send({ error: error.message });
  }
});

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});



// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz'; // eslint-disable-line
  res.set('Content-Encoding', 'gzip');
  next();
});

// Start your app.
app.listen(port, host, async err => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    let url;
    try {
      url = await ngrok.connect(port);
    } catch (e) {
      return logger.error(e);
    }
    logger.appStarted(port, prettyHost, url);
  } else {
    logger.appStarted(port, prettyHost);
  }
});
