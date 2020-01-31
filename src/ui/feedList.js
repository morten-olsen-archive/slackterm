const textBox = require('./textBox');
const render = ({
  items: orgItems,
  offset = 0,
  height,
  width,
  seperator = ' : ',
}) =>  {
  const items = orgItems; //orgItems.reverse().slice(offset).reverse();
  const output = new Array(height);
  const prefixWidth = items.reduce((result, { prefix }) => Math.max(prefix.length, result), 0);
  const textWidth = width - prefixWidth - seperator.length;
  let currentLine = height;
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    
    const text = textBox(item.text, textWidth).split('\n');
    for (let line = 0; line < text.length; line++) {
      const index = currentLine - text.length + line;
      const prefixExtra = item.formattedPrefix.length - item.prefix.length;
      const prefix = line === 0
        ? item.formattedPrefix.padEnd(prefixWidth + prefixExtra) + seperator
        : ''.padEnd(prefixWidth + seperator.length, ' ');
      output[index] = prefix + text[line];
    }
    currentLine -= text.length;
  }
  return output.join('\n');
};

module.exports = render;
