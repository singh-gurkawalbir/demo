/* global describe, test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../../test/test-utils';
import PanelTitle from '.';

function MyComponent() {
  return (
    <div>Component</div>
  );
}
describe('SinglePanelGridItem UI tests', () => {
  test('should pass the initial render', () => {
    const props = {title: 'Demo title', helpKey: 'demo help key', children: <MyComponent />, isLoggable: true};

    renderWithProviders(<PanelTitle {...props} />);
    expect(screen.getByText('Demo title')).toBeInTheDocument();
  });
  test('should render the children and not the title when title is not passed', () => {
    const props = {helpKey: 'demo help key', children: <MyComponent />, isLoggable: true};

    renderWithProviders(<PanelTitle {...props} />);
    expect(screen.getByText('Component')).toBeInTheDocument();
    expect(screen.queryByText('Demo title')).toBeNull();
  });
});
