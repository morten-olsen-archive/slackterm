import { Reducer } from 'redux';
import * as actionTypes from './actionTypes';

export interface OutputState {
  lines: string[][],
}

const createDefaultState = (): OutputState => ({
  lines: [],
});

const outputReducer: Reducer<OutputState> = (state = createDefaultState(), action) => {
  switch (action.type) {
    case actionTypes.ADD: {
      return {
        ...state,
        lines: [
          ...state.lines,
          action.payload,
        ]
      };
    }
    case actionTypes.SET: {
      return {
        ...state,
        lines: action.payload
      };
    }
    default: {
      return state;
    }
  }
};

export default outputReducer;
