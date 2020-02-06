#!/usr/bin/env node

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

  process.stdout.write('\u001B[2J\u001B[0;0f');
  terminal.hideCursor();
  
  store.subscribe(() => {
    if (!store.getState().screen.debug) {
      const output = store.getState().screen.output.split('\n');
      const previousOutput = store.getState().screen.previousOutput.split('\n');
      //process.stdout.write(store.getState().screen.output);
      for (let h = 0; h <= terminal.height; h++) {
        if (previousOutput[h] === output[h]) continue;
        terminal.moveTo(1, h + 1);
        const emptyLine = ''.padEnd(terminal.width, ' ');
        process.stdout.write(emptyLine);
        terminal.moveTo(1, h + 1);
        const line = (output[h] || '').padEnd(terminal.width, ' ');
        process.stdout.write(line);
      }
    }
  });
  store.dispatch({ type: 'start' });

  
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
