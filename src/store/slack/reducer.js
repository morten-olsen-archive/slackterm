const chalk = require('chalk');

const createDefaults = () => ({
  members: [],
  channels: [],
  feed: [],
  currentChannel: {
    id: undefined,
    name: undefined,
    messages: [],
  },
});

const fixMessage = (msg, state) => {
  const user = state.members.find(m => m.id === msg.user);
  const channel = state.channels.find(m => m.id === msg.channel);
  return {
    user: user ? user.name : undefined,
    channel: channel ? channel.name : undefined,
    text: msg.text,
    prefix: `${user ? user.name : 'unknown'}@${channel ? channel.name : 'direct'}`,
    formattedPrefix: `${chalk.cyan(user ? user.name : 'unknown')}@${chalk.red(channel && channel.name ? channel.name : 'direct')}`,
  }
};

const reducer = (state = createDefaults(), { type, payload }) => {
  switch(type) {
    case '@@SLACK/STARTED':
      return ({
        ...state,
        members: payload.members,
        channels: payload.channels,
      });
    case '@@SLACK/ADD_MESSAGE':
      const result = {
        ...state,
        feed: [
          ...state.feed,
          fixMessage(payload, state),
        ],
      };
      if (state.currentChannel.id && state.currentChannel.id === payload.channel) {
        result.currentChannel = {
          ...state.currentChannel,
          messages: [
            ...state.currentChannel.messages,
            fixMessage(payload, state),
          ],
        };
      }
      return result;
    case '@@SLACK/SELECT_CONVERSATION':
      return {
        ...state,
        currentChannel: {
          id: payload.id,
          name: payload.name,
          messages: [],
        },
      };
    case '@@SLACK/SET_CHANNEL_MESSAGES':
      return {
        ...state,
        currentChannel: {
          ...state.currentChannel,
          messages: payload.reverse().map(a => fixMessage(a, state)),
        },
      };
    default:
      return state;
  }
};

module.exports = reducer;
