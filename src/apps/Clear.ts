import App, { Store, Command } from './App';
import { selectors, actions } from '../state';

class ClearApp extends App {
  setup(store: Store, cmd: Command) {
    cmd.action((input, options) => {
      store.dispatch(actions.output.set([]));
    });
  }
}

export default ClearApp;