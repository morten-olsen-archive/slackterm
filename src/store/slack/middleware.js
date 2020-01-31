const { RTMClient, WebClient } = require('@slack/client');

const slackMiddleware = token => (store) => (next) => {
  const rtm = new RTMClient(token, {});
  const web = new WebClient(token);

  rtm.on('message', (message) => {
    process.stdout.write('\u0007');
    next({
      type: '@@SLACK/ADD_MESSAGE',
      payload: message,
    });
  });

  const startup = async () => {
    rtm.start();
    const { channels } = await web.conversations.list({
      types: 'public_channel,private_channel,im',
      exclude_archived: true,
    });
    const { members } = await web.users.list();
    next({
      type: '@@SLACK/STARTED',
      payload: {
        channels,
        members,
      },
    });
  };

  startup().catch(console.error);

  return (action) => {
    if (action.type === '@@SLACK/SELECT_CONVERSATION') {
      const run = async () => {
        const { messages } = await web.conversations.history({
          channel: action.payload.id,
          limit: 100,
        });
        next({
          type: '@@SLACK/SET_CHANNEL_MESSAGES',
          payload: messages,
        });
      };
      run().catch(console.error);
    }
    if (action.type === '@@SLACK/SEND') {
      const run = async () => {
        await rtm.sendMessage(action.payload.text, action.payload.channel);
        next({
          type: '@@SLACK/ADD_MESSAGE',
          payload: {
            user: 'me',
            channel: action.payload.channel,
            text: action.payload.text,
          },
        });
      };
      run().catch(console.error);
    }
    return next(action);
  };
};

module.exports = slackMiddleware;
