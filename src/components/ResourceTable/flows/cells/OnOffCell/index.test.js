/* global describe, test,expect, jest, beforeEach, afterEach */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore} from '../../../../../test/test-utils';
import OnOffCell from '.';
import actions from '../../../../../actions';
import {ConfirmDialogProvider} from '../../../../ConfirmDialog';
import * as mockEnqueSnackbar from '../../../../../hooks/enqueueSnackbar';
import messageStore from '../../../../../utils/messageStore';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

const end = new Date();

end.setMonth(end.getMonth() - 2);

initialStore.getState().user.preferences = {defaultAShareId: '5e32a35e7380e67af84aa84e' };

initialStore.getState().user.org.accounts = [
  {
    _id: '5e32a35e7380e67af84aa84e',
    accepted: true,
    integrationAccessLevel: [
      {
        _integrationId: '5a6ec243e9aaa11c9bc86107',
        accessLevel: 'manage',
      },
    ],
    ownerUser: {
      _id: '57ba9c1dc3432f661abf4e67',
      timezone: 'Asia/Calcutta',
      licenses: [
        {
          _id: '57ba9c1ec3432f661abf4e68',
          type: 'diy',
          hasSubscription: true,
          expires: '2016-08-22T06:30:54.524Z',
          usageTier: 'free',
          resumable: false,
        },
      ],
    },
  },
];

function initonoffCell(props = {}, initialStore = null) {
  const ui = (
    <ConfirmDialogProvider>
      <OnOffCell
        {...props}
             />
    </ConfirmDialogProvider>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('On/Off cell UI test case', () => {
  const enqueueSnackbar = jest.fn();

  beforeEach(() => {
    jest.spyOn(mockEnqueSnackbar, 'default').mockReturnValue([enqueueSnackbar]);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show empty dom when flow is enable locked', () => {
    const {utils} = renderWithProviders(
      <ConfirmDialogProvider>
        <OnOffCell
          actionProps={{flowAttributes: {someflowId: {isFlowEnableLocked: true}}}}
          flowId="someflowId"
          integrationId="someintegrationId"
          childId="somechildId"
             />
      </ConfirmDialogProvider>);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should click to disable the on/off checkbox', () => {
    const props = {
      actionProps: {flowAttributes: {}},
      flowId: 'someflowId',
      integrationId: 'someintegrationId',
      childId: 'somechildId',
    };

    initonoffCell(props);
    userEvent.click(screen.getByRole('checkbox'));
    userEvent.click(screen.getByText('Disable'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.flow.isOnOffActionInprogress(true, 'someflowId')
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.resource.patchAndCommitStaged('flows', 'someflowId', [{ op: 'replace', path: '/disabled', value: true }], {
        options: {
          action: 'flowEnableDisable',
        },
      })
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should click to enable the on/off checkbox', () => {
    const props = {
      actionProps: {flowAttributes: {}},
      flowId: 'someflowId',
      integrationId: 'someintegrationId',
      childId: 'somechildId',
      disabled: true,
    };

    initonoffCell(props);
    userEvent.click(screen.getByRole('checkbox'));
    userEvent.click(screen.getByText('Enable'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.flow.isOnOffActionInprogress(true, 'someflowId')
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.resource.patchAndCommitStaged('flows', 'someflowId', [{ op: 'replace', path: '/disabled', value: false }], {
        options: {
          action: 'flowEnableDisable',
        },
      })
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should show snackbar message when license not valid to enable', () => {
    const props = {
      actionProps: {flowAttributes: {}},
      flowId: 'someflowId',
      integrationId: 'someintegrationId',
      childId: 'somechildId',
      disabled: true,
    };

    initonoffCell(props, initialStore);
    userEvent.click(screen.getByRole('checkbox'));
    userEvent.click(screen.getByText('Enable'));
    expect(enqueueSnackbar).toHaveBeenCalledWith(
      {
        variant: 'error',
        message: messageStore('LICENSE_EXPIRED'),
      }
    );
  });
  test('should not call enqueue snack bar when licnese is free', () => {
    const props = {
      actionProps: {flowAttributes: {}},
      flowId: 'someflowId',
      integrationId: 'someintegrationId',
      childId: 'somechildId',
      disabled: true,
    };

    initonoffCell(props);
    userEvent.click(screen.getByRole('checkbox'));
    userEvent.click(screen.getByText('Enable'));
    expect(enqueueSnackbar).not.toHaveBeenCalled();
  });
  test('should not call enqueue snack bar when flow is DataLoader', () => {
    const props = {
      actionProps: {flowAttributes: {someflowId: {isDataLoader: true}}},
      flowId: 'someflowId',
      integrationId: 'someintegrationId',
      childId: 'somechildId',
      disabled: true,
    };

    initonoffCell(props);
    userEvent.click(screen.getByRole('checkbox'));
    userEvent.click(screen.getByText('Enable'));
    expect(enqueueSnackbar).not.toHaveBeenCalled();
  });
  test('should not call enqueue snack bar when flow belong to 2.0 framework', () => {
    const props = {
      actionProps: {integration: {installSteps: [1]}, flowAttributes: {}},
      flowId: 'someflowId',
      integrationId: 'someintegrationId',
      childId: 'somechildId',
      disabled: true,
    };

    initonoffCell(props);
    userEvent.click(screen.getByRole('checkbox'));
    userEvent.click(screen.getByText('Enable'));
    expect(enqueueSnackbar).not.toHaveBeenCalled();
  });
  test('should click on the disable for integrator app', () => {
    const props = {
      actionProps: {flowAttributes: {}},
      isIntegrationApp: true,
      flowId: 'someflowId',
      integrationId: 'someintegrationId',
      childId: 'somechildId',
    };

    initonoffCell(props);
    userEvent.click(screen.getByRole('checkbox'));
    userEvent.click(screen.getByText('Disable'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.flow.isOnOffActionInprogress(true, 'someflowId')
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      actions.integrationApp.settings.update(
        'someintegrationId',
        'someflowId',
        'somechildId',
        null,
        {
          '/flowId': 'someflowId',
          '/disabled': true,
        },
        { action: 'flowEnableDisable' }
      )
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
