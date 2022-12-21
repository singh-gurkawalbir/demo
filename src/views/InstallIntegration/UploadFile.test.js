/* global describe, test, expect, jest, beforeEach, afterEach */
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Router} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import {createMemoryHistory} from 'history';
import * as reactRedux from 'react-redux';
import {renderWithProviders } from '../../test/test-utils';
import { getCreatedStore } from '../../store';
import actions from '../../actions';
import UploadFile from '.';

const history = createMemoryHistory();
let initialStore;

function initUploadFile(props) {
  initialStore = getCreatedStore();

  initialStore.getState().session.templates.template1 = props.obj;
  const ui = (<Router history={props.history} ><UploadFile {...props} /></Router>);

  return renderWithProviders(ui, {initialStore});
}

describe('UploadFile UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });
  test('should pass the initial render ', () => {
    const props = {history, obj: {installIntegration: true}};

    initUploadFile(props);
    expect(screen.getByText('Select template zip file')).toBeInTheDocument();
    expect(screen.getByText(/Upload Integration zip file/i)).toBeInTheDocument();
  });
  test('should make the respective dispatch call and display the uploading message when a file is uploaded', async () => {
    const props = {history, obj: {installIntegration: false}};
    const fakeFile = new File(['hello'], 'hello.png', { type: 'image/png' });

    initUploadFile(props);

    const uploadField = document.querySelector('[data-test="uploadFile"]');

    await waitFor(() => userEvent.upload(uploadField, fakeFile));
    expect(mockDispatchFn).toBeCalledWith(actions.file.previewZip(fakeFile));
    await waitFor(() => expect(screen.getByText(/uploading/i)).toBeInTheDocument());
  });
  test('should make the respective dispatch call and redirection when file is uploaded on initial render', async () => {
    const props = {history, obj: {isInstallIntegration: true}};

    history.push = jest.fn();

    initUploadFile(props);
    waitFor(() => expect(history.push).toBeCalledWith('/templates/template1/preview'));
    waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.template.clearUploaded('template1')));
  });
});
