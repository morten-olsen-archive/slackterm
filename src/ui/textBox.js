const create = (input = '', width) => {
  const result = [];
  const lines = Math.ceil(input.length / width);
  for (let line = 0; line < lines; line++) {
    result[line] = input.slice(line * width, line * width + width);
  }
  return result.join('\n');
};

module.exports = create;
