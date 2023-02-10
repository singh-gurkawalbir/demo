import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../../test/test-utils';
import SinglePanelGridItem from '.';

function MyComponent() {
  return (
    <div>Component</div>
  );
}
describe('singlePanelGridItem UI tests', () => {
  test('should pass the initial render', () => {
    const props = {title: 'Demo title', children: <MyComponent />, isLoggable: true};

    renderWithProviders(<SinglePanelGridItem {...props} />);
    expect(screen.getByText('Demo title')).toBeInTheDocument();
    expect(screen.getByText('Component')).toBeInTheDocument();
  });
});
