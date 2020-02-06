const chalk = require('chalk');
class SelectConversation {
  reducer = (state = { input: '',  selectedIndex: 0 }, {type, payload }) => {
    switch(type) {
      case 'APPEND_KEY':
        return {
          ...state,
          selectedIndex: 0,
          input: state.input + payload
        };
      case 'MOVE_CURSOR':
        return {
          ...state,
          selectedIndex: state.selectedIndex + payload,
        };
      case 'REMOVE_KEY':
        return {
          ...state,
          input: state.input.slice(0, -1), 
        };
      case 'RESET':
        return { 
          ...state,
          input: '',
        };
      default:
        return state;
    }
  }

  getItems = (data, input) => {
    
    let items = [
      ...data.members.map(member => {
        const channel = data.channels.find(c => c.user === member.id);
        return {
          ...member,
          id: channel && channel.id,
        };
      }),
      ...data.channels,
    ];
    items = items.filter(i => i.id && i.name && i.name.indexOf(input) >= 0);
    return items;
  };

  render = ({ data, screen, term }) => {
    let items = this.getItems(data, screen.input);
    items = items.slice(0, term.height - 2);
    const output = items.map((item, index) => {
      if (index === screen.selectedIndex) {
        return chalk.red(item.name);
      } else {
        return item.name;
      }
    });
    output[term.height] = 'search: ' + screen.input;
    return output.join('\n');
  }

  handleInput = (input, dispatch, { data, screen }) => {
    switch (input) {
      case 'BACKSPACE':
        dispatch({
          type: 'REMOVE_KEY',
        });
        break;
      case 'CTRL_J':
        dispatch({
          type: 'MOVE_CURSOR',
          payload: 1,
        });
        break;
      case 'CTRL_K':
        dispatch({
          type: 'MOVE_CURSOR',
          payload: -1,
        });
        break;
      case 'ENTER': {
        dispatch({
          type: 'CLEAR',
        });
        const conversation = this.getItems(data, screen.input)[screen.selectedIndex];
        dispatch({
          type: '@@SLACK/SELECT_CONVERSATION',
          payload: conversation,
        });
        dispatch({
          type: 'RESET',
        });
        dispatch({
          type: '@@SCREEN/SELECT',
          payload: 'conversation',
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
        break;
      }
    }
  }
}

module.exports = SelectConversation;
