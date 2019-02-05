import App, { Store, Command } from './App';
import { selectors, actions } from '../state';

class ListApp extends App {
  setup(store: Store, cmd: Command) {
    const memberCmd = cmd.command('members');
    memberCmd.action(() => {
      const state = store.getState();
      state.slack.members.forEach(member => {
        this.write(`${member.name}: ${member.real_name}`);
      });
    });

    const channelsCmd = cmd.command('channels');
    channelsCmd.action(() => {
      const state = store.getState();
      state.slack.channels.forEach(channel => {
        this.write(`${channel.name}, ${channel.is_member}`);
      });
    });
  }
}

export default ListApp;