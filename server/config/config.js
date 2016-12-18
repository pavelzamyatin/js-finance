var config = {};

// MAIN config
config.portNumber   = 3000;
config.siteName     = 'zamyatin.xyz';

// DB config
config.mongoURI     = {
  mlab: 'mongodb://admin:admin@ds133328.mlab.com:33328/js-finance-dev',
  development: 'mongodb://localhost:27017/finance',
  test: 'mongodb://localhost:27017/finance-test'
};

module.exports = config;
