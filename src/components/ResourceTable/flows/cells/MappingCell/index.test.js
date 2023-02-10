
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore} from '../../../../../test/test-utils';
import MappingCell from '.';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    location: { pathname: '/integrations/62662cc4e06ff462c3db470e/flows'},
  }),
}));

const initialStore = reduxStore;

initialStore.getState().data.resources.integrations = [{
  _id: '62662cc4e06ff462c3db470e',
  lastModified: '2022-04-29T12:23:16.887Z',
  _connectorId: 'qrf',
  settings: {supportsMultiStore: true, sections: [{id: 'someChildId', sections: [{flows: [{_id: '5ea16c600e2fab71928a6153', showUtilityMapping: true, showMapping: true}]}]}]},
  name: 'Production',
}];
initialStore.getState().data.resources.flows = [
  {
    _id: '5ea16c600e2fab71928a6152',
    _integrationId: '62662cc4e06ff462c3db470e',
    pageProcessors: [{ type: 'import', _importId: 'import-id-1'}],
  },
  {
    _id: '600ec2928a6152fab5ea1671',
    _integrationId: '62662cc4e06ff462c3db470e',
    pageProcessors: [{ type: 'import', _importId: 'import-id-2'}],
  },
  {
    _id: '5ea16c600e2fab71928a6153',
    _connectorId: 'qrf',
    _integrationId: '62662cc4e06ff462c3db470e',
  },
];
initialStore.getState().data.resources.imports = [
  {
    _id: 'import-id-1',
    mappings: [
      {extract: '$.name', generate: 'name'},
      {extract: '$.age', generate: 'age'},
    ],
  },
  {
    _id: 'import-id-2',
  },
];

async function initMappingPage(props) {
  const ui = (
    <MemoryRouter>
      <MappingCell
        {...props}
        />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('mapping cell  ui test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show empty dom when no props provided', () => {
    const {utils} = renderWithProviders(<MemoryRouter><MappingCell /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should redirect to mapping page', () => {
    initMappingPage({flowId: '5ea16c600e2fab71928a6152'});
    userEvent.click(screen.getByRole('button'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/62662cc4e06ff462c3db470e/flows/mapping/5ea16c600e2fab71928a6152');
  });
  test('should redirect to Utility Mapping page', () => {
    initMappingPage({flowId: '5ea16c600e2fab71928a6153', childId: 'someChildId'});

    userEvent.click(screen.getByRole('button'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/62662cc4e06ff462c3db470e/flows/5ea16c600e2fab71928a6153/utilitymapping/commonAttributes');
  });
  test('should show icon indicator if flow has mappings', () => {
    initMappingPage({ flowId: '5ea16c600e2fab71928a6152' });
    expect(document.querySelector('[class*=makeStyles-circle]')).toBeInTheDocument();
  });
  test('should not show icon indicator for flows without mappings', () => {
    initMappingPage({ flowId: '600ec2928a6152fab5ea1671' });
    expect(document.querySelector('[class*=makeStyles-circle]')).not.toBeInTheDocument();
  });
});
