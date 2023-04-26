import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleLayout from './ToggleLayout';
import { getCreatedStore } from '../../../../store';
import actions from '../../../../actions';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';

const initialStore = getCreatedStore();
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

function initToggleLayout(props = {}) {
  const mustateState = draft => {
    draft.session.editors = {
      'mappings-6320bf1151852e73fb07fcf8': {
        editorType: 'mappings',
        flowId: '6320262d51852e73fb077993',
        resourceId: '6320bf1151852e73fb07fcf8',
        resourceType: 'imports',
        stage: 'importMappingExtract',
        editorTitle: 'Edit mapping: S3 import',
        fieldId: '',
        layout: 'compact2',
        autoEvaluate: false,
        mappingPreviewType: 'sometype',
        sampleDataStatus: 'received',
      },
      'iFilter-631f9f1d3bfc725f006327e3': {
        editorType: 'inputFilter',
        flowId: '63271e1fb144bd24fd6f7cd2',
        resourceId: '631f9f1d3bfc725f006327e3',
        resourceType: 'imports',
        stage: 'inputFilter',
        rule: {
          filter: [],
          javascript: {
            fetchScriptContent: true,
            entryFunction: 'filter',
          },
        },
        activeProcessor: 'filter',
        context: {
          type: 'hook',
          container: 'integration',
          _integrationId: '62ecc42648570015ab65cfa5',
          _flowId: '63271e1fb144bd24fd6f7cd2',
        },
        fieldId: '',
        layout: 'compact',
        insertStubKey: 'filter',
        originalRule: {
          filter: [],
          javascript: {
            fetchScriptContent: true,
            entryFunction: 'filter',
          },
        },
        sampleDataStatus: 'received',
        data: {
          filter: '{\n  "record": {\n    "hns": 922\n  },\n  "settings": {\n    "integration": {},\n    "flow": {},\n    "flowGrouping": {},\n    "connection": {},\n    "import": {}\n  }\n}',
          javascript: '{\n  "record": {\n    "hns": 922\n  },\n  "settings": {\n    "integration": {},\n    "flow": {},\n    "flowGrouping": {},\n    "connection": {},\n    "import": {}\n  }\n}',
        },
        dataVersion: 2,
        lastValidData: '{\n  "record": {\n    "hns": 922\n  },\n  "settings": {\n    "integration": {},\n    "flow": {},\n    "flowGrouping": {},\n    "connection": {},\n    "import": {}\n  }\n}',
      }};
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<ToggleLayout {...props} />, {initialStore});
}

describe('ToggleLayout UI tests', () => {
  test('Should test the initial render where the input is set to compact2 layout', () => {
    initToggleLayout({editorId: 'mappings-6320bf1151852e73fb07fcf8'});
    expect(document.querySelector('input')).toHaveValue('compact2');
  });
  test('Should make a dispatch call when toggle layout is set to compactRow', async () => {
    initToggleLayout({editorId: 'mappings-6320bf1151852e73fb07fcf8'});
    await userEvent.click(screen.getByRole('button'));
    const layoutOption = screen.getAllByRole('option').find(eachOption => eachOption.getAttribute('data-value') === 'compactRow');

    expect(layoutOption).toBeInTheDocument();
    await userEvent.click(layoutOption);
    expect(mockDispatch).toHaveBeenCalledWith(actions.editor.changeLayout('mappings-6320bf1151852e73fb07fcf8', 'compactRow'));
  });
  test('Should make a dispatch call when toggle layout is set to assistantTopRight', async () => {
    initToggleLayout({editorId: 'mappings-6320bf1151852e73fb07fcf8'});
    await userEvent.click(screen.getByRole('button'));
    const layoutOption = screen.getAllByRole('option').find(eachOption => eachOption.getAttribute('data-value') === 'assistantTopRight');

    expect(layoutOption).toBeInTheDocument();
    await userEvent.click(layoutOption);
    expect(mockDispatch).toHaveBeenCalledWith(actions.editor.changeLayout('mappings-6320bf1151852e73fb07fcf8', 'assistantTopRight'));
  });
  test('Should make a dispatch call when toggle layout is set to assistantRight', async () => {
    initToggleLayout({editorId: 'mappings-6320bf1151852e73fb07fcf8'});
    await userEvent.click(screen.getByRole('button'));
    const layoutOption = screen.getAllByRole('option').find(eachOption => eachOption.getAttribute('data-value') === 'assistantRight');

    expect(layoutOption).toBeInTheDocument();
    await userEvent.click(layoutOption);
    expect(mockDispatch).toHaveBeenCalledWith(actions.editor.changeLayout('mappings-6320bf1151852e73fb07fcf8', 'assistantRight'));
  });
  test('Should make a dispatch call when toggle layout is set to column', async () => {
    initToggleLayout({editorId: 'iFilter-631f9f1d3bfc725f006327e3' });
    expect(document.querySelector('input')).toHaveValue('compact');
    await userEvent.click(screen.getByRole('button'));
    const layoutOption = screen.getAllByRole('option').find(eachOption => eachOption.getAttribute('data-value') === 'column');

    expect(layoutOption).toBeInTheDocument();
    await userEvent.click(layoutOption);
    expect(mockDispatch).toHaveBeenCalledWith(actions.editor.changeLayout('iFilter-631f9f1d3bfc725f006327e3', 'column'));
  });
  test('Should make a dispatch call when toggle layout is set to row', async () => {
    initToggleLayout({editorId: 'iFilter-631f9f1d3bfc725f006327e3' });
    expect(document.querySelector('input')).toHaveValue('compact');
    await userEvent.click(screen.getByRole('button'));
    const layoutOption = screen.getAllByRole('option').find(eachOption => eachOption.getAttribute('data-value') === 'row');

    expect(layoutOption).toBeInTheDocument();
    await userEvent.click(layoutOption);
    expect(mockDispatch).toHaveBeenCalledWith(actions.editor.changeLayout('iFilter-631f9f1d3bfc725f006327e3', 'row'));
  });
});
