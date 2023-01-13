
import { screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import Title from '.';
import { getCreatedStore } from '../../../../../store';
import * as mockContext from '../../Context';
import {renderWithProviders} from '../../../../../test/test-utils';

let initialStore;
const mockOnClick = jest.fn();
const children = 'test children';

jest.mock('../AddButton', () => ({
  __esModule: true,
  ...jest.requireActual('../AddButton'),
  default: props => (
    <button type="button" data-test="addButton" onClick={props.onClick}>Mock Add Button</button>
  ),
}));
describe('Testsuite for Tile', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  test('should test the children with no add button', () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({
      flow: {_integrationId: '345', _connectorId: '456'}, flowId: '234',
    });
    renderWithProviders(
      <Title onClick={mockOnClick} className="test class" type="generator">
        {children}
      </Title>, initialStore
    );
    expect(screen.getByText(/test children/i)).toBeInTheDocument();
  });
  test('should test the children with add button by not passing connector id in flow', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({
      flow: {_integrationId: '345', _connectorId: ''}, flowId: '234',
    });
    renderWithProviders(
      <Title onClick={mockOnClick} className="test class" type="generator">
        {children}
      </Title>, initialStore
    );
    expect(screen.getByText(/test children/i)).toBeInTheDocument();
    const addButtonNode = screen.getByRole('button', {
      name: /mock add button/i,
    });

    expect(addButtonNode).toBeInTheDocument();
    await userEvent.click(addButtonNode);
    expect(mockOnClick).toBeCalled();
  });
});
