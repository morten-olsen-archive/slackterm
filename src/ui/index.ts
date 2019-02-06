import { Store } from 'redux';
import blessed, { Widgets } from 'blessed';
import EventEmitter from 'eventemitter3';
import { State, selectors } from '../state';
import CreateNode from './CreateNode';
import output from './elements/output';

const createNodes: CreateNode[] = [
  output,
]

class UI extends EventEmitter {
  private screen: Widgets.Screen;
  private status: Widgets.BoxElement;


  constructor(store: Store<State>) {
    super();
    this.screen = blessed.screen({
      autoPadding: true,
      smartCSR: true,
      title: 'react-blessed hello world',
    });
    this.screen.enableMouse();

    const form = blessed.form({
      name: 'form',
      bottom: 1,
      height: 1,
    });

    const box = blessed.box({
      height: 1,
      width: 2,
      content: '>',
    })

    this.status = blessed.box({
      height: 1,
      bottom: 0,
    })

    const input = blessed.textbox({
      height: 1,
      left: 2,
      // input: true,
      mouse: true,
      input: true,
      keys: true,
      vi: true,
    });

    input.key('enter', () => {
      if (input.value === 'exit') {
        return process.exit(0);
      }
      this.emit('command', input.value);
      input.value = '';
      this.screen.render();
      // input.focus();
    });

    input.screen.key(['C-c'], function(ch, key) {
      return process.exit(0);
    });

    this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });
    
    this.screen.append(form);
    this.screen.append(this.status);
    form.append(input);
    form.append(box);
    this.update(store.getState());

    input.focus();

    createNodes.forEach(createNode => {
      const node = createNode(store);
      this.screen.append(node);
    });
  
    store.subscribe(() => {
      const state = store.getState();
      this.update(state);
    });
  }

  update(state: State) {
    const currentChannel = selectors.slack.getCurrentChannelName(state);
    this.status.content = `channel: ${currentChannel || '[none]'}`
    this.screen.render();
  }
}

export default UI;