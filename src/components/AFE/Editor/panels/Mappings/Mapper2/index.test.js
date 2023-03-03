import React from 'react';
import {fireEvent, screen, waitFor} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { getCreatedStore } from '../../../../../../store';
import {renderWithProviders, reduxStore, mutateStore} from '../../../../../../test/test-utils';
import Mapper2 from './index';
import actions from '../../../../../../actions';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const mockSetItem = jest.fn();

const localStorage = {
  setItem: mockSetItem,
  getItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localStorage });

const initialStore = reduxStore;

const v2TreeData = [
  {
    key: 'CaweoYSl0CFrWZIDvPx2U',
    title: '',
    disabled: false,
    jsonPath: '',
    isRequired: false,
    dataType: 'objectarray',
    status: 'Draft',
    buildArrayHelper: [
      {
        sourceDataType: 'string',
        mappings: [
          {
            extract: 'erfrfer',
            generate: 'qrf',
            dataType: 'string',
            conditional: {
              when: 'extract_not_empty',
            },
            description: 'qwewqecf',
            status: 'Active',
            sourceDataType: 'string',
          },
        ],
      },
    ],
    extractsArrayHelper: [],
    children: [
      {
        key: 'eeJ5HuWqL3oisV0TDvuhi',
        title: '',
        parentKey: 'CaweoYSl0CFrWZIDvPx2U',
        parentExtract: '',
        disabled: false,
        jsonPath: 'qrf',
        isRequired: false,
        extract: 'erfrfer',
        generate: 'qrf',
        dataType: 'string',
        conditional: {
          when: 'extract_not_empty',
        },
        description: 'qwewqecf',
        status: 'Active',
        sourceDataType: 'string',
      },
    ],
    generateDisabled: true,
  },
];

const v2RequiedTreeData = [
  {
    key: 'CaweoYSl0CFrWZIDvPx2U',
    title: '',
    disabled: false,
    jsonPath: '',
    isRequired: true,
    dataType: 'objectarray',
    status: 'Draft',
    buildArrayHelper: [
      {
        sourceDataType: 'string',
        mappings: [
          {
            extract: 'erfrfer',
            generate: 'qrf',
            dataType: 'string',
            conditional: {
              when: 'extract_not_empty',
            },
            description: 'qwewqecf',
            status: 'Active',
            sourceDataType: 'string',
          },
        ],
      },
    ],
    extractsArrayHelper: [],
    generateDisabled: true,
  },
];

mutateStore(initialStore, draft => {
  draft.session.mapping = {mapping: {
    mappings: [],
    lookups: [],
    v2TreeData,
    expandedKeys: [
      'eeJ5HuWqL3oisV0TDvuhi',
      'CaweoYSl0CFrWZIDvPx2U',
    ],
    flowId: '638ec60e924077616ba695e7',
    importId: '62e6897976ce554057c0f28f',
    status: 'received',
    isGroupedSampleData: true,
    isMonitorLevelAccess: false,
    version: 2,
    requiredMappings: [],
    extractsTree: [
      {
        key: 'ZAjmzl_vk1Bh3puJTXnEp',
        title: '',
        dataType: '[object]',
        propName: '$',
        children: [
          {
            key: 'TgfcDt_W38GfxDaT2bwyp',
            parentKey: 'ZAjmzl_vk1Bh3puJTXnEp',
            title: '',
            jsonPath: 'name',
            propName: 'name',
            dataType: 'string',
          },
          {
            key: 'F3569g55KJK04kt16Tzc1',
            parentKey: 'ZAjmzl_vk1Bh3puJTXnEp',
            title: '',
            jsonPath: 'notes',
            propName: 'notes',
            dataType: 'string',
          },
          {
            key: '_kY_SbhPnjpDZZzMjJMMw',
            parentKey: 'ZAjmzl_vk1Bh3puJTXnEp',
            title: '',
            jsonPath: 'fax',
            propName: 'fax',
            dataType: 'string',
          },
          {
            key: '8Me5Rvj33BA5ZwONr0cCJ',
            parentKey: 'ZAjmzl_vk1Bh3puJTXnEp',
            title: '',
            jsonPath: 'phone',
            propName: 'phone',
            dataType: 'string',
          },
          {
            key: 'kOe-A0FopOWkpaBQam02D',
            parentKey: 'ZAjmzl_vk1Bh3puJTXnEp',
            title: '',
            jsonPath: 'email',
            propName: 'email',
            dataType: 'string',
          },
        ],
      },
    ],
    isGroupedOutput: true,
    mappingsCopy: [],
    lookupsCopy: [],
    v2TreeDataCopy: [
      {
        key: 'CaweoYSl0CFrWZIDvPx2U',
        title: '',
        disabled: false,
        jsonPath: '',
        isRequired: false,
        dataType: 'objectarray',
        status: 'Draft',
        buildArrayHelper: [
          {
            sourceDataType: 'string',
            mappings: [
              {
                extract: 'erfrfer',
                generate: 'qrf',
                dataType: 'string',
                conditional: {
                  when: 'extract_not_empty',
                },
                description: 'qwewqecf',
                status: 'Active',
                sourceDataType: 'string',
              },
            ],
          },
        ],
        extractsArrayHelper: [],
        children: [
          {
            key: 'eeJ5HuWqL3oisV0TDvuhi',
            title: '',
            parentKey: 'CaweoYSl0CFrWZIDvPx2U',
            parentExtract: '',
            disabled: false,
            jsonPath: 'qrf',
            isRequired: false,
            extract: 'erfrfer',
            generate: 'qrf',
            dataType: 'string',
            conditional: {
              when: 'extract_not_empty',
            },
            description: 'qwewqecf',
            status: 'Active',
            sourceDataType: 'string',
          },
        ],
        generateDisabled: true,
      },
    ],
  }};
});

