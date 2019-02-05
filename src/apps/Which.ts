import App, { Store, Command } from './App';
import { selectors } from '../state';

class Which extends App {
  setup(store: Store, cmd: Command) {
    const targetCmd = cmd.command('channel');
    targetCmd.action(() => {
      const target = selectors.slack.getCurrentChannelName(store.getState());
      if (target) {
        this.write(target);
      } else {
        this.write('no target');
      }
    });
  }
}

export default Which;