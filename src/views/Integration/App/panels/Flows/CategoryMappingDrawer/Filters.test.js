import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../store';
import Filters from './Filters';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('Filters UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should set the required option as false', async () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.integrationApps.settings['1234-4321'] = { filters: { attributes: { required: true } } };
    });

    renderWithProviders(<MemoryRouter><Filters integrationId="4321" flowId="1234" uiAssistant="uiAssistant" /></MemoryRouter>, { initialStore });
    await userEvent.click(screen.getByRole('button'));

    const checkbox = screen.getAllByRole('checkbox');

    await userEvent.click(checkbox[0]);

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_SET_FILTERS',
        integrationId: '4321',
        flowId: '1234',
        filters: { attributes: { required: false } },
      }
    );
  });
  test('sould set the value for every option available', async () => {
    renderWithProviders(<MemoryRouter><Filters integrationId="4321" flowId="1234" uiAssistant="uiAssistant" /></MemoryRouter>);
    await userEvent.click(screen.getByRole('button'));

    const checkbox = screen.getAllByRole('checkbox');

    await userEvent.click(checkbox[0]);
    await userEvent.click(checkbox[1]);
    await userEvent.click(checkbox[2]);
    await userEvent.click(checkbox[3]);

    expect(mockDispatch).toHaveBeenCalledTimes(4);
  });
  test('should click on the unmapped button', async () => {
    renderWithProviders(<MemoryRouter><Filters integrationId="4321" flowId="1234" uiAssistant="uiAssistant" /></MemoryRouter>);
    await userEvent.click(screen.getByRole('button'));

    await userEvent.click(screen.getByText('Unmapped'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_SET_FILTERS',
        integrationId: '4321',
        flowId: '1234',
        filters: { mappingFilter: 'unmapped' },
      });
  });
});
