/* global describe,test,expect */

import reducer, {preSubmit} from './index';
import actionTypes from '../actionTypes';

describe('table reducer', () => {
  let state = {
    touched: false,
    tableStateValue: [
      {
        key: 'abc',
        value: {generate: 'a', extract: 'b'},
      },
      {
        key: 'bcd',
        value: {generate: 'e', extract: 'f'},
      },
      {
        key: 'efg',
        value: {generate: '', extract: ''},
      },
    ],
  };

  test('should update non last rows without adding a new row', () => {
    state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW, value: 'k', index: 0, field: 'extract'});

    expect(state).toEqual({
      touched: true,
      tableStateValue: [
        {
          key: 'abc',
          value: {generate: 'a', extract: 'k'},
        },
        {
          key: 'bcd',
          value: {generate: 'e', extract: 'f'},
        },
        {
          key: 'efg',
          value: {generate: '', extract: ''},
        },
      ],
    });
  });
  test('should update last row partially and not push a new row', () => {
    state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW, value: 'k', index: 2, field: 'extract'});

    expect(state).toEqual({
      touched: true,
      tableStateValue: [
        {
          key: 'abc',
          value: {generate: 'a', extract: 'k'},
        },
        {
          key: 'bcd',
          value: {generate: 'e', extract: 'f'},
        },
        {
          key: 'efg',
          value: {generate: '', extract: 'k'},
        },
      ],
    });
  });
  test('should update a field row with the onRowChange logic when onRowChange function is provided ', () => {
    const onRowChange = (rowValue, fieldId, value) => {
      // eslint-disable-next-line no-param-reassign
      rowValue[fieldId] = `${value}z`;

      return rowValue;
    };

    state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW, value: 'k', index: 2, field: 'extract', onRowChange});

    expect(state).toEqual({
      touched: true,
      tableStateValue: [
        {
          key: 'abc',
          value: {generate: 'a', extract: 'k'},
        },
        {
          key: 'bcd',
          value: {generate: 'e', extract: 'f'},
        },
        {
          key: 'efg',
          value: {generate: '', extract: 'kz'},
        },
      ],
    });
  });
  test('should push a new row when last row is updated completely', () => {
    state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW, value: 'v', index: 2, field: 'generate'});

    expect(state).toEqual({
      touched: true,
      tableStateValue: [
        {
          key: 'abc',
          value: {generate: 'a', extract: 'k'},
        },
        {
          key: 'bcd',
          value: {generate: 'e', extract: 'f'},
        },
        {
          key: 'efg',
          value: {generate: 'v', extract: 'kz'},
        },
        expect.objectContaining({
          value: {generate: '', extract: ''},
        }),
      ],
    });
  });
});

describe('selector preSubmit', () => {
  const state = [
    {
      key: 'abc',
      value: {generate: 'a', extract: 'k'},
    },
    {
      key: 'bcd',
      value: {generate: 'e', extract: 'f'},
    },
    {
      key: 'efg',
      value: {generate: 'v', extract: ''},
    },
    {
      key: 'efgf',
      value: {generate: '', extract: ''},
    },
  ];

  test('should return all values including incomplete row when required optionsMap isn`t passed', () => {
    const optionsMap = [{id: 'extract'}, {id: 'generate'}];

    expect(preSubmit(state, optionsMap)).toEqual(
      [{extract: 'k', generate: 'a'}, {extract: 'f', generate: 'e'}, {extract: '', generate: 'v'}]
    );
  });
  test('should return all completed rows when required optionsMap is passed', () => {
    const optionsMap = [{id: 'extract', required: true }, {id: 'generate', required: true }];

    expect(preSubmit(state, optionsMap)).toEqual(
      [{extract: 'k', generate: 'a'}, {extract: 'f', generate: 'e'}]
    );
  });
});
