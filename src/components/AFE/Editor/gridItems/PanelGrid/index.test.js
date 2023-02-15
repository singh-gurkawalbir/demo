import React from 'react';
import { screen, waitFor, fireEvent} from '@testing-library/react';
import { renderWithProviders } from '../../../../../test/test-utils';
import PanelGrid from '.';

function MyComponent() {
  return (
    <div>Component</div>
  );
}
describe('panelGrid UI tests', () => {
  test('should pass the initial render', async () => {
    const mockMouseUp = jest.fn();
    const mockMouseMove = jest.fn();
    const props = {children: <MyComponent />, onMouseUp: mockMouseUp, onMouseMove: mockMouseMove};

    renderWithProviders(<PanelGrid {...props} />);
    const child = screen.getByText('Component');

    fireEvent.mouseUp(child);
    await waitFor(() => expect(mockMouseUp).toHaveBeenCalledTimes(1));

    fireEvent.mouseMove(child);
    await waitFor(() => expect(mockMouseMove).toHaveBeenCalledTimes(1));
  });
});

