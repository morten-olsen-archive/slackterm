import { Middleware } from 'redux';
import { RTMClient, WebClient } from '@slack/client';
import * as actionTypes from './actionTypes';

const token = process.env.SLACK_TOKEN;

export interface Options {
  token: string;
  autostart?: boolean;
}

const slackMiddleware = (options: Options): Middleware => () => (next) => {
  const rtm = new RTMClient(options.token, {

  });
  const web = new WebClient(options.token);
  rtm.start();

  rtm.on('message', (message) => {
    process.stdout.write('\u0007');
    next({
      type: actionTypes.ADD_MESSAGE,
      payload: message,
    });
  });

  const startup = async () => {

    const { channels } = <any>await web.conversations.list({
      types: 'public_channel,private_channel,mpim,im',
      exclude_archived: true,
    });
    const { members } = <any>await web.users.list();

    next({
      type: actionTypes.SET_CONVERSATIONS,
      payload: channels,
    });

    next({
      type: actionTypes.SET_MEMBERS,
      payload: members,
    });
  };

  if (options.autostart !== false) {
    startup().catch(err => {
      next({
        type: actionTypes.STARTUP_ERROR,
        payload: err,
      });
      console.error(err);
    })
  }

  return (action) => {
    if (action.type === actionTypes.SELECT_CONVERSATION) {
      const run = async () => {
        const { messages } = <any>await web.conversations.history({
          channel: action.payload,
          limit: 25,
        });
        messages.reverse();
        return next({
          type: actionTypes.SELECT_CONVERSATION,
          payload: {
            messages,
            id: action.payload,
          },
        });
      }
      return run();
    } else if (action.type === actionTypes.SEND_MESSAGE) {
      const run = async () => {
        await rtm.sendMessage(action.payload.text, action.payload.channel);
      }
      return run();
    } else if (action.type === actionTypes.UPDATE) {
      startup().catch(err => {
        next({
          type: actionTypes.STARTUP_ERROR,
          payload: err,
        });
        console.error(err);
      });
    } else {
      return next(action);
    }
  };
};

export default slackMiddleware;
