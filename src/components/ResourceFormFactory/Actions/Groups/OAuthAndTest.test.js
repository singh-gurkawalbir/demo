/* global describe, expect, jest, test */
import React from 'react';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../../test/test-utils';
import OAuthAndTest from './OAuthAndTest';
import { getCreatedStore } from '../../../../store';
import actions from '../../../../actions';

jest.mock('./TestAndSave/TestButton', () => ({
  __esModule: true,
  ...jest.requireActual('./TestAndSave/TestButton'),
  default: jest.fn(props => (
    <div>
      <button type="button" {...props}>
        Test
      </button>
    </div>
  )),
}));

async function initOAuthAndTest(props = {}, initialStore) {
  const ui = (
    <MemoryRouter>
      <OAuthAndTest {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('test suite for OAuthAndTest', () => {
  test('should pass initial rendering', async () => {
    await initOAuthAndTest();
    const saveButton = screen.getByRole('button', {name: 'Save & authorize'});
    const closeButton = screen.getByRole('button', {name: 'Close'});
    const testButton = screen.getByRole('button', {name: 'Test'});

    expect(saveButton).toBeEnabled();
    expect(closeButton).toBeEnabled();
    expect(testButton).toBeEnabled();
  });

  test('should fetch the correct values of form', async () => {
    const resourceType = 'exports';
    const resourceId = '23hgk8';
    const KEY = `${resourceType}-${resourceId}`;
    const initialStore = getCreatedStore();

    initialStore.getState().session.asyncTask[KEY] = {
      status: 'loading',
    };
    initialStore.getState().comms.ping[resourceId] = {
      status: 'complete',
      message: 'A message',
    };
    await initOAuthAndTest({resourceType, resourceId}, initialStore);
    const saveButton = screen.getByRole('button', {name: 'Authorizing...'});
    const closeButton = screen.getByRole('button', {name: 'Close'});
    const testButton = screen.getByRole('button', {name: 'Test'});

    expect(saveButton).toBeDisabled();
    expect(closeButton).toBeDisabled();
    expect(testButton).toBeDisabled();
  });

  test('should close the form successfully', async () => {
    const onCancel = jest.fn();
    const resourceId = '23hgk8';
    const initialStore = getCreatedStore();

    initialStore.getState().comms.ping[resourceId] = {
      status: 'loading',
      message: 'A message',
    };
    await initOAuthAndTest({onCancel, resourceId}, initialStore);
    const closeButton = screen.getByRole('button', {name: 'Close'});

    expect(closeButton).toBeEnabled();
    userEvent.click(closeButton);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('should save the form successfully', async () => {
    const useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    const mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });

    useDispatchSpy.mockReturnValue(mockDispatchFn);
    const resourceType = 'exports';
    const resourceId = '23hgk8';
    const flowId = 'kjbd4';
    const integrationId = '34nbjs';
    const formKey = 'form-123';
    const initialStore = getCreatedStore();

    initialStore.getState().session.form[formKey] = {
      isValid: true,
      fields: {
        tempField: { touched: true },
      },
    };
    await initOAuthAndTest({resourceType, resourceId, flowId, integrationId, formKey}, initialStore);
    const saveButton = screen.getByRole('button', {name: 'Save & authorize'});

    expect(saveButton).toBeEnabled();
    userEvent.click(saveButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(
      actions.resource.connections.saveAndAuthorize(resourceId, {}, {flowId, integrationId})
    );
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
});
