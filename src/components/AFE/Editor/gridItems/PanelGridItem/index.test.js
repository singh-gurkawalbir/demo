import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../../test/test-utils';
import PanelGridItem from '.';

function MyComponent() {
  return (
    <div>Component</div>
  );
}
describe('panelGridItem UI tests', () => {
  test('should pass the initial render', () => {
    const props = {children: <MyComponent />};

    renderWithProviders(<PanelGridItem {...props} />);
    expect(screen.getByText('Component')).toBeInTheDocument();
  });
});
