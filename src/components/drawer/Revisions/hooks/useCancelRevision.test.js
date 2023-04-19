
import React from 'react';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import useCancelRevision from './useCancelRevision';
import {ConfirmDialogProvider} from '../../../ConfirmDialog';
import actions from '../../../../actions';

const mockClose = jest.fn();
const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));

const props = { integrationId: '_integrationId', revisionId: '_revId', onClose: mockClose };

const MockComponent = props => {
  const handleCancel = useCancelRevision(props);

  return <button type="button" onClick={handleCancel}>Cancel</button>;
};

async function inituseCancelRevision(props = {}, type = 'pull') {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.revisions = {
      _integrationId: {
        data: [{_id: '_revId', type}],
      },
    };
  });

  return renderWithProviders(<ConfirmDialogProvider><MockComponent {...props} /></ConfirmDialogProvider>, {initialStore});
}
describe('useCancelRevision tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

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
    mockClose.mockClear();
  });
  test('Should able to test the hook with revisionType as none', async () => {
    await inituseCancelRevision(props, '');
    const cancelBtn = screen.getByRole('button', {name: 'Cancel'});

    expect(cancelBtn).toBeInTheDocument();
    await userEvent.click(cancelBtn);
  });

  test('Should able to test the hook with revisionType as revert', async () => {
    await inituseCancelRevision(props, 'revert');
    const cancelBtn = screen.getByRole('button', {name: 'Cancel'});

    expect(cancelBtn).toBeInTheDocument();
    await userEvent.click(cancelBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('You\'ve got a revert in progress')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to close this installer? The merges you made for this revert will be canceled')).toBeInTheDocument();
    const cancel = screen.getByRole('button', {name: 'Cancel merge'});

    await userEvent.click(cancel);
    expect(mockClose).toHaveBeenCalled();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.revision.cancel('_integrationId', '_revId'));
  });

  test('Should able to test the hook with revisionType as pull', async () => {
    await inituseCancelRevision({...props, onClose: {}});
    const cancelBtn = screen.getByRole('button', {name: 'Cancel'});

    expect(cancelBtn).toBeInTheDocument();
    await userEvent.click(cancelBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('You\'ve got a merge in progress')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to close this installer? Your current merge in progress for your pull will be canceled')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Continue merge'})).toBeInTheDocument();
    const cancel = screen.getByRole('button', {name: 'Cancel merge'});

    await userEvent.click(cancel);
    expect(mockClose).not.toHaveBeenCalled();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.revision.cancel('_integrationId', '_revId'));
  });
});
