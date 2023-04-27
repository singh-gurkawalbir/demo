
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders} from '../../../../../../test/test-utils';
import CategoryMappingActions from './CategoryMappingActions';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('CategoryMappingActions UI tests', () => {
  test('should test the redirection to required page', async () => {
    renderWithProviders(<MemoryRouter initialEntries={['/someinitialURl']}><Route path="/someinitialURl"><CategoryMappingActions /></Route></MemoryRouter>);

    await userEvent.click(screen.getByText('Add category'));

    expect(mockHistoryPush).toHaveBeenCalledWith('/someinitialURl/addCategory');
  });
});
