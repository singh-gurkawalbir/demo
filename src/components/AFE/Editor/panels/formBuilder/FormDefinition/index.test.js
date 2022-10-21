/* global describe, test, expect, jest, beforeEach, afterEach */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders } from '../../../../../../test/test-utils';
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
  initialStore.getState().session.editors = {'5b3c75dd5d3c125c88b5dd02': {
    fieldId: 'file.csv',
    formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
    resourceId: '5b3c75dd5d3c125c88b5dd20',
    resourceType: 'imports',
    autoEvaluate: true,
    data: 'initial feature value',
    editorType: 'jsonParser',
  }};

  return renderWithProviders(<FormDefinitonPanel {...props} />, {initialStore});
}
describe('AFE DataPanel UI tests', () => {
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
      editorId: '5b3c75dd5d3c125c88b5dd02',
    };

    initFormDefinitonPanel(props);
    expect(screen.getByText('initial feature value')).toBeInTheDocument();
  });

  test('should make the respective dispatch call when data is changed in the panel', async () => {
    const props = {
      mode: 'json',
      editorId: '5b3c75dd5d3c125c88b5dd02',
    };

    initFormDefinitonPanel(props);
    const CodePanel = screen.getByText('Code Panel');

    expect(CodePanel).toBeInTheDocument();

    userEvent.click(CodePanel);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.editor.patchFeatures('5b3c75dd5d3c125c88b5dd02', {data: 'new feature value'})));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.editor.toggleAutoPreview('5b3c75dd5d3c125c88b5dd02', true)));
  });
});
