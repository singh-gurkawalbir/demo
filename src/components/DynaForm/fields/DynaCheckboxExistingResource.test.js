
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore} from '../../../test/test-utils';
import DynaCheckboxExistingResource from './DynaCheckboxExistingResource';

jest.mock('../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../LoadResources'),
  default: props => (
    <div>{props.children}</div>
  ),
}));

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.data.resources.flows = [
    {
      _id: '6377005b05853c7b611fceb3',
      pageProcessors: [
        {
          type: 'import',
          _exportId: '63247349dcbbee6d73184ac1',
        },
      ],
    },
    {
      _id: '6377005b05853c7b611fceb4',
      pageGenerators: [
        {
          type: 'export',
          _exportId: '63247349dcbbee6d73184ac1',
        },
      ],
    },
    {
      _id: '6377005b05853c7b611fceb5',
      pageProcessors: [
        {
          type: 'import',
          _importId: '63247349dcbbee6d73184ac1',
        },
      ],
    },
    {
      _id: '6377005b05853c7b611fceb6',
      routers: [{branches: [
        { pageProcessors: [
          {
            type: 'import',
            _importId: '63247349dcbbee6d73184ac1',
          },
        ] },
      ]}],
    },
    {
      _id: '6377005b05853c7b611fceb7',
      routers: [{branches: [
        { pageProcessors: [
          {
            type: 'export',
            _exportId: '63247349dcbbee6d73184ac1',
          },
        ] },
      ]}],
    },
  ];
  draft.data.resources.imports = [{
    _id: 'nxksnn',
    name: 'Test import',
    _connectionId: '5bf18920294767270c62fa96',
    _integrationId: '12345',
  }];
  draft.data.resources.exports = [{
    _id: 'nxksnn',
    name: 'Test exports',
    _connectionId: '5bf18920294767270c62fa96',
    _integrationId: '12345',
  }];
});

const props = {
  resourceId: 'new-xR72yI',
  resourceType: 'exports',
  flowId: '6377005b05853c7b611fceb5',
  id: 'exportId',
  name: 'exportId',
  type: 'selectflowresource',
  flowResourceType: 'pg',
  label: 'Would you like to use an existing export?',
  defaultValue: '',
  allowEdit: true,
  value: '',
  touched: false,
  visible: true,
  options: {
    filter: {
      $and: [
        {
          _connectionId: '5bf18920294767270c62fa96',
        },
      ],
    },
    appType: 'ftp',
    visible: true,
    label: 'Would you like to use an existing transfer?',
  },
  errorMessages: '',
  resourceContext: {
    resourceType: 'pageGenerator',
  },
};

function initDynaCheckboxExistingResource(props = {}) {
  const ui = (
    <MemoryRouter>
      <DynaCheckboxExistingResource {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaSelectFlowResource UI test cases', () => {
  describe('normal flow', () => {
    test('should show empty dom when field is supposed to be invisible', () => {
      const {utils} = initDynaCheckboxExistingResource({...props, options: { filter: {$and: []}, visible: false}});

      expect(utils.container).toBeEmptyDOMElement();
    });

    test('should pass the initial render', () => {
      renderWithProviders(<DynaCheckboxExistingResource {...props} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });
    test('should render a checked checkbox when value is passed as true in props', () => {
      renderWithProviders(<DynaCheckboxExistingResource {...props} value />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      const checkBox = screen.getByRole('checkbox');

      expect(checkBox).toBeChecked();
    });
    test('should render a disabled checkbox when disabled is passed as true in props', () => {
      renderWithProviders(<DynaCheckboxExistingResource {...props} disabled />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      const checkBox = screen.getByRole('checkbox');

      expect(checkBox).toBeDisabled();
    });
    test('should call the onChange function passed in props when checkbox is checked', () => {
      const mockOnChange = jest.fn();

      renderWithProviders(<DynaCheckboxExistingResource {...props} onFieldChange={mockOnChange} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      const checkBox = screen.getByRole('checkbox');

      userEvent.click(checkBox);
      expect(mockOnChange).toHaveBeenCalled();
    });
  });
});
