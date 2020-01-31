const renderList = require('../ui/feedList');

class Feed {
  reducer = (state ={ input: '', mode: 'n', offset: 0 }, { type, payload }) => {
    switch (type) {
      case 'SET_MODE': {
        return {
          ...state,
          mode: payload,
        };
      }
      case 'APPEND_KEY':
        return {
          ...state,
          input: state.input + payload
        };
      case 'REMOVE_KEY':
        return {
          ...state,
          input: state.input.slice(0, -1), 
        };
      case 'MOVE_CURSOR':
        return {
          ...state,
          offset: Math.max(state.offset + payload, 0),
        };
      default:
        return state;
    }
  }

  render({ data, screen, term }) {
    const lines = renderList({
      items: data.currentChannel.messages,
      height: term.height - 1,
      width: term.width,
      offset: screen.offset,
    }).split('\n');
    if (screen.mode === 'i') {
      lines[term.height -1] = `say in ${data.currentChannel.name}: ${screen.input}`;
    } else {
      lines[term.height - 1] = 'normal mode';
    }
    return lines.join('\n');
  }

  handleInput(input, dispatch, { data, screen }) {
    if (screen.mode === 'i') {
      switch(input) {
        case 'CTRL_C':
        case 'ESCAPE': {
          dispatch({
            type: 'SET_MODE',
            payload: 'n',
          });
          break;
        }
        case 'BACKSPACE': {
          dispatch({
            type: 'REMOVE_KEY',
            payload: input,
          });
          break;
        }
        case 'ENTER': {
          dispatch({
            type: '@@SLACK/SEND',
            payload: {
              channel: data.currentChannel.id,
              text: screen.input,
            },
          });
          break;
        }
        default: {
          if (input.length === 1) {
            dispatch({
              type: 'APPEND_KEY',
              payload: input,
            });
          }
        }
      }
    } else {
      switch(input) {
        case 'k': {
          dispatch({
            type: 'MOVE_CURSOR',
            payload: -1,
          });
          break;
        }
        case 'j': {
          dispatch({
            type: 'MOVE_CURSOR',
            payload: 1,
          });
          break;
        }
        case 's': {
          dispatch({
            type: '@@SCREEN/SELECT',
            payload: 'selectConversation',
          });
          break;
        }
        case 'f': {
          dispatch({
            type: '@@SCREEN/SELECT',
            payload: 'feed',
          });
          break;
        }
        case 'i': {
          dispatch({
            type: 'SET_MODE',
            payload: 'i',
          });
          break;
        }
        default: {
          break;
        }
      }
    }
  }
}

module.exports = Feed;
