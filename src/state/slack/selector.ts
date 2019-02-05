import { State } from '../index';

export const getConversationById = (state: State, id: string) => {
  const conversation = state.slack.channels.find(channel => channel.id === id);
  if (!conversation) {
    return undefined;
  }
  return conversation;
}

export const getCurrentConversation = (state: State) => {
  if (typeof state.slack.selectedConversation === 'undefined') {
    return undefined;
  }
  const currentId = state.slack.selectedConversation.id;
  const conversation = getConversationById(state, currentId);
  if (!conversation) {
    return undefined;
  }
  return {
    ...conversation,
    messages: state.slack.selectedConversation.messages,
  }
}

export const getMessage = (state: State, ts: string) => {
  const message = state.slack.newMessages.find(message => message.ts === ts);
  if (!message) {
    return undefined;
  }
  const user = message.user ? state.slack.members.find(member => member.id === message.user) : undefined;
  const channel = message.channel ? state.slack.channels.find(channel => channel.id === message.channel) : undefined;

  return {
    message,
    user,
    channel,
    short: {
      text: message.text,
      user: user ? user.name : undefined,
      channel: channel ? channel.name : undefined,
    },
  };
}

export const getChannelByName = (state: State, name: string) => {
  const identifier = name[0];
  const normalized = name.substring(1);
  switch (identifier) {
    case '@': {
      const member = state.slack.members.find(member => member.name === normalized);
      if (!member) {
        return undefined;
      }
      const channel = state.slack.channels.find(channel => channel.user === member.id);
      if (!channel) {
        return undefined;
      }
      return channel.id;
    }
    case '#': {
      const channel = state.slack.channels.find(channel => channel.name === normalized);
      if (!channel) {
        return undefined;
      }
      return channel.id;
    }
    default: {
      throw Error('missing prefix');
    }
  }
}

export const getNameById = (state: State, id: string) => {
  const channel = state.slack.channels.find(channel => channel.id === id);
  if (channel) {
    if (channel.user) {
      const member = state.slack.members.find(member => member.id === channel.user);
      if (member) {
        return `@${member.name}`;
      }
    }
    return `#${channel.name}`;
  }
  const member = state.slack.members.find(member => member.id === id);
  if (member) {
    return `@${member.name}`;
  }
  return undefined;
}

export const getCurrentChannelId = (state: State) => {
  if (!state.slack.target) {
    return undefined;
  }
  return state.slack.target.channel;;
}

export const getCurrentChannelName = (state: State) => {
  if (!state.slack.target) {
    return undefined;
  }
  
  const channelId = state.slack.target.channel;
  const name = getNameById(state, channelId);
  return name;
}

export const getUserNameById = (state: State, id: string) => {
  const member = state.slack.members.find(member => member.id === id);
  if (member) {
    return member.name;
  }
  return undefined;
}