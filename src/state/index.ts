import { createStore, combineReducers, applyMiddleware, Middleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import { SlackState, slackMiddleware, slackReducer, slackActions, slackSelectors } from './slack';
import { OutputState, outputReducer, outputActions } from './output';

export interface Options {
  token: string;
  autostart?: boolean;
  middlewares?: Middleware[],
};

export interface State {
  slack: SlackState;
  output: OutputState;
};

export const actions = {
  slack: slackActions,
  output: outputActions,
};

export const selectors = {
  slack: slackSelectors,
};

export const reducer = combineReducers({
  slack: slackReducer,
  output: outputReducer
});

export const create = (options: Options) => {
  const store = createStore(
    reducer,
    // composeWithDevTools(
      applyMiddleware(
        slackMiddleware({
          token: options.token,
          autostart: options.autostart,
        }),
        ...(options.middlewares || []),
      ),
    // ),
  );

  return store;
}