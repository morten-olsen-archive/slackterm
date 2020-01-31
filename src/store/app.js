const { combineReducers } = require('redux');

const createScreenDefaults = (defaultView) => ({
  current: defaultView,
  output: '',
  width: 80,
  height: 20,
  debug: false,
});

const screenReducer = (defaultView) => (state = createScreenDefaults(defaultView), { type, payload }) => {
  switch (type) {
    case '@@SCREEN/SELECT':
      return {
        ...state,
        current: payload,
      };
    case '@@SCREEN/RENDERED':
      return {
        ...state,
        output: payload,
      };
    case '@@SCREEN/RESIZE':
      return {
        ...state,
        width: payload.width,
        height: payload.height,
      };
    case '@@SCREEN/DEBUG':
      return {
        ...state,
        debug: payload,
      };
    default: {
      return state;
    }
  }
};

const create = ({
  defaultScreen,
  screens,
  data = () => ({}),
}) => {
  const screenReducers = Object.entries(screens).reduce((output, [name, current]) => ({
    ...output,
    [name]: current.reducer,
  }), {});

  const mainReducer = combineReducers({
    data,
    screen: screenReducer(defaultScreen),
    screens: combineReducers(screenReducers),
  });

  const getActionInput = (store, currentScreenName) => {
    const getScreenState = () => store.getState().screens[currentScreenName];
    const state = store.getState();
    const screenState = getScreenState();
    const data = state.data;
    const term = {
      height: state.screen.height,
      width: state.screen.width,
    };
    return {
      data,
      screen: screenState,
      term,
    };
  };

  const middleware = store => next => action => {
    let currentScreenName = store.getState().screen.current; 
    let currentScreen = screens[currentScreenName];

    if (action.type === '@@SCREEN/INPUT') {
      currentScreen.handleInput(action.payload, next, getActionInput(store, currentScreenName));
    }

    
    return next(action);
  };

  const render = store => next => action => {
    const result = next(action);
    const currentScreenName = store.getState().screen.current; 
    const currentScreen = screens[currentScreenName];

    const lastOutput = store.getState().screen.output;
    const output = currentScreen.render(getActionInput(store, currentScreenName));
    if (output !== lastOutput) {
      next({
        type: '@@SCREEN/RENDERED',
        payload: output,
      });
    }
    return result;
  };

  return {
    reducer: mainReducer,
    middleware,
    render,
  };
};

module.exports = create;
