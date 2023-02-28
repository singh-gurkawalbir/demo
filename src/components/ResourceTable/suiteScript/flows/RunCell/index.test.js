
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import RunCell from './index';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../../../../SuiteScript/RunFlowButton', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../SuiteScript/RunFlowButton'),
  default: props => (
    <>
      <button type="button" onClick={props.onRunStart} data-testid="text_button">
        RunFlowButton
      </button>
    </>
  ),
}));

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.data.suiteScript = {ssLinkedConnectionId: {integrations: [
    {
      _id: 'integrationId',
      urlName: 'someurl',
    }],
  },
  };
});

describe('suite script ScheduleCell ui test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should redirect to uknown location when flow data is not provided', async () => {
    renderWithProviders(<MemoryRouter><RunCell flow={{}} /> </MemoryRouter>);
    const button = screen.getByRole('button');

    await userEvent.click(button);
    expect(mockHistoryPush).toHaveBeenCalledWith('/suitescript/undefined/integrations/undefined/dashboard');
  });
  test('should redirect to inetgartion Apps URL  proper location', async () => {
    renderWithProviders(
      <MemoryRouter>
        <RunCell ssLinkedConnectionId="ssLinkedConnectionId" flow={{_id: 'flowId', _integrationId: 'integrationId'}} />
      </MemoryRouter>, {initialStore});
    const button = screen.getByRole('button');

    await userEvent.click(button);
    expect(mockHistoryPush).toHaveBeenCalledWith('/suitescript/ssLinkedConnectionId/integrationapps/someurl/integrationId/dashboard');
  });
  test('should redirect to  proper location', async () => {
    renderWithProviders(
      <MemoryRouter>
        <RunCell ssLinkedConnectionId="ssLinkedConnectionId" flow={{_id: 'flowId', _integrationId: '_integrationId'}} />
      </MemoryRouter>, {initialStore});
    const button = screen.getByRole('button');

    await userEvent.click(button);
    expect(mockHistoryPush).toHaveBeenCalledWith('/suitescript/ssLinkedConnectionId/integrations/_integrationId/dashboard');
  });
  test('should call the onRunStart function when provided as pramater', async () => {
    const onRunStart = jest.fn();

    renderWithProviders(
      <MemoryRouter>
        <RunCell flow={{}} onRunStart={onRunStart} ssLinkedConnectionId="ssLinkedConnectionId" />
      </MemoryRouter>);
    const button = screen.getByRole('button');

    await userEvent.click(button);
    expect(onRunStart).toHaveBeenCalled();
  });
});
