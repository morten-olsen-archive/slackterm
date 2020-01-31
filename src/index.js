const createStore = require('./store');
const Feed = require('./screens/Feed');
const SelectConversation = require('./screens/selectChannel');
const { terminal } = require('terminal-kit');
const Conversation = require('./screens/Conversation');

const config = require('../.config.json');

const start = async () => {
  const store = createStore({
    token: config.slack_token,
    defaultScreen: 'feed',
    screens: {
      feed: new Feed(),
      conversation: new Conversation(),
      selectConversation: new SelectConversation(),
    },
  });

  store.dispatch({ type: 'foo' });
  terminal.on('key', (name) => {
    if (name === 'CTRL_D') {
      process.exit();
    }
    if (name === 'CTRL_E') {
      store.dispatch({
        type: '@@SCREEN/DEBUG',
        payload: !store.getState().screen.debug,
      });
    }
    store.dispatch({
      type: '@@SCREEN/INPUT',
      payload: name,
    });
  });

  terminal.on('resize', (width, height) => {
    store.dispatch({
      type: '@@SCREEN/RESIZE',
      payload: {
        height: height,
        width: width,
      },
    });
  });

  
  store.subscribe(() => {
    //terminal.moveTo(0, 0);
    if (!store.getState().screen.debug) {
      process.stdout.write('\u001B[2J\u001B[0;0f')
      process.stdout.write(store.getState().screen.output);
    }
  });

  
  terminal.grabInput(true);
  store.dispatch({
    type: '@@SCREEN/RESIZE',
    payload: {
      height: terminal.height,
      width: terminal.width,
    },
  });

  process.stdin.resume();
};

start().catch(console.error);
