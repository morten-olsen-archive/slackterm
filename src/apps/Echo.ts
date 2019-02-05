import App, { Store, Command } from './App';
import { selectors, actions } from '../state';

class EchoApp extends App {
  setup(store: Store, cmd: Command) {
    cmd.option('-t, --target <target>')
    cmd.action((input, options) => {
      const state = store.getState();
      const target = options.target;
      if (target) {
        const channelId = selectors.slack.getChannelByName(state, target);
        if (channelId) {
          store.dispatch(actions.slack.sendMessage(channelId, input));
        } else {
          this.write('Could not find target');
        }
      } else {
        const channelId = selectors.slack.getCurrentChannelId(state);
        if (channelId) {
          store.dispatch(actions.slack.sendMessage(channelId, input));
        } else {
          this.write('No channel selected');
        }
      }
    });
  }
}

export default EchoApp;