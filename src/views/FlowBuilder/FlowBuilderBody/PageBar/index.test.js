
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {mutateStore, reduxStore, renderWithProviders} from '../../../../test/test-utils';
import PageBar from '.';

function initPageBar(props = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources.flows = [{
      _id: '62c6f122a2f4a703c3dee3d0',
      lastModified: '2022-07-07T14:46:06.187Z',
      name: 'New flow',
      disabled: false,
      _integrationId: '6253af74cddb8a1ba550a010',
      isSimpleImport: true,
      schedule: props.schedule,
      skipRetries: false,
      _connectorId: props.connId,
      pageProcessors: [
        {
          responseMapping: {
            fields: [],
            lists: [],
          },
          type: 'import',
          _importId: '62c6f15aae93a81493321a87',
        },
      ],
      pageGenerators: [
        {
          _exportId: '62c6f121a2f4a703c3dee3ce',
          skipRetries: false,
        },
      ],
      createdAt: '2022-07-07T14:43:46.730Z',
      lastExecutedAt: '2022-07-07T14:46:57.185Z',
      autoResolveMatchingTraceKeys: true,
    }];
    draft.data.resources.integrations = [{
      _id: '6253af74cddb8a1ba550a010',
      lastModified: '2022-06-30T06:39:32.607Z',
      name: 'demoint',
      description: 'demo integration',
      install: [],
      sandbox: false,
      _registeredConnectionIds: [
        '62bd43c87b94d20de64e9ab3',
        '62bd452420ecb90e02f2a6f0',
      ],
      installSteps: [],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2022-04-11T04:32:52.823Z',
    }];
    draft.data.resources.exports = [{
      _id: '62c6f121a2f4a703c3dee3ce',
      createdAt: '2022-07-07T14:43:45.064Z',
      lastModified: '2022-07-07T14:43:45.114Z',
      name: 'demoexp',
      _connectionId: '62bd43c87b94d20de64e9ab3',
      apiIdentifier: 'e9de6ee3c5',
      asynchronous: true,
      oneToMany: false,
      sandbox: false,
      parsers: [],
      type: props.type,
      http: {
        relativeURI: 'demo',
        method: 'GET',
        successMediaType: 'json',
        errorMediaType: 'json',
        formType: 'rest',
        paging: {},
      },
      adaptorType: 'HTTPExport',
      _rest: {
        relativeURI: 'demo',
      },
    }];
    draft.user.profile = {useErrMgtTwoDotZero: true};
    draft.user.preferences = {defaultAShareId: false};
    draft.session.errorManagement.openErrors['62c6f122a2f4a703c3dee3d0'] = {
      status: 'received',
      data: {
        '62c6f121a2f4a703c3dee3ce': {
          _expOrImpId: '62c6f121a2f4a703c3dee3ce',
          numError: props.numErrors,
          lastErrorAt: '2022-08-08T13:44:03.841Z',
        },
      },
    };
  });

  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/integrations/6253af74cddb8a1ba550a010/flowBuilder/62c6f122a2f4a703c3dee3d0'}]} >
      <Route
        path="/integrations/:integrationId/flowBuilder/:flowId"
            >
        <PageBar {...props} />
      </Route>
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}
jest.mock('../../../../components/icons/CalendarIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/icons/CalendarIcon'),
  default: () =>
    (
      <div>FlowSchedule Icon</div>
    )
  ,
}));
jest.mock('../../../../components/FlowToggle', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/FlowToggle'),
  default: () =>
    (
      <div>FlowToggle Button</div>
    )
  ,
}));
jest.mock('../../LineGraphButton', () => ({
  __esModule: true,
  ...jest.requireActual('../../LineGraphButton'),
  default: props =>
    (
      // eslint-disable-next-line react/button-has-type
      <div><button onClick={props.onClickHandler}>LineGraph Button</button></div>
    )
  ,
}));
jest.mock('../../../../components/FlowEllipsisMenu', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/FlowEllipsisMenu'),
  default: () =>
    (
      <div>FlowEllipsis Icon</div>
    )
  ,
}));
jest.mock('../../LastRun', () => ({
  __esModule: true,
  ...jest.requireActual('../../LastRun'),
  default: () =>
    (
      <div>LastRun</div>
    )
  ,
}));
describe('FlowBuilder Body PageBar UI tests', () => {
  test('should display the flowSchedule icon for Flows with export type which are not simple,distributed or webhook', () => {
    const props = {flowId: '62c6f122a2f4a703c3dee3d0', integrationId: '6253af74cddb8a1ba550a010'};

    initPageBar(props);

    expect(screen.getByText('FlowSchedule Icon')).toBeInTheDocument();
  });
  test('should not display the flowSchedule icon when export type is either "distributed" or "webhook"', () => {
    const props = {flowId: '62c6f122a2f4a703c3dee3d0', integrationId: '6253af74cddb8a1ba550a010'};

    initPageBar(props);
    props.type = 'distributed';
    initPageBar(props);
    expect(screen.queryByTestId('FlowSchedule Icon')).toBeNull();
  });
  test('should display the flowToggle button for which are not dataLoader flows', () => {
    const props = {flowId: '62c6f122a2f4a703c3dee3d0', integrationId: '6253af74cddb8a1ba550a010'};

    initPageBar(props);
    expect(screen.getByText('FlowToggle Button')).toBeInTheDocument();
  });
  test('should display the LineGraph Button when "isUserInErrMgtTwoDotZero" is true', async () => {
    const props = {flowId: '62c6f122a2f4a703c3dee3d0', integrationId: '6253af74cddb8a1ba550a010'};

    initPageBar(props);
    await waitFor(() => expect(screen.getByText('LineGraph Button')).toBeInTheDocument());
  });
  test('should display the flowEllipsis menu for flows containing connectorId', () => {
    const props = {flowId: '62c6f122a2f4a703c3dee3d0', integrationId: '6253af74cddb8a1ba550a010'};

    initPageBar(props);
    expect(screen.getByText('FlowEllipsis Icon')).toBeInTheDocument();
  });
  test('should not display the flowEllipsis menu for flows containing connectorId', () => {
    const props = {flowId: '62c6f122a2f4a703c3dee3d0', integrationId: '6253af74cddb8a1ba550a010', connId: '1234567890123456'};

    initPageBar(props);
    expect(screen.queryByText('FlowEllipsis Icon')).toBeNull();
  });
  test('should display the number of errors in the flow whenever applicable', () => {
    const props = {flowId: '62c6f122a2f4a703c3dee3d0', integrationId: '6253af74cddb8a1ba550a010', numErrors: 2};

    initPageBar(props);
    expect(screen.queryByText('2 errors')).toBeInTheDocument();
  });
  test('should not display the error status when errors are not encountered', () => {
    const props = {flowId: '62c6f122a2f4a703c3dee3d0', integrationId: '6253af74cddb8a1ba550a010', numErrors: 0};

    initPageBar(props);
    expect(screen.queryByText('2 errors')).toBeNull();
  });
  test('should display the EditableText component to display the title', async () => {
    const props = {flowId: '62c6f122a2f4a703c3dee3d0', integrationId: '6253af74cddb8a1ba550a010'};

    initPageBar(props);
    const editableText = await waitFor(() => screen.getByText('New flow'));

    await userEvent.click(editableText);
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('New flow'));
  });
  test('should display the last saved time as never for new flows', () => {
    const props = {flowId: 'newFlowId_12345', integrationId: '6253af74cddb8a1ba550a010'};

    initPageBar(props);
    expect(screen.getByText('Last saved:')).toBeInTheDocument();
    expect(screen.getByText('Never')).toBeInTheDocument();
  });
  test('should display the last saved time as the lastModified time for used flows', () => {
    const props = {flowId: '62c6f122a2f4a703c3dee3d0', integrationId: '6253af74cddb8a1ba550a010'};

    initPageBar(props);
    expect(screen.getByText('Last saved:')).toBeInTheDocument();
    expect(screen.getByText('07/07/2022 2:46:06 pm')).toBeInTheDocument();
  });
  test('should render the LastRun component when "isUserInErrMgtTwoDotZero" is true', async () => {
    const props = {flowId: '62c6f122a2f4a703c3dee3d0', integrationId: '6253af74cddb8a1ba550a010'};

    initPageBar(props);
    await waitFor(() => expect(screen.getByText('LastRun')).toBeInTheDocument());
  });
  test('should show icon indicator if the flow is scheduled', () => {
    const props = {flowId: '62c6f122a2f4a703c3dee3d0', integrationId: '6253af74cddb8a1ba550a010', schedule: '? 5 13 ? * 5'};

    initPageBar(props);
    expect(document.querySelector('[class*=makeStyles-circle]')).toBeInTheDocument();
  });
  test('should not show icon indicator if the flow is not scheduled', () => {
    const props = {flowId: '62c6f122a2f4a703c3dee3d0', integrationId: '6253af74cddb8a1ba550a010'};

    initPageBar(props);
    expect(document.querySelector('[class*=makeStyles-circle]')).not.toBeInTheDocument();
  });
});

