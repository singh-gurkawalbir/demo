import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mutateStore, renderWithProviders} from '../../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../../store';
import MappingWrapper from '.';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('MappingWrapper UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  function initStoreAndRender(mappings) {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.integrationApps.settings['4321-1234'] = {mappings};
    });

    renderWithProviders(<MemoryRouter><MappingWrapper integrationId="1234" flowId="4321" id="id" /></MemoryRouter>, {initialStore});
  }

  test('should test when status is error', () => {
    initStoreAndRender({ id: {status: 'error'}});

    expect(screen.getByText('Failed to load mapping.')).toBeInTheDocument();
  });
  test('should test when status is requested', () => {
    initStoreAndRender({ id: {status: 'requested'}});

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should test when status is received', () => {
    initStoreAndRender({ id: {status: 'received'}});

    expect(screen.getAllByRole('combobox')).toHaveLength(2);
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_INIT',
        integrationId: '1234',
        flowId: '4321',
        sectionId: undefined,
        id: 'id',
        depth: undefined,
      }
    );
  });
});
