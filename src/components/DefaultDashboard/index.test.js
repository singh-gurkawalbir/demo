import React from 'react';
import { render } from '@testing-library/react';
import DefaultDashboard from './index';

describe('DefaultDashboard component', () => {
  test('should render correctly with default props', () => {
    const { getByText } = render(<DefaultDashboard id="default" />);
    const defaultMessage = getByText('No Default Message added');

    expect(defaultMessage).toBeInTheDocument();
  });

  test('should render ConnectionsIcon and message correctly when id is "0"', () => {
    const { getByText, getByTestId } = render(<DefaultDashboard id="0" />);
    const connectionsIcon = getByTestId('connections');
    const connectionsMessage = getByText('No connections added');

    expect(connectionsIcon).toBeInTheDocument();
    expect(connectionsMessage).toBeInTheDocument();
  });

  test('should render IntegrationAppsIcon and message correctly when id is "3"', () => {
    const { getByText, getByTestId } = render(<DefaultDashboard id="3" />);
    const connectionsIcon = getByTestId('records');
    const connectionsMessage = getByText('No records added');

    expect(connectionsIcon).toBeInTheDocument();
    expect(connectionsMessage).toBeInTheDocument();
  });

  test('should render FlowsIcon and message correctly when id is "2"', () => {
    const { getByText, getByTestId } = render(<DefaultDashboard id="2" />);
    const flowsIcon = getByTestId('flows');
    const flowsMessage = getByText('No flows added');

    expect(flowsIcon).toBeInTheDocument();
    expect(flowsMessage).toBeInTheDocument();
  });

  // Add more test cases for other IDs and expected icon/message combinations
});
