/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders} from '../../../../../test/test-utils';
import AnalyticsPanel from '.';

jest.mock('../../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/LoadResources'),
  default: props => <div>{props.children}</div>,
}));

jest.mock('../../../../../components/LineGraph/Dashboard', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/LineGraph/Dashboard'),
  default: props => {
    const content = `Chart Drawer , intgerationId = ${props.integrationId}`;

    return <div>{content}</div>;
  },
}));

describe('AnalyticsPanel UI tests', () => {
  test('should test the panel header', () => {
    renderWithProviders(<MemoryRouter><AnalyticsPanel integrationId="IntegrationID" /></MemoryRouter>);
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Chart Drawer , intgerationId = IntegrationID')).toBeInTheDocument();
    screen.debug();
  });

  test('should test the case when childId is also passed', () => {
    renderWithProviders(<MemoryRouter><AnalyticsPanel integrationId="IntegrationID" childId="childId" /></MemoryRouter>);
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Chart Drawer , intgerationId = childId')).toBeInTheDocument();
    screen.debug();
  });
});
