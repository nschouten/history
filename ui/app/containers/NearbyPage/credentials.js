const credentials = {
  flickr: {
    api_key: '1a298441962ce556cfb2c05125d520c3',
    api_secret: '2e0125876b528dd8',
  },
};

const isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

if (isNode) {
  module.exports = {
    flickr: credentials.flickr,
  };
}
