import dotenv from 'dotenv';
dotenv.config();
import { Middleware } from 'redux';
import stringArgv from 'string-argv';
import { create, State, selectors, actions } from './state';
import chalk from 'chalk';
import * as actionTypes from './state/slack/actionTypes';
import apps from './apps';
import UI from './ui';

const middleware = (): Middleware => (store) => (next) => {
  return (action) => {
    const response = next(action);
    if (action.type === actionTypes.ADD_MESSAGE) {
      const message = selectors.slack.getMessage(store.getState(), action.payload.ts);
      if (message) {
        const { user, channel, text } = message.short;
        const prefix = `${chalk.bgBlack.yellow(user || 'unknown')}@${chalk.bgBlack.green(channel || 'direct')}`;
        store.dispatch(actions.output.add(text, prefix));
      }
    } else if (action.type === actionTypes.SELECT_CONVERSATION) {
      const state = store.getState();
      const messages = action.payload.messages;
      const output = messages.map((message: any) => {
        const userId = selectors.slack.getUserNameById(state, message.user);
        return [message.text, chalk.bgBlack.red(userId || 'unknown')];
      });
      store.dispatch(actions.output.set(output));
    }
    return response;
  }
}

const store = create({
  token: process.env.SLACK_TOKEN || 'foo',
  middlewares: [
    middleware(),
  ],
});


const ui = new UI(store);

ui.on('command', (value) => {
  try {

    store.dispatch(actions.output.add(`cmd: ${value}`));
    const argv = stringArgv(value, 'a', 'b');
    const appName = argv.splice(2, 1)[0];
    const App = apps[appName];
    const app = new App(store);
    app.run(argv);
  } catch (err) {
    store.dispatch(actions.output.add(err.toString()));
  }
})

/* const readCommand = () => {
  rl.question('', (answer) => {
    try {
      const argv = stringArgv(answer, 'a', 'b');
      const appName = argv.splice(2, 1)[0];
      const App = apps[appName];
      const app = new App();
      app.run(argv, store);
    } catch (err) {
      console.error(err);
    }
    readCommand();
  });
}

readCommand(); */