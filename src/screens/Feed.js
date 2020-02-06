const renderList = require('../ui/feedList');
class Feed {
  reducer = (state = {}) => state;

  render = ({ data, term }) => {
    const list = renderList({
      items: data.feed,
      height: term.height,
      width: term.width,
    });
    return list;
  }

  handleInput = (input, dispatch, { data }) => {
    switch(input) {
      case 's':
        dispatch({
          type: '@@SCREEN/SELECT',
          payload: 'selectConversation',
        });
        break;
      case 'c':
        dispatch({
          type: '@@SCREEN/SELECT',
          payload: 'conversation',
        });
        break;
      default:
        return;
    }
  }
}

module.exports = Feed;
