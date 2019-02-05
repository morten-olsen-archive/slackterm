import { Command as CommanderCommand } from 'commander';
import { Store as ReduxStore } from 'redux';
import { State, actions } from '../state';

export interface Store extends ReduxStore<State> {
}
export interface Command extends CommanderCommand {

}

abstract class App {
  protected commander: CommanderCommand;
  private store: ReduxStore<State>;

  constructor(store: ReduxStore<State>) {
    this.store = store;
    this.commander = new CommanderCommand();
  }

  abstract setup(store: Store, cmd: CommanderCommand): void;

  write(text: string, prefix?: string) {
    this.store.dispatch(actions.output.add(text, prefix));
  }

  run(args: string[]) {
    this.setup(this.store, this.commander);
    this.commander.parse(args);
  }
}

export default App;