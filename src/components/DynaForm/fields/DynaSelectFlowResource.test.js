
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DynaSelectFlowResource from './DynaSelectFlowResource';
import { renderWithProviders, reduxStore, mutateStore} from '../../../test/test-utils';

jest.mock('../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../LoadResources'),
  default: props => (
    <div>{props.children}</div>
  ),
}));

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
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

function initDynaSelectFlowResource(props = {}) {
  const ui = (
    <MemoryRouter>
      <DynaSelectFlowResource {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaSelectFlowResource UI test cases', () => {
  describe('normal flow', () => {
    test('should show empty dom when field is supposed to be invisible', () => {
      const {utils} = initDynaSelectFlowResource({...props, options: { filter: {$and: []}, visible: false}});

      expect(utils.container).toBeEmptyDOMElement();
    });
    test('should show the filtered export have required connectionID', async () => {
      initDynaSelectFlowResource(props);

      await userEvent.click(screen.getByText('Please select'));
      const menuItems = screen.getAllByRole('menuitem');
      const items = menuItems.map(each => each.textContent);

      expect(items).toEqual(['Please select', 'Test exports']);
    });
    test('should show the filtered import have required connectionID', async () => {
      initDynaSelectFlowResource({...props, resourceType: 'imports'});

      await userEvent.click(screen.getByText('Please select'));
      const menuItems = screen.getAllByRole('menuitem');
      const items = menuItems.map(each => each.textContent);

      expect(items).toEqual(['Please select', 'Test import']);
    });

    test('should show the filtered export based on the _exportId property', async () => {
      initDynaSelectFlowResource({...props, flowResourceType: 'pp', resourceType: 'exports', flowId: '6377005b05853c7b611fceb7' });

      await userEvent.click(screen.getByText('Please select'));
      const menuItems = screen.getAllByRole('menuitem');
      const items = menuItems.map(each => each.textContent);

      expect(items).toEqual(['Please select', 'Test exports']);
    });

    test('should show the exports in menuitems when page processor has export id and flow resource type is pageprocessor', async () => {
      initDynaSelectFlowResource({...props, flowResourceType: 'pp', resourceType: 'exports', flowId: '6377005b05853c7b611fceb3' });

      await userEvent.click(screen.getByText('Please select'));
      const menuItems = screen.getAllByRole('menuitem');
      const items = menuItems.map(each => each.textContent);

      expect(items).toEqual(['Please select', 'Test exports']);
    });
    test('should show the label from props and options should be visible by default', async () => {
      const newOption = {
        filter: {
          $and: [
            {
              _connectionId: '5bf18920294767270c62fa96',
            },
          ],
        },
      };

      initDynaSelectFlowResource({...props, label: 'PropsLabel', options: newOption, flowResourceType: 'pp', resourceType: 'exports', flowId: '6377005b05853c7b611fceb3' });

      expect(screen.getByText('PropsLabel')).toBeInTheDocument();
      await userEvent.click(screen.getByText('Please select'));
      const menuItems = screen.getAllByRole('menuitem');
      const items = menuItems.map(each => each.textContent);

      expect(items).toEqual(['Please select', 'Test exports']);
    });
  });
  describe('flow With Flow Branching', () => {
    test('should pg the filtered export from route property have required connectionID', async () => {
      initDynaSelectFlowResource({...props, resourceType: 'exports', flowId: '6377005b05853c7b611fceb4' });

      await userEvent.click(screen.getByText('Please select'));
      const menuItems = screen.getAllByRole('menuitem');
      const items = menuItems.map(each => each.textContent);

      expect(items).toEqual(['Please select', 'Test exports']);
    });
    test('should show the filtered export from route property have required connectionID', async () => {
      initDynaSelectFlowResource({...props, resourceType: 'imports', flowId: '6377005b05853c7b611fceb6' });

      await userEvent.click(screen.getByText('Please select'));
      const menuItems = screen.getAllByRole('menuitem');
      const items = menuItems.map(each => each.textContent);

      expect(items).toEqual(['Please select', 'Test import']);
    });
  });
});
