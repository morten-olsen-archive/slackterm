import { Store } from 'redux';
import blessed, { Widgets } from 'blessed';
import EventEmitter from 'eventemitter3';
import strip from 'strip-ansi';
import { State, selectors } from '../state';

class UI extends EventEmitter {
  private screen: Widgets.Screen;
  private output: Widgets.ListElement;
  private status: Widgets.BoxElement;

  constructor(store: Store<State>) {
    super();
    this.screen = blessed.screen({
      autoPadding: true,
      smartCSR: true,
      title: 'react-blessed hello world',
    });
    this.screen.enableMouse();
  
    store.subscribe(() => {
      const state = store.getState();
      this.update(state);
    });

    this.output = blessed.list({
      bottom: 2,
      mouse: true,
      vi: true,
      keys: true,
      interactive: true,
      style: {
        selected: {
          bg: 'yello',
          fg: 'green',
        }
      }
    });

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
    
    this.screen.append(this.output);
    this.screen.append(form);
    this.screen.append(this.status);
    form.append(input);
    form.append(box);
    this.update(store.getState());

    input.focus();
  }

  update(state: State) {
    const currentChannel = selectors.slack.getCurrentChannelName(state);
    this.output.clearItems();
    const padding = state.output.lines.reduce((output, current) => {
      const prefix = current[1];
      if (!prefix) {
        return output;
      }
      return Math.max(output, strip(prefix).length);
    }, 0);
    state.output.lines.forEach(([text, prefix]) => {
      let output = '';
      const p = prefix;
      if (p) {
        const ansiLength = p.length - strip(p).length;
        output += `> ${p.padEnd(padding + ansiLength, ' ')} : `;
      }
      output += text;
      this.output.addItem(output)
    });
    this.output.setScrollPerc(100);
    this.status.content = `channel: ${currentChannel || '[none]'}`
    this.screen.render();
  }
}

export default UI;