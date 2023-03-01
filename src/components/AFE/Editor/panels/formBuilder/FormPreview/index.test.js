import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import {mutateStore, renderWithProviders} from '../../../../../../test/test-utils';
import actions from '../../../../../../actions';
import { getCreatedStore } from '../../../../../../store';

import CsvGeneratePanel from '.';

jest.mock('../../../../../DynaForm', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../DynaForm'),
  default: () => (
    <div>Dyna form</div>
  ),
}));
jest.mock('../../../../../DynaForm/DynaSubmit', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../DynaForm/DynaSubmit'),
  default: props => (
    <button type="button" onClick={props.onClick('data')}>Test Form</button>

  ),
}));
const initialStore = getCreatedStore();

function initFormPreview(props = {}) {
  const mustateState = draft => {
    draft.session.editors = {filecsv: {
      fieldId: 'file.csv',
      formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
      resourceId: '5b3c75dd5d3c125c88b5dd20',
      resourceType: 'imports',
      previewStatus: props.status,
      result: {
        data: 'custom value',
      },
    }};
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<CsvGeneratePanel {...props} />, {initialStore});
}
describe('csvGeneratePanel UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
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
    initFormPreview({editorId: 'filecsv', status: 'success'});
    expect(screen.getByText(/Test Form/i)).toBeInTheDocument();
  });
  test('should make the respective dispatch call when Test Form button is clicked', async () => {
    initFormPreview({editorId: 'filecsv', status: 'success'});
    await userEvent.click(screen.getByText(/Test Form/i));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.patchFeatures('filecsv', {formOutput: 'data'})));
  });
  test('should display the error message when there is an error', () => {
    initFormPreview({editorId: 'filecsv', status: 'error'});
    expect(screen.getByText('A preview of your settings form will appear once you add some valid form metadata or add an init hook.')).toBeInTheDocument();
  });
});

