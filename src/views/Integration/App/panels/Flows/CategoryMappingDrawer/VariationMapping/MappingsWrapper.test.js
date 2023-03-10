
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mutateStore, renderWithProviders} from '../../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../../store';
import VariationMappings from './MappingsWrapper';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('./Mappings', () => ({
  __esModule: true,
  ...jest.requireActual('./Mappings'),
  default: () => <div>Mappings Loaded</div>,
}));

describe('MappingsWrapper UI tests', () => {
  function initStoreAndRender(statusObj) {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.integrationApps.settings['4321-1234'] = {mappings: []};
      draft.session.integrationApps.settings['4321-1234'].mappings['4321-sectionId-5-variationAttributes'] = statusObj;
    });

    renderWithProviders(
      <MemoryRouter>
        <VariationMappings
          integrationId="1234" flowId="4321" id="id" sectionId="sectionId"
          isVariationAttributes depth={5} />
      </MemoryRouter>, {initialStore});
  }

  test('should test when status is request', () => {
    initStoreAndRender({status: 'request'});
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should test when status is error', () => {
    initStoreAndRender({status: 'error'});
    expect(screen.getByText('Failed to load mapping.')).toBeInTheDocument();
  });
  test('should test when status is received', () => {
    initStoreAndRender({status: 'received'});
    expect(screen.getByText('Mappings Loaded')).toBeInTheDocument();
  });
});
