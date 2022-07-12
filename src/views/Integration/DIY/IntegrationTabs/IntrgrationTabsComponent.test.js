/* global describe, test, expect ,jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders} from '../../../../test/test-utils';
import IntegrationTabsComponent from '.';
import * as hooks from '../useAvailableTabs';
import FlowsPanel from '../panels/Flows';
import FlowsIcon from '../../../../components/icons/FlowsIcon';

describe('IntegrationTabsComponent UI tests', () => {
  test('should test for manual putting the tab', () => {
    jest.spyOn(hooks, 'useAvailableTabs').mockReturnValueOnce([{ path: 'flows', label: 'Flows', Icon: FlowsIcon, Panel: FlowsPanel }]);
    renderWithProviders(<MemoryRouter><IntegrationTabsComponent /></MemoryRouter>);
    expect(screen.getByText('Flows')).toBeInTheDocument();
  });
  test('should test for no tab provided', () => {
    jest.spyOn(hooks, 'useAvailableTabs').mockReturnValueOnce([]);
    const {utils} = renderWithProviders(<MemoryRouter><IntegrationTabsComponent /></MemoryRouter>);

    expect(utils.container.textContent).toBe('');
  });
  test('should test for all default tabs', () => {
    renderWithProviders(<MemoryRouter><IntegrationTabsComponent /></MemoryRouter>);

    expect(screen.getByText('Flows')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Audit log')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Aliases')).toBeInTheDocument();
    expect(screen.getByText('Revisions')).toBeInTheDocument();
  });
});
