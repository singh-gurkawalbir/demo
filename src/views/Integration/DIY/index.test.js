/* global describe, test, expect ,jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders} from '../../../test/test-utils';
import { runServer } from '../../../test/api/server';
import IntegrationDIY from '.';

jest.mock('../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/LoadResources'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));
jest.mock('./IntegrationTabs', () => ({
  __esModule: true,
  ...jest.requireActual('./IntegrationTabs'),
  default: () => (
    <div>
      IntegrationsTab
    </div>
  ),
}));
jest.mock('../../../components/drawer/Resource', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/drawer/Resource'),
  default: () => (
    <div>
      ResourceDrawer
    </div>
  ),
}));
jest.mock('../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer'),
  default: props => {
    const text = `QueuedJobsDrawer integrationId passed : ${props.integrationId}`;

    return (
      <div>
        {text}
      </div>
    );
  },
}));
jest.mock('./PageBar', () => ({
  __esModule: true,
  ...jest.requireActual('./PageBar'),
  default: () => (
    <div>
      PageBar
    </div>
  ),
}));
jest.mock('./TabRedirection', () => ({
  __esModule: true,
  ...jest.requireActual('./TabRedirection'),
  default: props => (
    <>
      <div>TabRedirection</div>
      <div>{props.children}</div>
    </>
  ),
}));
jest.mock('../../../components/AFE/Drawer', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/AFE/Drawer'),
  default: () => (
    <div>
      EditorDrawer
    </div>
  ),
}));

describe('IntegrationDIY UI tests', () => {
  runServer();
  test('should test the case when no Id is provided', () => {
    renderWithProviders(<MemoryRouter><IntegrationDIY /></MemoryRouter>);
    expect(screen.getByText('ResourceDrawer')).toBeInTheDocument();
    expect(screen.getByText('QueuedJobsDrawer integrationId passed : undefined')).toBeInTheDocument();
    expect(screen.getByText('TabRedirection')).toBeInTheDocument();
    expect(screen.getByText('PageBar')).toBeInTheDocument();
    expect(screen.getByText('IntegrationsTab')).toBeInTheDocument();
    expect(screen.getByText('EditorDrawer')).toBeInTheDocument();
  });
  test('should test the case when Id is provided', async () => {
    renderWithProviders(<MemoryRouter><IntegrationDIY integrationId="5f925c684109037fe51fbe8c" /></MemoryRouter>);
    expect(screen.getByText('ResourceDrawer')).toBeInTheDocument();
    expect(screen.getByText('QueuedJobsDrawer integrationId passed : 5f925c684109037fe51fbe8c')).toBeInTheDocument();
    expect(screen.getByText('TabRedirection')).toBeInTheDocument();
    expect(screen.getByText('PageBar')).toBeInTheDocument();
    expect(screen.getByText('IntegrationsTab')).toBeInTheDocument();
    expect(screen.getByText('EditorDrawer')).toBeInTheDocument();
  });
});
