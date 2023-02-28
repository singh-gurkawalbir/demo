
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import { MemoryRouter, Route} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {renderWithProviders, reduxStore, mutateStore} from '../../../../../../test/test-utils';
import { demoIntegrations, demoErrors, demoFlows, demoJobs } from '../index.test';
import FlowGroupRow from '.';

const initialStore = reduxStore;

function initFlowGroupRow(props = {}) {
  mutateStore(initialStore, draft => {
    draft.user.preferences = {
      environment: 'production',
      defaultAShareId: 'own',
    };
    draft.user.org = {
      users: [],
      accounts: [
        {
          _id: 'own',
          accessLevel: 'owner',
          ownerUser: {
            licenses: [],
          },
        },
      ],
    };
    draft.data.resources.exports = [{
      _id: '5ac5e4d75b88ee52fd41d188',
      createdAt: '2018-04-05T08:56:56.295Z',
      lastModified: '2021-11-15T06:17:42.689Z',
      name: 'expp',
      _connectionId: '5ac5e47106bd2615df9fba31',
      _integrationId: '62d826bf5645756e8300beac',
      _connectorId: '62712c1edd4afe56b5a10c3c',
      apiIdentifier: 'ec7c805b8b',
      asynchronous: true,
    }];
    draft.user.profile.useErrMgtTwoDotZero = true;
    draft.session.errorManagement.latestIntegrationJobDetails = demoJobs;
    draft.data.resources.flows = demoFlows;
    draft.session.errorManagement.openErrors = demoErrors;
    draft.data.resources.integrations = demoIntegrations;
  });
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/integrationapps/ShopifyMicrosoftDynamics365BusinessCentral/62d826bf5645756e8300beac/flows/sections/6257b33a722b313acd1df1bf'}]}>
      <Route
        path="/integrationapps/ShopifyMicrosoftDynamics365BusinessCentral/62d826bf5645756e8300beac/flows/sections/:sectionId"
            >
        <FlowGroupRow {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
jest.mock('../../../../../../components/Sortable/SortableHandle', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../components/Sortable/SortableHandle'),
  default: () =>
    (
      <div>SortableHandle</div>
    )
  ,
}));
jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

describe('FlowGroupRow UI tests', () => {
  test('should render empty DOM when sectionId is not present in the url', () => {
    const props = {rowData: {}, flows: []};
    const {utils} = renderWithProviders(<MemoryRouter><FlowGroupRow {...props} /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should render empty DOM when sectionId is unassigned and "hasUnassignedSection" is false', () => {
    const props = {rowData: {sectionId: 'unassigned'}, flows: [], hasUnassignedSection: false};
    const {utils} = renderWithProviders(<MemoryRouter><FlowGroupRow {...props} /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should not display the SortableHandle component by default', () => {
    const props = {rowData: {sectionId: 'unassigned'}, flows: []};

    renderWithProviders(<MemoryRouter><FlowGroupRow {...props} /></MemoryRouter>);
    expect(screen.queryByText('SortableHandle')).toBeNull();
  });
  test('should display the SortableHandle when hovered on section title and should not display it when cursor is removed from section title', async () => {
    const props = {rowData: {sectionId: '6257b33a722b313acd1df1bf', title: 'demo section'}, flows: []};

    initFlowGroupRow(props);
    await userEvent.hover(screen.getByText('demo section'));
    expect(screen.getByText('SortableHandle')).toBeInTheDocument();
    await userEvent.unhover(screen.getByText('demo section'));
    waitFor(() => expect(screen.queryByText('SortableHandle')).toBeNull());
  });
});
