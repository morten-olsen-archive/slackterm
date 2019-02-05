import * as actionTypes from './actionTypes';

export const add = (line: string, prefix?: string,) => ({
  type: actionTypes.ADD,
  payload: [line, prefix ],
});

export const set = (lines: string[][]) => ({
  type: actionTypes.SET,
  payload: lines,
});