import App, { Store, Command } from './App';
import { selectors, actions } from '../state';

class SelectApp extends App {
  setup(store: Store, cmd: Command) {
    const allCmd = cmd.command('all');
    allCmd.action((input) => {
      this.write('updating');
      store.dispatch(actions.slack.update());
    });
  }
}

export default SelectApp;