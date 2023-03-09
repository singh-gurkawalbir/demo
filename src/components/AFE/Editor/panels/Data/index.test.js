import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import actions from '../../../../../actions';
import { getCreatedStore } from '../../../../../store';
import DataPanel from '.';

jest.mock('../Code', () => ({
  __esModule: true,
  ...jest.requireActual('../Code'),
  default: props => (
    <>
      <div>{props.value}</div>
      <button type="button" onClick={() => props.onChange('new value')}>Data Panel</button>
    </>

  ),
}));
let initialStore = getCreatedStore();

function initDataPanel(props = {}) {
  const mustateState = draft => {
    draft.session.editors = {filecsv: {
      fieldId: 'file.csv',
      formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
      resourceId: '5b3c75dd5d3c125c88b5dd20',
      resourceType: 'imports',
      data: 'custom data',
      editorType: 'jsonParser',
    }};
    draft.session.form = {'imports-5b3c75dd5d3c125c88b5dd20': { fields: {
      'file.csv': {
        disabled: props.disabled,
      },
    },
    }};
    draft.data.resources = {
      imports: [{
        _id: '5b3c75dd5d3c125c88b5dd20',
        _connectionId: 'connection_id_1',
        adaptorType: 'HTTPImport',
        mappings: {
          fields: [{
            generate: 'generate_1',
          }, {
            generate: 'generate_2',
            lookupName: 'lookup_name',
          }],
          lists: [{
            generate: 'item',
            fields: [],
          }],
        },
        http: {
          requestMediaType: 'xml',
        },
      }],
    };
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<DataPanel {...props} />, {initialStore});
}
describe('aFE DataPanel UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should pass the initial render', async () => {
    const props = {
      mode: 'json',
      editorId: 'filecsv',
      disabled: false,
    };

    initDataPanel(props);
    await waitFor(() => expect(screen.getByText(/custom data/i, {exact: false})).toBeInTheDocument());
  });

  test('should make the respective dispatch call when data is changed in the panel', async () => {
    const props = {
      mode: 'json',
      editorId: 'filecsv',
      disabled: false,
    };

    initDataPanel(props);
    const DataPanel = screen.getByText('Data Panel');

    expect(DataPanel).toBeInTheDocument();

    await userEvent.click(DataPanel);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.patchData('filecsv', 'new value')));
  });
});
