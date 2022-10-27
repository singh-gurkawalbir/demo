/* global test, expect, jest,describe */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProviders } from '../../../../../test/test-utils';
import MappingCell from './index';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('Suite script MappingCell ui test', () => {
  test('should show empty dom when no flow is provided', () => {
    const {utils} = renderWithProviders(<MemoryRouter><MappingCell flow={{}} /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should call history push after clikcing the mapping button', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={[{pathname: '/initialURL'}]}>
        <Route
          path="/initialURL"
          params={{}}
      ><MappingCell flow={{_id: 'flowID', editable: true}} />
        </Route>
      </MemoryRouter>);
    const mappingButton = screen.getByRole('button');

    expect(mappingButton).toBeInTheDocument();
    userEvent.click(mappingButton);
    expect(mockHistoryPush).toHaveBeenCalledWith('/initialURL/flowID/mapping');
  });
});
