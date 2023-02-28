
import React from 'react';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import RevisionHeader from '.';
import actions from '../../../../../actions';
import {ConfirmDialogProvider} from '../../../../ConfirmDialog';

const mockClose = jest.fn();
const props = {integrationId: '_integrationId', revisionId: '_revisionId', mode: 'review', onClose: mockClose};

async function initRevisionHeader(props = {}, status = 'recieved', type = 'revert') {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.lifeCycleManagement = {
      compare: {
        _integrationId: {
          status,
        },
      },
      revision: {
        _integrationId: {
          _revisionId: {
            type,
          },
        },
      },
    };
    draft.data.revisions = {
      _integrationId: {
        data: [{
          _id: '_revisionId',
          type,
        }],
      },
    };
  });

  return renderWithProviders(<ConfirmDialogProvider> <RevisionHeader {...props} /> </ConfirmDialogProvider>, {initialStore});
}
describe('RevisionHeader tests', () => {
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
    mockDispatchFn.mockClear();
  });
  test('Should able to test the initial render with mode: REVIEW type revert', async () => {
    await initRevisionHeader(props);
    expect(screen.getByRole('button', {name: 'Expand all'})).toBeInTheDocument();
    const refreshIcon = screen.getAllByRole('button').find(btn => btn.getAttribute('data-test') === 'expandAll');

    // RefreshIcon's data-test can be corrected //
    expect(refreshIcon).toBeEnabled();
    await userEvent.click(refreshIcon);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.compare.revertRequest('_integrationId', '_revisionId'));
  });
  test('Should able to test the initial render with mode: REVIEW type pull', async () => {
    await initRevisionHeader(props, 'received', 'pull');
    const refreshIcon = screen.getAllByRole('button').find(btn => btn.getAttribute('data-test') === 'expandAll');

    await userEvent.click(refreshIcon);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.compare.pullRequest('_integrationId', '_revisionId'));
    expect(screen.getByText('0 conflicts')).toBeInTheDocument();
  });
  test('Should able to test the initial render with mode: REVIEW type !(PULL | REVERT)', async () => {
    await initRevisionHeader(props, 'received', '');
    const refreshIcon = screen.getAllByRole('button').filter(btn => btn.getAttribute('data-test') === 'expandAll');

    expect(refreshIcon).toHaveLength(1);
    expect(screen.queryByText('0 conflicts')).not.toBeInTheDocument();
  });
  test('Should able to test the initial render with mode: REVIEW, status: inProgress', async () => {
    await initRevisionHeader(props, 'requested');
    const refreshIcon = screen.getAllByRole('button').find(btn => btn.getAttribute('data-test') === 'expandAll');

    expect(refreshIcon).toBeDisabled();
  });

  test('Should able to test the initial render with mode: INSTALL, revision type: revert', async () => {
    await initRevisionHeader({...props, mode: 'install'}, 'requested');
    expect(screen.queryByText('Expand all')).not.toBeInTheDocument();
    const cancelRevision = screen.getByRole('button', {name: 'Cancel revert'});

    // CancelRevisionIcon's data-test can be corrected //
    expect(cancelRevision).toBeInTheDocument();
    expect(cancelRevision).toBeEnabled();
    await userEvent.click(cancelRevision);
  });

  test('Should able to test the initial render with mode: INSTALL, revision type: pull', async () => {
    await initRevisionHeader({...props, mode: 'install'}, 'requested', 'pull');
    expect(screen.queryByText('Expand all')).not.toBeInTheDocument();
    const cancelRevision = screen.getByRole('button', {name: 'Cancel merge'});

    expect(cancelRevision).toBeEnabled();
    await userEvent.click(cancelRevision);
  });
});
