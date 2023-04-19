
import React from 'react';
import { screen, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import RunCell from '.';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../../../../RunFlowButton', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../RunFlowButton'),
  default: props => {
    const str = `Mocked RunFlowButton ${props.flowId}`;

    return (
      <><div>{str}</div><button type="button" onClick={props.onRunStart}>onRunStartButton</button></>
    );
  },
}));

async function initRunCell(props = {}) {
  const ui = (
    <MemoryRouter>
      <RunCell
        actionProps={{templateName: 'templateName', appName: 'appName'}}
        flowId="someflowId"
        {...props}
      />
    </MemoryRouter>
  );

  return render(ui);
}

describe('run cell UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should redirect to dashboard of standalone flow when flow starts', async () => {
    initRunCell();
    expect(screen.getByText('Mocked RunFlowButton someflowId')).toBeInTheDocument();
    await userEvent.click(screen.getByText('onRunStartButton'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/templates/templateName/none/dashboard');
  });
  test('should redirect to dashboard of provided integration when flow starts', async () => {
    initRunCell({flowId: 'someflowId', integrationId: 'someintegrationId' });
    expect(screen.getByText('Mocked RunFlowButton someflowId')).toBeInTheDocument();
    await userEvent.click(screen.getByText('onRunStartButton'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/templates/templateName/someintegrationId/dashboard');
  });
  test('should redirect to no template', async () => {
    render(
      <MemoryRouter>
        <RunCell
          integrationId="someintegrationId"
          actionProps={{ appName: 'appName'}}
          flowId="someflowId"
          />
      </MemoryRouter>);
    expect(screen.getByText('Mocked RunFlowButton someflowId')).toBeInTheDocument();
    await userEvent.click(screen.getByText('onRunStartButton'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/someintegrationId/dashboard');
  });
  test('should redirect to inetgration dashboard', async () => {
    render(
      <MemoryRouter>
        <RunCell
          integrationId="someintegrationId"
          actionProps={{ appName: 'appName'}}
          flowId="someflowId"
          />
      </MemoryRouter>);
    expect(screen.getByText('Mocked RunFlowButton someflowId')).toBeInTheDocument();
    await userEvent.click(screen.getByText('onRunStartButton'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/someintegrationId/dashboard');
  });
  test('should redirect to integration app with childId', async () => {
    render(
      <MemoryRouter>
        <RunCell
          childId="somechildId"
          isIntegrationApp
          integrationId="someintegrationId"
          actionProps={{ appName: 'appName'}}
          flowId="someflowId"
          />
      </MemoryRouter>);
    expect(screen.getByText('Mocked RunFlowButton someflowId')).toBeInTheDocument();
    await userEvent.click(screen.getByText('onRunStartButton'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/appName/someintegrationId/child/somechildId/dashboard');
  });
  test('should redirect to integration app with no childId', async () => {
    render(
      <MemoryRouter>
        <RunCell
          isIntegrationApp
          integrationId="someintegrationId"
          actionProps={{ appName: 'appName'}}
          flowId="someflowId"
          />
      </MemoryRouter>);
    expect(screen.getByText('Mocked RunFlowButton someflowId')).toBeInTheDocument();
    await userEvent.click(screen.getByText('onRunStartButton'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/appName/someintegrationId/dashboard');
  });
  test('should not redirect to any other url on run start when user is in ErrMgtTwoDotZero', async () => {
    render(
      <MemoryRouter>
        <RunCell
          isIntegrationApp
          integrationId="someintegrationId"
          actionProps={{ appName: 'appName', isUserInErrMgtTwoDotZero: true}}
          flowId="someflowId"
          />
      </MemoryRouter>);
    expect(screen.getByText('Mocked RunFlowButton someflowId')).toBeInTheDocument();
    await userEvent.click(screen.getByText('onRunStartButton'));
    expect(mockHistoryPush).not.toHaveBeenCalled();
  });
});
