/* global describe,test,expect, beforeAll */

import reducer, { preSubmit} from './index';
import actionTypes from '../actionTypes';

const initialState = {
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

describe('table reducer', () => {
  let state = initialState;

  describe('nonRequired optionsMap ', () => {
    const optionsMapNonRequiredFields = [{id: 'extract' }, {id: 'generate'}];

    test('should update non last rows without adding a new row', () => {
      state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW, optionsMap: optionsMapNonRequiredFields, value: 'k', rowIndex: 0, field: 'extract'});

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
    test('should not push a new row since a non first column value has been updated', () => {
      state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW, optionsMap: optionsMapNonRequiredFields, value: 'l', rowIndex: 2, field: 'generate'});

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
            value: {generate: 'l', extract: ''},
          },
        ],
      });
      state = reducer(state,
        {type: actionTypes.UPDATE_TABLE_ROW, optionsMap: optionsMapNonRequiredFields, value: '', rowIndex: 2, field: 'generate'});
    });
    test('should update first column value and a new row is added since it is the first column value', () => {
      state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW, optionsMap: optionsMapNonRequiredFields, value: 'k', rowIndex: 2, field: 'extract'});
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
          expect.objectContaining({
            value: {generate: '', extract: ''},
          }),
        ],
      });
    });
    test('should update a field row with the onRowChange logic when onRowChange function is provided ', () => {
      const onRowChange = (rowValue, fieldId, value) => {
      // eslint-disable-next-line no-param-reassign
        rowValue[fieldId] = `${value}z`;

        return rowValue;
      };

      state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW, optionsMap: optionsMapNonRequiredFields, value: 'k', rowIndex: 2, field: 'extract', onRowChange});

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
          expect.objectContaining({
            value: {generate: '', extract: ''},
          }),
        ],
      });
    });
    test('should push a new row when last row is updated completely', () => {
      state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW, optionsMap: optionsMapNonRequiredFields, value: 'v', rowIndex: 2, field: 'generate'});

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

  describe('required optionsMap', () => {
    const optionsMapRequiredFields = [{id: 'extract', required: true }, {id: 'generate', required: true}];

    beforeAll(() => {
      state = initialState;
    });

    test('should not push a new row since only one required cells is updated', () => {
      state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW,
        optionsMap: optionsMapRequiredFields,
        value: 'v',
        rowIndex: 2,
        field: 'generate'});

      expect(state).toEqual({
        touched: true,
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
            value: {generate: 'v', extract: ''},
          },
        ],
      });
    });
    test('should not push a new row since only one required cells is updated again with a different value', () => {
      state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW,
        optionsMap: optionsMapRequiredFields,
        value: 'va',
        rowIndex: 2,
        field: 'generate'});

      expect(state).toEqual({
        touched: true,
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
            value: {generate: 'va', extract: ''},
          },
        ],
      });
    });
    test('should push a new row since all required cells is updated completely', () => {
      state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW,
        optionsMap: optionsMapRequiredFields,
        value: 'k',
        rowIndex: 2,
        field: 'extract'});

      expect(state).toEqual({
        touched: true,
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
            value: {generate: 'va', extract: 'k'},
          },
          expect.objectContaining({
            value: {generate: '', extract: ''},
          }),
        ],
      });
    });
  });
});

describe('selector', () => {
  describe('preSubmit', () => {
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
});
