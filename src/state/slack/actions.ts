import * as actionTypes from './actionTypes';

export const update = () => ({
  type: actionTypes.UPDATE,
});

export const selectConversation = (id: string) => ({
  type: actionTypes.SELECT_CONVERSATION,
  payload: id,
});

export const sendMessage = (conversationId: string, text: string) => ({
  type: actionTypes.SEND_MESSAGE,
  payload: {
    channel: conversationId,
    text,
  },
});
