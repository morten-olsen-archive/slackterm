export { default as slackReducer, SlackState } from './reducer';
export { default as slackMiddleware } from './middleware';
import * as orgSlackActions from './actions';
import * as orgSlackSelectors from './selector';

export const slackActions = orgSlackActions;
export const slackSelectors = orgSlackSelectors;