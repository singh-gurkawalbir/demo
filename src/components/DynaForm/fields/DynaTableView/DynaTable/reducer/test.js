
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

  describe('nonRequired optionsMap', () => {
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
      state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW, optionsMap: optionsMapNonRequiredFields, value: 'l', rowIndex: 2, field: 'generate', invalidateParentFieldOnError: true, setIsValid: jest.fn()});

      expect(state).toEqual({
        touched: true,
        isValid: false,
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
        isValid: false,
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
    test('should update a field row with the onRowChange logic when onRowChange function is provided', () => {
      const onRowChange = (rowValue, fieldId, value) => {
      // eslint-disable-next-line no-param-reassign
        rowValue[fieldId] = `${value}z`;

        return rowValue;
      };

      state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW, optionsMap: optionsMapNonRequiredFields, value: 'k', rowIndex: 2, field: 'extract', onRowChange});

      expect(state).toEqual({
        touched: true,
        isValid: false,
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
    test('should push a new row when last row is updated completely when invalidateParentFieldOnError is set to true and should check the isValid status', () => {
      state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW, optionsMap: optionsMapNonRequiredFields, value: 'v', rowIndex: 2, field: 'generate', invalidateParentFieldOnError: true, setIsValid: jest.fn()});
      state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW, optionsMap: optionsMapNonRequiredFields, value: 'kz', rowIndex: 2, field: 'extract', invalidateParentFieldOnError: true, setIsValid: jest.fn()});

      expect(state).toEqual({
        touched: true,
        isValid: true,
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
    test('should update non last rows without adding a new row when invalidateParentFieldOnError is true and should check isValid should be true', () => {
      state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW, optionsMap: optionsMapNonRequiredFields, value: 'k', rowIndex: 0, field: 'extract', invalidateParentFieldOnError: true, setIsValid: jest.fn()});

      expect(state).toEqual({
        isValid: true,
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
          {
            key: expect.anything(),
            value: {generate: '', extract: ''},
          },
        ],
      });
    });
    test('should update first column value and a new row is added since it is the first column value when invalidateParentFieldOnError is set to true and should check the isValid status', () => {
      state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW, optionsMap: optionsMapNonRequiredFields, value: 'k', rowIndex: 2, field: 'extract', invalidateParentFieldOnError: true, setIsValid: jest.fn()});
      expect(state).toEqual({
        touched: true,
        isValid: true,
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
            value: {generate: 'v', extract: 'k'},
          },
          expect.objectContaining({
            value: {generate: '', extract: ''},
          }),
        ],
      });
    });
    test('should test the isValid status set to true when the invalidateParentFieldOnError is set to true and when there is a lastEmptyRow', () => {
      state = reducer(state, {type: actionTypes.UPDATE_TABLE_ROW, optionsMap: optionsMapNonRequiredFields, invalidateParentFieldOnError: true, value: 'k', rowIndex: 0, field: 'extract', setIsValid: jest.fn()});
      expect(state).toEqual({
        touched: true,
        isValid: true,
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
            key: expect.anything(),
            value: {generate: 'v', extract: 'k'},
          },
          {
            key: expect.anything(),
            value: {generate: '', extract: ''},
          },
        ],
      });
    });
    test('should test remove table row actionType when invalidateParentFieldOnError is set to true and when optionsMap has noRequireFields and should check whether the last row is deleted', () => {
      state = reducer(state, {type: actionTypes.REMOVE_TABLE_ROW, optionsMap: optionsMapNonRequiredFields, invalidateParentFieldOnError: true, rowIndex: 2});
      expect(state).toEqual({isValid: true, tableStateValue: [{key: 'abc', value: {extract: 'k', generate: 'a'}}, {key: 'bcd', value: {extract: 'f', generate: 'e'}}, {key: expect.anything(), value: {extract: '', generate: ''}}], touched: true});
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
    test('should test remove table row actionType when invalidateParentFieldOnError is set to true and when optionsMap has RequireFields and should check whether the last row is deleted', () => {
      state = reducer(state, {type: actionTypes.REMOVE_TABLE_ROW, optionsMap: optionsMapRequiredFields, invalidateParentFieldOnError: true, rowIndex: 0});
      expect(state).toEqual({isValid: true,
        tableStateValue: [{key: 'bcd', value: {extract: 'f', generate: 'e'}}, {key: 'efg', value: {extract: 'k', generate: 'va'}}, {key: expect.anything(),
          value: {extract: '',
            generate: '' }}],
        touched: true});
    });
    test('should test remove table row actionType when invalidateParentFieldOnError is set to true and when optionsMap has RequireFields and should check whether the last row is deleted and validate isValid property', () => {
      state = reducer(state, {type: actionTypes.REMOVE_TABLE_ROW, optionsMap: optionsMapRequiredFields, invalidateParentFieldOnError: true, rowIndex: 1});
      expect(state).toEqual({isValid: true, tableStateValue: [{key: 'bcd', value: {extract: 'f', generate: 'e'}}, {key: expect.anything(), value: {extract: '', generate: ''}}], touched: true});
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
