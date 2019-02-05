import App, { Store, Command } from './App';
import { selectors, actions } from '../state';

class SelectApp extends App {
  setup(store: Store, cmd: Command) {
    const channelCmd = cmd.command('channel');
    channelCmd.action((input) => {
      const target = selectors.slack.getChannelByName(store.getState(), input);
      if (target) {
        store.dispatch(actions.slack.selectConversation(target));
        this.write(`channel changed to ${target}`);
      } else {
        this.write('could not find channel');
      }
    });
  }
}

export default SelectApp;