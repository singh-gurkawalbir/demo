/* eslint-disable jest/max-expects */
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ExplorerMenu from '.';
import { getCreatedStore } from '../../../store';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';

let initialStore;
const mockHistoryPush = jest.fn();

async function initExplorerMenu({onEditorChange = jest.fn()} = {}) {
  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = [{
      _id: '12345',
      name: 'Test integration name',
    }];
    draft.data.resources.flows = [{
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
    draft.data.resources.connections = [{
      _id: 'abcde',
      name: 'Test connection 1',
      _integrationId: '12345',
    }, {
      _id: 'fghijk',
      name: 'Test connection 2',
      _integrationId: '12345',
    }];
    draft.data.resources.exports = [{
      _id: 'xsjxks',
      name: 'Test export',
      _connectionId: 'abcde',
      _integrationId: '12345',
    }];
    draft.data.resources.imports = [{
      _id: 'nxksnn',
      name: 'Test import',
      _connectionId: 'fghijk',
      _integrationId: '12345',
    }];
  });
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

    const truncatedIntegrationName = screen.getByRole('treeitem');

    expect(truncatedIntegrationName).toBeInTheDocument();
    expect(truncatedIntegrationName).toHaveTextContent(/^T.*(\.{3})?$/i);
    const integrationNameSvgNode = document.querySelector('svg[viewBox="0 0 24 24"]');

    expect(integrationNameSvgNode).toBeInTheDocument();
    await userEvent.click(integrationNameSvgNode);
    expect(screen.getAllByRole('treeitem')).toHaveLength(3);
    const flowNode = document.querySelector('div > div > ul > li > ul > div > div > li:nth-child(1) > div > div:nth-child(1) > svg > path');

    expect(flowNode).toBeInTheDocument();
    await userEvent.click(flowNode);
    const openInFlowBuilderSVGNode = document.querySelector('div > div > ul > li > ul > div > div > li:nth-child(1) > ul > div > div > li:nth-child(1) > div > div:nth-child(1) > svg > path');

    expect(openInFlowBuilderSVGNode).toBeInTheDocument();
    await userEvent.click(openInFlowBuilderSVGNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/12345/flowBuilder/67890');
    const testExportNode = document.querySelector('div > div > ul > li > ul > div > div > li:nth-child(1) > ul > div > div > li:nth-child(2) > div > div:nth-child(1) > svg > path');

    expect(testExportNode).toBeInTheDocument();
    await userEvent.click(testExportNode);
    const viewExportNode = document.querySelector('div > div > ul > li > ul > div > div > li:nth-child(1) > ul > div > div > li:nth-child(2) > ul > div > div > li:nth-child(1) > div > div:nth-child(1) > svg > path');

    expect(viewExportNode).toBeInTheDocument();
    await userEvent.click(viewExportNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/playground/edit/exports/xsjxks');
    const viewConnectionNode = document.querySelector('div > div > ul > li > ul > div > div > li:nth-child(1) > ul > div > div > li:nth-child(2) > ul > div > div > li:nth-child(2) > div > div:nth-child(1) > svg > path');

    expect(viewConnectionNode).toBeInTheDocument();
    await userEvent.click(viewConnectionNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/playground/edit/connections/abcde');
    const importSvgNode = document.querySelector('div > div > ul > li > ul > div > div > li:nth-child(1) > ul > div > div > li:nth-child(3) > div > div:nth-child(1) > svg > path');

    expect(importSvgNode).toBeInTheDocument();
    await userEvent.click(importSvgNode);
    expect(viewExportNode).not.toBeInTheDocument();
    const viewImportSvgNode = document.querySelector('div > div > ul > li > ul > div > div > li:nth-child(1) > ul > div > div > li:nth-child(3) > ul > div > div > li:nth-child(1) > div > div:nth-child(1) > svg > path');

    expect(viewImportSvgNode).toBeInTheDocument();
    await userEvent.click(viewImportSvgNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/playground/edit/imports/nxksnn');
    const viewImportConnectionNode = document.querySelector('div > div > ul > li > ul > div > div > li:nth-child(1) > ul > div > div > li:nth-child(3) > ul > div > div > li:nth-child(2) > div > div:nth-child(1) > svg > path');

    expect(viewImportConnectionNode).toBeInTheDocument();
    await userEvent.click(viewImportConnectionNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/playground/edit/connections/fghijk');
  });
  test('should able to click on an integration and it should verify no flows text by expanding', async () => {
    await initExplorerMenu({onEditorChange: jest.fn()});
    mutateStore(initialStore, draft => {
      draft.data.resources.flows = [];
    });

    expect(screen.getByRole('treeitem', {name: /^T.*(\.{3})?$/i})).toBeInTheDocument();  // truncated Integartion name
    const integrationNameSvgNode = document.querySelector('svg[viewBox="0 0 24 24"]');

    expect(integrationNameSvgNode).toBeInTheDocument();
    await userEvent.click(integrationNameSvgNode);
    expect(screen.getAllByRole('treeitem')).toHaveLength(2);
    expect(screen.getByText(/no flows/i)).toBeInTheDocument();
  });
  test('should able to click on an integration and verify the flow and exports tree id when there is no name for flows and export', async () => {
    await initExplorerMenu({onEditorChange: jest.fn()});
    mutateStore(initialStore, draft => {
      draft.data.resources.flows = [{
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
      draft.data.resources.exports = [{
        _id: 'xsjxks',
        _connectionId: 'abcde',
        _integrationId: '12345',
      }];
    });
    const integrationNameSvgNode = document.querySelector('svg[viewBox="0 0 24 24"]');

    expect(integrationNameSvgNode).toBeInTheDocument();
    await userEvent.click(integrationNameSvgNode);
    expect(screen.getByText(/67890/i)).toBeInTheDocument();
    const TestFlowNode = document.querySelector('div > div > ul > li > ul > div > div > li > div > div:nth-child(1) > svg > path');

    expect(TestFlowNode).toBeInTheDocument();
    await userEvent.click(TestFlowNode);
    expect(screen.getByText(/xsjxks/i)).toBeInTheDocument();
  });
});
