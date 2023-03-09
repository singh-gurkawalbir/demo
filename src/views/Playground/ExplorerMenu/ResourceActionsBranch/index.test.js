import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import ResourceItemsBranch from '.';
import { getCreatedStore } from '../../../../store';

let initialStore;
const mockOnEditorChange = jest.fn();
const mockHistoryPush = jest.fn();

function initResourceItemsBranch({onEditorChange, flowId, resourceId}) {
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
      <Route>
        <ResourceItemsBranch onEditorChange={onEditorChange} flowId={flowId} resourceId={resourceId} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../../../../components/icons/ToolsIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/icons/ToolsIcon'),
  default: jest.fn().mockReturnValue('Mocking Tools Icon'),
}));

jest.mock('../../../../components/icons/TransformIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/icons/TransformIcon'),
  default: jest.fn().mockReturnValue('Mocking Transform Icon'),
}));

jest.mock('../../../../components/icons/ConnectionsIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/icons/ConnectionsIcon'),
  default: jest.fn().mockReturnValue('Mocking Connections Icon'),
}));
jest.mock('../../../../components/icons/ImportsIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/icons/ImportsIcon'),
  default: jest.fn().mockReturnValue('Mocking Import Icon'),
}));
jest.mock('../../../../components/icons/ExportsIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/icons/ExportsIcon'),
  default: jest.fn().mockReturnValue('Mocking Export Icon'),
}));
jest.mock('../OverflowTreeItem', () => ({
  __esModule: true,
  ...jest.requireActual('../OverflowTreeItem'),
  default: props => {
    if (props.label === 'View Connection') {
      return (
        <div>
          <div>Mocking OverflowTreeItem connection</div>
          <div>{props.icon}</div>
          <div>nodeId = {props.nodeId}</div>
          <div>label = {props.label}</div>
          <button type="button" onClick={props.onClick} >View Connection Button</button>
        </div>
      );
    }

    return (
      <div>
        <div>Mocking OverflowTreeItem</div>
        <div>{props.icon}</div>
        <div>nodeId = {props.nodeId}</div>
        <div>label = {props.label}</div>
        <button type="button" onClick={props.onClick} >View Resource</button>
      </div>
    );
  },
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
describe('testsuite for Resource Items Branch', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should test the resource action branch and click on view resource when resource type is export', async () => {
    initResourceItemsBranch({onEditorChange: mockOnEditorChange, flowId: '67890', resourceId: 'xsjxks'});
    expect(screen.getByText(/mocking export icon/i)).toBeInTheDocument();
    expect(screen.getByText(/nodeid = xsjxks-view-resource/i)).toBeInTheDocument();
    expect(screen.getByText(/label = view export/i)).toBeInTheDocument();
    const viewResourceButtonNode = screen.getByRole('button', {
      name: /view resource/i,
    });

    expect(viewResourceButtonNode).toBeInTheDocument();
    await userEvent.click(viewResourceButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/playground/edit/exports/xsjxks');
  });
  test('should test the resource action branch and click on view resource when resource type is import', async () => {
    initResourceItemsBranch({onEditorChange: mockOnEditorChange, flowId: '67890', resourceId: 'nxksnn'});
    expect(screen.getByText('Mocking OverflowTreeItem')).toBeInTheDocument();
    expect(screen.getByText(/mocking import icon/i)).toBeInTheDocument();
    expect(screen.getByText(/nodeid = nxksnn-view-resource/i)).toBeInTheDocument();
    expect(screen.getByText(/label = view import/i)).toBeInTheDocument();
    const viewResourceButtonNode = screen.getByRole('button', {
      name: /view resource/i,
    });

    expect(viewResourceButtonNode).toBeInTheDocument();
    await userEvent.click(viewResourceButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/playground/edit/imports/nxksnn');
  });
  test('should test the resource action branch and click on view connections', async () => {
    initResourceItemsBranch({onEditorChange: mockOnEditorChange, flowId: '67890', resourceId: 'xsjxks'});
    expect(screen.getByText(/mocking overflowtreeitem connection/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking connections icon/i)).toBeInTheDocument();
    expect(screen.getByText(/nodeid = abcde-view-connection/i)).toBeInTheDocument();
    expect(screen.getByText(/label = view connection/i)).toBeInTheDocument();
    const viewConnectionButtonNode = screen.getByRole('button', {
      name: /view connection button/i,
    });

    expect(viewConnectionButtonNode).toBeInTheDocument();
    await userEvent.click(viewConnectionButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/playground/edit/connections/abcde');
  });
});

