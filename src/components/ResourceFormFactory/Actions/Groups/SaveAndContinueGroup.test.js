
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import actions from '../../../../actions';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import SaveAndContinueGroup from './SaveAndContinueGroup';
import { getCreatedStore } from '../../../../store';

const mockUseRouteMatch = jest.fn(() => 'MATCH');

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useRouteMatch: jest.fn(() => mockUseRouteMatch()),
}));

async function initSaveAndContinueGroup(props = {}, initialStore) {
  const ui = (
    <MemoryRouter>
      <SaveAndContinueGroup {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('test suite for SaveAndContinueGroup', () => {
  let useDispatchSpy;
  let mockDispatchFn;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should pass initial rendering', async () => {
    await initSaveAndContinueGroup();
    const saveButton = screen.getByRole('button', {name: 'Save & continue'});
    const closeButton = screen.getByRole('button', {name: 'Close'});

    expect(saveButton).toBeDisabled();
    expect(closeButton).toBeEnabled();
    expect(mockUseRouteMatch).toBeCalled();
  });

  test('should pass the correct formSaveStatus', async () => {
    const resourceType = 'exports';
    const resourceId = '123asd';
    const KEY = `${resourceType}-${resourceId}`;
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.asyncTask[KEY] = {
        status: 'loading',
      };
    });

    await initSaveAndContinueGroup({resourceType, resourceId}, initialStore);
    const saveButton = screen.getByRole('button', {name: 'Saving...'});
    const closeButton = screen.getByRole('button', {name: 'Close'});

    expect(saveButton).toBeDisabled();
    expect(closeButton).toBeDisabled();
  });

  test('should be able to close successfully', async () => {
    const onCancel = jest.fn();

    await initSaveAndContinueGroup({onCancel});
    const closeButton = screen.getByRole('button', {name: 'Close'});

    await userEvent.click(closeButton);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('should be able to save successfully', async () => {
    const formKey = 'form-123';
    const resourceType = 'exports';
    const resourceId = '123asd';
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[formKey] = {
        isValid: true,
        value: {
          '/_borrowConcurrencyFromConnectionId': false,
        },
        fields: {
          tempField: { touched: true },
        },
      };
    });

    await initSaveAndContinueGroup({formKey, resourceType, resourceId}, initialStore);
    const saveButton = screen.getByRole('button', {name: 'Save & continue'});

    expect(saveButton).toBeEnabled();
    await userEvent.click(saveButton);
    expect(mockDispatchFn).toBeCalledWith(actions.resourceForm.saveAndContinue(
      resourceType, resourceId, {}, 'MATCH', false, {}
    ));
  });

  test('should not render buttons if oauth values are not correct for http form', async () => {
    const formKey = 'form-123';
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[formKey] = {
        isValid: true,
        value: {
          '/http/_iClientId': 'ic-123',
          '/http/auth/type': 'oauth',
        },
        fields: {
          tempField: { touched: true },
        },
      };
      draft.data.resources.iClients = [{
        _id: 'ic-123',
        oauth2: {
          grantType: '',
        },
      }];
    });

    await initSaveAndContinueGroup({isHTTPForm: true, formKey}, initialStore);

    expect(screen.queryByText('Save & continue')).not.toBeInTheDocument();
    expect(screen.queryByText('Close')).not.toBeInTheDocument();
    expect(screen.queryByText('Test connection')).not.toBeInTheDocument();
  });
});
