
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore} from '../../../../../test/test-utils';
import OnOffCell from '.';
import actions from '../../../../../actions';
import {ConfirmDialogProvider} from '../../../../ConfirmDialog';
import * as mockEnqueSnackbar from '../../../../../hooks/enqueueSnackbar';
import { message } from '../../../../../utils/messageStore';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

const end = new Date();

end.setMonth(end.getMonth() - 2);

mutateStore(initialStore, draft => {
  draft.user.preferences = {defaultAShareId: '5e32a35e7380e67af84aa84e' };

  draft.user.org.accounts = [
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
});

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

describe('on/Off cell UI test case', () => {
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
  test('should click to disable the on/off checkbox', async () => {
    const props = {
      actionProps: {flowAttributes: {}},
      flowId: 'someflowId',
      integrationId: 'someintegrationId',
      childId: 'somechildId',
    };

    initonoffCell(props);
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByText('Disable'));
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
  test('should click to enable the on/off checkbox', async () => {
    const props = {
      actionProps: {flowAttributes: {}},
      flowId: 'someflowId',
      integrationId: 'someintegrationId',
      childId: 'somechildId',
      disabled: true,
    };

    initonoffCell(props);
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByText('Enable'));
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
  test('should show snackbar message when license not valid to enable', async () => {
    const props = {
      actionProps: {flowAttributes: {}},
      flowId: 'someflowId',
      integrationId: 'someintegrationId',
      childId: 'somechildId',
      disabled: true,
    };

    initonoffCell(props, initialStore);
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByText('Enable'));
    expect(enqueueSnackbar).toHaveBeenCalledWith(
      {
        variant: 'error',
        message: message.SUBSCRIPTION.LICENSE_EXPIRED,
      }
    );
  });
  test('should not call enqueue snack bar when licnese is free', async () => {
    const props = {
      actionProps: {flowAttributes: {}},
      flowId: 'someflowId',
      integrationId: 'someintegrationId',
      childId: 'somechildId',
      disabled: true,
    };

    initonoffCell(props);
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByText('Enable'));
    expect(enqueueSnackbar).not.toHaveBeenCalled();
  });
  test('should not call enqueue snack bar when flow is DataLoader', async () => {
    const props = {
      actionProps: {flowAttributes: {someflowId: {isDataLoader: true}}},
      flowId: 'someflowId',
      integrationId: 'someintegrationId',
      childId: 'somechildId',
      disabled: true,
    };

    initonoffCell(props);
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByText('Enable'));
    expect(enqueueSnackbar).not.toHaveBeenCalled();
  });
  test('should not call enqueue snack bar when flow belong to 2.0 framework', async () => {
    const props = {
      actionProps: {integration: {installSteps: [1]}, flowAttributes: {}},
      flowId: 'someflowId',
      integrationId: 'someintegrationId',
      childId: 'somechildId',
      disabled: true,
    };

    initonoffCell(props);
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByText('Enable'));
    expect(enqueueSnackbar).not.toHaveBeenCalled();
  });
  test('should click on the disable for integrator app', async () => {
    const props = {
      actionProps: {flowAttributes: {}},
      isIntegrationApp: true,
      flowId: 'someflowId',
      integrationId: 'someintegrationId',
      childId: 'somechildId',
    };

    initonoffCell(props);
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByText('Disable'));
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
