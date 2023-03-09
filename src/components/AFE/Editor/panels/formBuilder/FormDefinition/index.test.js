import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { mutateStore, renderWithProviders } from '../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../store';
import FormDefinitonPanel from '.';
import actions from '../../../../../../actions';

jest.mock('../../Code', () => ({
  __esModule: true,
  ...jest.requireActual('../../Code'),
  default: props => (
    <>
      <div>{props.value}</div>
      <button type="button" onClick={props.onChange('new feature value')}>Code Panel</button>
    </>

  ),
}));
let initialStore = getCreatedStore();

function initFormDefinitonPanel(props = {}) {
  const mustateState = draft => {
    draft.session.editors = {filecsv: {
      fieldId: 'file.csv',
      formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
      resourceId: '5b3c75dd5d3c125c88b5dd20',
      resourceType: 'imports',
      autoEvaluate: true,
      data: 'initial feature value',
      editorType: 'jsonParser',
    }};
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<FormDefinitonPanel {...props} />, {initialStore});
}
describe('aFE DataPanel UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
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
    const props = {
      mode: 'json',
      editorId: 'filecsv',
    };

    initFormDefinitonPanel(props);
    expect(screen.getByText('initial feature value')).toBeInTheDocument();
  });

  test('should make the respective dispatch call when data is changed in the panel', async () => {
    const props = {
      mode: 'json',
      editorId: 'filecsv',
    };

    initFormDefinitonPanel(props);
    const CodePanel = screen.getByText('Code Panel');

    expect(CodePanel).toBeInTheDocument();

    await userEvent.click(CodePanel);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.patchFeatures('filecsv', {data: 'new feature value'})));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.toggleAutoPreview('filecsv', true)));
  });
});