describe('ewrv', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should scroll left when whell is scrolled', async () => {
    renderWithProviders(<MemoryRouter><Mapper2 /></MemoryRouter>, {initialStore});

    await userEvent.click(screen.getAllByPlaceholderText('Source field')[0]);

    waitFor(async () => {
      await fireEvent.scroll(screen.getAllByRole('tree')[1], { target: { scrollY: 100 } });
      await fireEvent.wheel(screen.getAllByRole('tree')[1], { deltaX: 2 });
      expect(document.querySelector('.rc-tree-list-holder').scrollLeft).toBe(12);
    });
  });
  test('should show message when no destination fiels is matched', () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.mapping = {mapping: {searchKey: 'somsearchkey'}};
    });
    renderWithProviders(<MemoryRouter><Mapper2 /></MemoryRouter>, {initialStore});

    expect(screen.getByText("Your search term doesn't match any destination fields.")).toBeInTheDocument();
  });
  test('should show message that not match found when some filter is apllied', () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.mapping = {mapping: {filter: [1]}};
    });
    const {utils} = renderWithProviders(<MemoryRouter><Mapper2 /></MemoryRouter>, {initialStore});

    expect(utils.container.textContent).toBe(
      'You don\'t have any fields that match the filter you applied.  Clear the filter by setting it to "All fields".'
    );
  });
  test('should show the error message for Filtered by empty string', () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.mapping = {mapping: {filter: [''], v2TreeData}};
    });
    renderWithProviders(<MemoryRouter><Mapper2 /></MemoryRouter>, {initialStore});

    expect(screen.getByText('Filtered by mapped fields (clear filter to enable editing)')).toBeInTheDocument();
  });
  test('should show the error message for Filtered by mapped', () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.mapping = {mapping: {filter: ['mapped'], v2TreeData}};
    });
    renderWithProviders(<MemoryRouter><Mapper2 /></MemoryRouter>, {initialStore});

    expect(screen.getByText('Filtered by mapped fields (clear filter to enable editing)')).toBeInTheDocument();
  });
  test('should show filter message when mapping is filtered by mapped and required', () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.mapping = {mapping: {filter: ['mapped', 'required'], v2TreeData}};
    });
    renderWithProviders(<MemoryRouter><Mapper2 /></MemoryRouter>, {initialStore});

    expect(screen.getByText('Filtered by mapped fields and required fields (clear filter to enable editing)')).toBeInTheDocument();
  });
  test('should show filter message when mapping is filtered by required', () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.mapping = {mapping: {filter: ['required'], v2TreeData: v2RequiedTreeData}};
    });
    renderWithProviders(<MemoryRouter><Mapper2 /></MemoryRouter>, {initialStore});

    expect(screen.getByText('Filtered by required fields (clear filter to enable editing)')).toBeInTheDocument();
  });
  test('should make dispatch call for auto toggle create flag when mapping is auto created', () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.mapping = {mapping: {autoCreated: true}};
    });
    renderWithProviders(<MemoryRouter><Mapper2 /></MemoryRouter>, {initialStore});

    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.toggleAutoCreateFlag()
    );
  });
  test('should set scrollPosition in local storgae when v2Active key is provided', () => {
    jest.runAllTimers();
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.mapping = {mapping: {
        v2ActiveKey: 'somekey',
      }};
    });
    renderWithProviders(<MemoryRouter><Mapper2 /></MemoryRouter>, {initialStore});

    expect(mockSetItem).toHaveBeenCalled();
  });
});
