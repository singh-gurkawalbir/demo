/* eslint-disable jest/max-expects */
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ExplorerMenu from '.';
import { getCreatedStore } from '../../../store';
import { renderWithProviders } from '../../../test/test-utils';

let initialStore;
const mockHistoryPush = jest.fn();

async function initExplorerMenu({onEditorChange = jest.fn()} = {}) {
  initialStore.getState().data.resources.integrations = [{
    _id: '12345',
    name: 'Test integration name',
  }];
  initialStore.getState().data.resources.flows = [{
    _id: '67890',
    name: 'Test flow name 1',
    _integrationId: '12345',
    pageProcessors: [
      {
        type: 'import',
        _importId: 'nxksnn',
      },
    ],
    pageGenerators: [
      {
        _exportId: 'xsjxks',
      },
    ],
  }, {
    _id: '098765',
    name: 'Test flow name 2',
    _integrationId: '12345',
  }];
  initialStore.getState().data.resources.connections = [{
    _id: 'abcde',
    name: 'Test connection 1',
    _integrationId: '12345',
  }, {
    _id: 'fghijk',
    name: 'Test connection 2',
    _integrationId: '12345',
  }];
  initialStore.getState().data.resources.exports = [{
    _id: 'xsjxks',
    name: 'Test export',
    _connectionId: 'abcde',
    _integrationId: '12345',
  }];
  initialStore.getState().data.resources.imports = [{
    _id: 'nxksnn',
    name: 'Test import',
    _connectionId: 'fghijk',
    _integrationId: '12345',
  }];
  const ui = (
    <MemoryRouter>
      <ExplorerMenu onEditorChange={onEditorChange} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
jest.mock('../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/LoadResources'),
  default: newprops => (
    <div>{newprops.children}</div>
  ),
}
));
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('explorerMenu test suite', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  test('should able to click on an integration and it should verify the expanded flow tree', async () => {
    await initExplorerMenu({onEditorChange: jest.fn()});

    expect(screen.getByRole('treeitem', {name: /Test integration name/i})).toBeInTheDocument();
    const integrationNameSvgNode = document.querySelector('svg[viewBox="0 0 24 24"]');

    expect(integrationNameSvgNode).toBeInTheDocument();
    userEvent.click(integrationNameSvgNode);
    expect(screen.getAllByRole('treeitem')).toHaveLength(3);
    const flowNode = document.querySelector('div > div > ul > li > ul > div > div > li:nth-child(1) > div > div:nth-child(1) > svg > path');

    expect(flowNode).toBeInTheDocument();
    userEvent.click(flowNode);
    const openInFlowBuilderSVGNode = document.querySelector('div > div > ul > li > ul > div > div > li:nth-child(1) > ul > div > div > li:nth-child(1) > div > div:nth-child(1) > svg > path');

    expect(openInFlowBuilderSVGNode).toBeInTheDocument();
    userEvent.click(openInFlowBuilderSVGNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/12345/flowBuilder/67890');
    const testExportNode = document.querySelector('div > div > ul > li > ul > div > div > li:nth-child(1) > ul > div > div > li:nth-child(2) > div > div:nth-child(1) > svg > path');

    expect(testExportNode).toBeInTheDocument();
    userEvent.click(testExportNode);
    const viewExportNode = document.querySelector('div > div > ul > li > ul > div > div > li:nth-child(1) > ul > div > div > li:nth-child(2) > ul > div > div > li:nth-child(1) > div > div:nth-child(1) > svg > path');

    expect(viewExportNode).toBeInTheDocument();
    userEvent.click(viewExportNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/playground/edit/exports/xsjxks');
    const viewConnectionNode = document.querySelector('div > div > ul > li > ul > div > div > li:nth-child(1) > ul > div > div > li:nth-child(2) > ul > div > div > li:nth-child(2) > div > div:nth-child(1) > svg > path');

    expect(viewConnectionNode).toBeInTheDocument();
    userEvent.click(viewConnectionNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/playground/edit/connections/abcde');
    const importSvgNode = document.querySelector('div > div > ul > li > ul > div > div > li:nth-child(1) > ul > div > div > li:nth-child(3) > div > div:nth-child(1) > svg > path');

    expect(importSvgNode).toBeInTheDocument();
    userEvent.click(importSvgNode);
    expect(viewExportNode).not.toBeInTheDocument();
    const viewImportSvgNode = document.querySelector('div > div > ul > li > ul > div > div > li:nth-child(1) > ul > div > div > li:nth-child(3) > ul > div > div > li:nth-child(1) > div > div:nth-child(1) > svg > path');

    expect(viewImportSvgNode).toBeInTheDocument();
    userEvent.click(viewImportSvgNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/playground/edit/imports/nxksnn');
    const viewImportConnectionNode = document.querySelector('div > div > ul > li > ul > div > div > li:nth-child(1) > ul > div > div > li:nth-child(3) > ul > div > div > li:nth-child(2) > div > div:nth-child(1) > svg > path');

    expect(viewImportConnectionNode).toBeInTheDocument();
    userEvent.click(viewImportConnectionNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/playground/edit/connections/fghijk');
  });
  test('should able to click on an integration and it should verify no flows text by expanding', async () => {
    await initExplorerMenu({onEditorChange: jest.fn()});
    initialStore.getState().data.resources.flows = [];

    expect(screen.getByRole('treeitem', {name: /Test integration name/i})).toBeInTheDocument();
    const integrationNameSvgNode = document.querySelector('svg[viewBox="0 0 24 24"]');

    expect(integrationNameSvgNode).toBeInTheDocument();
    userEvent.click(integrationNameSvgNode);
    expect(screen.getAllByRole('treeitem')).toHaveLength(2);
    expect(screen.getByText(/no flows/i)).toBeInTheDocument();
  });
  test('should able to click on an integration and verify the flow and exports tree id when there is no name for flows and export', async () => {
    await initExplorerMenu({onEditorChange: jest.fn()});
    initialStore.getState().data.resources.flows = [{
      _id: '67890',
      _integrationId: '12345',
      pageProcessors: [
        {
          type: 'import',
          _importId: 'nxksnn',
        },
      ],
      pageGenerators: [
        {
          _exportId: 'xsjxks',
        },
      ],
    }];
    initialStore.getState().data.resources.exports = [{
      _id: 'xsjxks',
      _connectionId: 'abcde',
      _integrationId: '12345',
    }];
    const integrationNameSvgNode = document.querySelector('svg[viewBox="0 0 24 24"]');

    expect(integrationNameSvgNode).toBeInTheDocument();
    userEvent.click(integrationNameSvgNode);
    expect(screen.getByText(/67890/i)).toBeInTheDocument();
    const TestFlowNode = document.querySelector('div > div > ul > li > ul > div > div > li > div > div:nth-child(1) > svg > path');

    expect(TestFlowNode).toBeInTheDocument();
    userEvent.click(TestFlowNode);
    expect(screen.getByText(/xsjxks/i)).toBeInTheDocument();
  });
});
