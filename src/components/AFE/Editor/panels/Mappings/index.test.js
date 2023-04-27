import React from 'react';
import { screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import {renderWithProviders, reduxStore, mutateStore} from '../../../../../test/test-utils';
import actions from '../../../../../actions';
import MappingWrapper from '.';

jest.mock('../../../../Mapping/AutoMapperButton', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../Mapping/AutoMapperButton'),
  default: () => <div>AutoMapperButton</div>,
}));

const initialStore = reduxStore;

const metadata = {
  application: {
    '5c178429681bef65353724b4': {
      'netsuite/metadata/suitescript/connections/5c178429681bef65353724b4/recordTypes/customrecord475': {
        status: 'received',
        data: [
          {
            group: 'Body Field',
            id: 'customform.internalid',
            name: 'Custom Form (InternalId)',
            type: 'select',
          },
        ],
        changeIdentifier: 1,
      },
    },
  },
};

const flowData = {
  '5c2cf0dd3aa62d3c98f789fa': {
    pageProcessorsMap: {
      '5c2cf30d3aa62d3c98f78a3e': {
        preMap: {
          status: 'received',
          data: {
            id: 386605584298,
          },
        },
      },
    },
  },
};

const mustateState = draft => {
  draft.data.resources.flows = [
    {
      _id: '5c2cf0dd3aa62d3c98f789fa',
      lastModified: '2019-01-02T17:21:52.843Z',
      name: 'Zendesk to NetSuite',
      disabled: false,
      skipRetries: false,
      pageProcessors: [
        {
          type: 'import',
          _importId: '5c2cf30d3aa62d3c98f78a3e',
          responseMapping: {
            lists: [],
            fields: [],
          },
        },
      ],
      pageGenerators: [
        {
          _exportId: '5c2cf1003aa62d3c98f789ff',
        },
      ],
      createdAt: '2019-01-02T17:11:57.182Z',
      wizardState: 'done',
    },
  ];
  draft.data.resources.imports = [
    {
      _id: '5c2cf30d3aa62d3c98f78a3e',
      createdAt: '2019-01-02T17:21:17.068Z',
      lastModified: '2019-01-02T17:21:41.140Z',
      name: 'NS',
      responseTransform: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      _connectionId: '5c178429681bef65353724b4',
      distributed: true,
      apiIdentifier: 'i3cce559e4',
      sandbox: false,
      lookups: [],
      netsuite_da: {
        operation: 'add',
        recordType: 'customrecord475',
        lookups: [],
        mapping: {
          lists: [],
          fields: [
            {
              generate: 'name',
              extract: 'name',
              internalId: false,
              immutable: false,
              discardIfEmpty: false,
            },
          ],
        },
      },
      filter: {
        type: 'expression',
        expression: {
          version: '1',
        },
        version: '1',
      },
      adaptorType: 'NetSuiteDistributedImport',
    },
  ];
};

mutateStore(initialStore, mustateState);

jest.mock('../../../../Mapping/Settings', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../Mapping/Settings'),
  default: () => (
    <div>Settings drawer</div>
  ),
}));

jest.mock('./Mapper2', () => ({
  __esModule: true,
  ...jest.requireActual('./Mapper2'),
  default: () => (
    <div>Mapper2</div>
  ),
}));

jest.mock('../../../../VirtualizedDragContainer', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../VirtualizedDragContainer'),
  default: props => (
    <>
      <div>VirtualizedDragContainer</div>
      <button type="button" onClick={() => props.onSortEnd({oldIndex: 0, newIndex: 1})} >onSortEnd</button>
    </>
  ),
}));

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

function returnHundreMapping() {
  const array = [];

  for (let i = 0; i < 101; i += 1) {
    array.push(
      {
        extract: `source${i}`,
        generate: `destination${i}`,
        key: `${i}`,
      }
    );
  }

  return array;
}

describe('mappingWrapper test cases', () => {
  test('should show spinner when status is not received', () => {
    renderWithProviders(<MappingWrapper />, {initialStore});
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should show error message when status is error', () => {
    mutateStore(initialStore, draft => {
      draft.session.mapping = {mapping: {
        status: 'error',
        version: 2,
      }};
    });
    renderWithProviders(<MappingWrapper />, {initialStore});
    expect(screen.getByText('Failed to load mapping.')).toBeInTheDocument();
  });
  test('should show the mapping2 when version 2 is provided', () => {
    mutateStore(initialStore, draft => {
      draft.session.mapping = {mapping: {
        status: 'received',
        version: 2,
      }};
    });
    renderWithProviders(<MappingWrapper />, {initialStore});
    expect(screen.getByText('Settings drawer')).toBeInTheDocument();
    expect(screen.getByText('Mapper2')).toBeInTheDocument();
  });
  test('should show the mapping in mapper 1 when mapping is less than 99', () => {
    mutateStore(initialStore, draft => {
      draft.session.mapping = {mapping: {
        status: 'received',
        version: 1,
        mappings: [
          {
            extract: 'source3',
            generate: 'destination1',
            key: '-heQnzf2pJ',
          },
          {
            extract: 'source2',
            generate: 'destination2',
            key: 'vBBwvgsTsm',
          },
        ],
      }};
    });
    renderWithProviders(<MemoryRouter><MappingWrapper /></MemoryRouter>, {initialStore});
    const texboxContent = screen.getAllByRole('textbox').map(each => each.textContent);

    expect(texboxContent).toEqual(
      ['source3', 'destination1', 'source2', 'destination2', '', '']
    );
  });
  test('should show Virtualized container when mapping more than 99', async () => {
    const mappings = returnHundreMapping();

    mutateStore(initialStore, draft => {
      draft.session.mapping = {mapping: {
        status: 'received',
        version: 1,
        mappings,
      }};
    });
    renderWithProviders(<MemoryRouter><MappingWrapper /></MemoryRouter>, {initialStore});
    expect(screen.getByText('VirtualizedDragContainer')).toBeInTheDocument();
    await userEvent.click(screen.getByText('onSortEnd'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.shiftOrder('0', 1)
    );
  });
  test('should show the automapping button', () => {
    mutateStore(initialStore, draft => {
      draft.session.editors = {editorID: {
        flowId: '5c2cf0dd3aa62d3c98f789fa',
        resourceId: '5c2cf30d3aa62d3c98f78a3e',
      }};
      draft.session.metadata = metadata;
      draft.session.mapping = {mapping: {
        status: 'received',
        version: 1,
        mappings: [
          {
            extract: 'source2',
            generate: 'destination2',
            key: 'vBBwvgsTsm',
          },
        ],
      }};
      draft.session.flowData = flowData;
    });
    renderWithProviders(<MemoryRouter><MappingWrapper editorId="editorID" /></MemoryRouter>, {initialStore});
    expect(screen.getByText('AutoMapperButton')).toBeInTheDocument();
  });
});
