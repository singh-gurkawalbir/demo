import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import actions from '../../../../../actions';
import HandlebarsPanel from '.';

jest.mock('../Code', () => ({
  __esModule: true,
  ...jest.requireActual('../Code'),
  default: props => (

    <input onChange={() => props.onChange('a')} data-testid="codepanel" />
  ),
}));
const initialStore = getCreatedStore();

function initHandlebarsPanel(props = {}) {
  const mustateState = draft => {
    draft.session.editors = {filecsv: {
      fieldId: 'file.csv',
      formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
      resourceId: '5b3c75dd5d3c125c88b5dd20',
      resourceType: 'imports',
      rule: 'initial feature value',
      editorType: 'jsonParser',
    }};
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<HandlebarsPanel {...props} />, {initialStore});
}

describe('handelbars UI tests', () => {
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
  test('should pass the initial render', () => {
    initHandlebarsPanel({editorId: 'filecsv'});
    const codePanel = screen.getByTestId('codepanel');

    expect(codePanel).toBeInTheDocument();
  });
  test('should make the respective dispatch call when content of the code panel is edited', async () => {
    initHandlebarsPanel({editorId: 'filecsv'});
    const codePanel = screen.getByTestId('codepanel');

    await userEvent.type(codePanel, 'a');
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.patchRule('filecsv', 'a')));
  });
});
