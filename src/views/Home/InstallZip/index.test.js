
import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import {renderWithProviders} from '../../../test/test-utils';
import InstallZip from '.';

jest.mock('../../InstallIntegration', () => ({
  __esModule: true,
  ...jest.requireActual('../../InstallIntegration'),
  default: () => (
    <>
      <div>SearchBar</div>
    </>
  ),
}));
describe('InstallZip UI tests', () => {
  test('should pass the initial render', () => {
    const ui = (
      <MemoryRouter initialEntries={[{pathname: '/home/installZip'}]}>
        <Route path="/home">
          <InstallZip />
        </Route>
      </MemoryRouter>
    );

    renderWithProviders(ui);
    expect(screen.getByText(/SearchBar/i)).toBeInTheDocument();     // Searchbar text is rendered by the mocked component//
  });
});
