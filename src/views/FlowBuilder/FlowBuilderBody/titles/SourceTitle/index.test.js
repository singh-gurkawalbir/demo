import { screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import SourceTitle from '.';
import { getCreatedStore } from '../../../../../store';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';

let initialStore;
const mockUseHandleAddGenerator = jest.fn();

function initSourceTitle(flowData) {
  mutateStore(initialStore, draft => {
    draft.data.resources = {
      imports: [
        {
          _id: 'import_id',
          type: 'type',
          adaptorType: 'NetSuiteExport',
        },
      ],
      exports: [
        {
          _id: 'export_id_1',
          type: 'type',
          adaptorType: 'NetSuiteExport',
        },
      ],
      connections: [
        {
          _id: 'connection_id',
          type: 'type',
          adaptorType: 'NetSuiteExport',
        },
      ],
      flows: flowData,
    };
  });
  const ui = (
    <SourceTitle />
  );

  return renderWithProviders(ui, {initialStore});
}
jest.mock('reactflow', () => ({
  __esModule: true,
  ...jest.requireActual('reactflow'),
  // eslint-disable-next-line no-sparse-arrays
  useStore: jest.fn().mockReturnValue([100, , 100]),
}));
jest.mock('../../Context', () => ({
  __esModule: true,
  ...jest.requireActual('../../Context'),
  useFlowContext: jest.fn().mockReturnValue({flowId: 'flow_id'}),
}));
jest.mock('../../../hooks', () => ({
  __esModule: true,
  ...jest.requireActual('../../../hooks'),
  useHandleAddGenerator: () => mockUseHandleAddGenerator,
}));
jest.mock('../Title', () => ({
  __esModule: true,
  ...jest.requireActual('../Title'),
  default: props => (
    <div>
      <button className={props.className} type="button" onClick={props.onClick}>
        {props.children}
      </button>
    </div>
  ),
}));
describe('Testsuite for SourceTitle', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  afterEach(() => {
    mockUseHandleAddGenerator.mockClear();
  });
  test('should test the Source Title when a flow doesn\'t have a data loader page generator', async () => {
    initSourceTitle([
      {
        _id: 'flow_id',
        _connectorId: 'connector_id_1',
      },
    ]);
    const sourcesButtonNode = screen.getByRole('button', {name: 'SOURCES'});

    expect(sourcesButtonNode).toBeInTheDocument();
    expect(sourcesButtonNode.className).toEqual(expect.stringContaining('makeStyles-sourceTitle-'));
    await userEvent.click(sourcesButtonNode);
    expect(mockUseHandleAddGenerator).toHaveBeenCalledTimes(1);
  });
  test('should test the Source Title when the flow has a data loader', async () => {
    initSourceTitle([
      {
        _id: 'flow_id',
        _connectorId: 'connector_id_1',
        pageGenerators: [{
          application: 'dataLoader',
        }],
      },
    ]);
    const sourceButtonNode = screen.getByRole('button', {name: 'SOURCE'});

    expect(sourceButtonNode).toBeInTheDocument();
    expect(sourceButtonNode.className).toEqual(expect.stringContaining('makeStyles-sourceTitle-'));
    await userEvent.click(sourceButtonNode);
    expect(mockUseHandleAddGenerator).toHaveBeenCalledTimes(1);
  });
});
