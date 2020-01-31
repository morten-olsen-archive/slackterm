const { createStore, applyMiddleware } = require('redux');
const createApp = require('./app');
const createSlackMiddleware = require('./slack/middleware');
const slackReducer = require('./slack/reducer');

const create = ({
  token,
  defaultScreen,
  screens,
}) => {
  const app = createApp({
    defaultScreen,
    screens,
    data: slackReducer,
  });

  const store = createStore(
    app.reducer,
    applyMiddleware(
      app.middleware,
      createSlackMiddleware(token),
      app.render,
    ),
  );

  return store;
};

module.exports = create;

