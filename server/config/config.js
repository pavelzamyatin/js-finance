var config = {};

// MAIN config
config.portNumber = 3000;

// DB config
config.mongoURI = {
  development: 'mongodb://localhost:27017/finance',
  test: 'mongodb://localhost:27017/finance-test'
};

module.exports = config;
