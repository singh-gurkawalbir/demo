
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders} from '../../../../test/test-utils';
import IntegrationTabsComponent from '.';
import * as hooks from '../useAvailableTabs';
import FlowsPanel from '../panels/Flows';
import FlowsIcon from '../../../../components/icons/FlowsIcon';

describe('IntegrationTabsComponent UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  function renderFunction() {
    return renderWithProviders(<MemoryRouter><IntegrationTabsComponent /></MemoryRouter>);
  }
  test('should test for all default tabs', () => {
    renderFunction();

    expect(screen.getByText('Flows')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Audit log')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Aliases')).toBeInTheDocument();
    expect(screen.getByText('Revisions')).toBeInTheDocument();
  });
  test('should test when manually putting the tab', () => {
    jest.spyOn(hooks, 'useAvailableTabs').mockReturnValueOnce([{ path: 'flows', label: 'Flows', Icon: FlowsIcon, Panel: FlowsPanel }]);
    renderFunction();
    expect(screen.getByText('Flows')).toBeInTheDocument();
  });
  test('should test for no tab provided', () => {
    jest.spyOn(hooks, 'useAvailableTabs').mockReturnValueOnce([]);
    const {utils} = renderFunction();

    expect(utils.container.textContent).toBe('');
  });
});
