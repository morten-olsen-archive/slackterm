import blessed from 'blessed';
import CreateNode from '../CreateNode';
import { State } from '../../state';
import strip from 'strip-ansi';

const createOutput: CreateNode = (store) => {
  const outputElm = blessed.list({
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

  const update = (state: State) => {
    outputElm.clearItems();
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
      outputElm.addItem(output)
    });
    outputElm.setScrollPerc(100);
  }

  store.subscribe(() => {
    update(store.getState());
  });

  return outputElm;
};

export default createOutput;
