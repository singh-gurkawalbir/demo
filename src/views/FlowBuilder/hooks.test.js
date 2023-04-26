
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Route, Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from 'history';
import { mutateStore, renderWithProviders} from '../../test/test-utils';
import { getCreatedStore } from '../../store';
import * as utils from '../../utils/resource';
import * as flowcontext from './FlowBuilderBody/Context';
import * as emptyrouter from '../../utils/flows/flowbuilder';
import {ConfirmDialogProvider} from '../../components/ConfirmDialog';
import {
  isNewFlowFn,
  usePatchFlow,
  useHandleDelete,
  useHandleMovePP,
  useHandleMovePG,
  usePushOrReplaceHistory,
  usePatchNewFlow,
  useHandleExitClick,
  useHandleAddGenerator,
  useHandleAddProcessor,
  useHandleAddNode,
  useHandleRouterClick,
  useHandleAddNewRouter,
} from './hooks';

const mockDispatch = jest.fn();
const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));

const flows = [
  {
    _id: '5ea16c600e2fab71928a6152',
    lastModified: '2021-08-13T08:02:49.712Z',
    name: ' Bulk insert with harcode and mulfield mapping settings',
    disabled: true,
    _integrationId: '5e9bf6c9edd8fa3230149fbd',
    skipRetries: false,
    pageProcessors: [
      {
        position: 'first',
      },
      {
        position: 'sec',
      },
      {
        position: 'third',
      },
    ],
    pageGenerators: [
      {
        position: 'first',
      },
      {
        position: 'sec',
      },
      {
        position: 'third',
      },
    ],
    createdAt: '2020-04-23T10:22:24.290Z',
    lastExecutedAt: '2020-04-23T11:08:41.093Z',
    autoResolveMatchingTraceKeys: true,
  },
];

function SomeComponent({hook, params, callHookWith}) {
  const returnedFunction = hook(...callHookWith);

  returnedFunction(...params);

  return null;
}

function HandleDelete({type}) {
  const handleDelete = useHandleDelete('5ea16c600e2fab71928a6152');

  function onClick() {
    handleDelete(type)()(1);
  }

  return <button type="button" onClick={onClick}>Delete button</button>;
}

describe('FlowBuilder hooks UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('isNewFlowFn hook tests', () => {
    test('should return true when new flow ID is provided', () => {
      const returnedBoolean = isNewFlowFn('newId');

      expect(returnedBoolean).toBe(true);
    });
    test('should return false when new flow ID is not provided', () => {
      const returnedBoolean = isNewFlowFn('oldId');

      expect(returnedBoolean).toBe(false);
    });
  });
  describe('usePatchFlow hook test', () => {
    test('should test patch flow when new flowId is given', () => {
      render(<SomeComponent hook={usePatchFlow} callHookWith={['newFlowID']} params={['somePath', 'someValue']} />);
      expect(mockDispatch).toHaveBeenCalledWith(
        {
          type: 'RESOURCE_STAGE_PATCH_AND_COMMIT',
          resourceType: 'flows',
          id: 'newFlowID',
          patch: [{ op: 'replace', path: 'somePath', value: 'someValue' }],
          options: undefined,
          context: undefined,
          parentContext: undefined,
          asyncKey: undefined,
        }
      );
    });
    test('should test patch flow when old flowId is given', () => {
      render(<SomeComponent hook={usePatchFlow} callHookWith={['oldFlowID']} params={['somePath', 'someValue']} />);
      expect(mockDispatch).toHaveBeenCalledWith(
        {
          type: 'RESOURCE_STAGE_PATCH_AND_COMMIT',
          resourceType: 'flows',
          id: 'oldFlowID',
          patch: [{ op: 'replace', path: 'somePath', value: 'someValue' }],
          options: undefined,
          context: undefined,
          parentContext: undefined,
          asyncKey: undefined,
        }
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        { type: 'UPDATE_FLOW_DATA', flowId: 'oldFlowID' }
      );
    });
  });
  describe('useHandleDelete hook test', () => {
    test('should test handle delete when type is PageProcessor', async () => {
      const initialStore = getCreatedStore();

      mutateStore(initialStore, draft => {
        draft.data.resources.flows = flows;
      });

      renderWithProviders(
        <ConfirmDialogProvider>
          <HandleDelete type="pp" />
        </ConfirmDialogProvider>,
        {initialStore}
      );
      await userEvent.click(screen.getByText('Delete button'));
      expect(screen.getByText('Are you sure you want to remove this resource?')).toBeInTheDocument();
      await userEvent.click(screen.getByText('Remove'));
      expect(mockDispatch).toHaveBeenCalledWith(
        {
          type: 'RESOURCE_STAGE_PATCH_AND_COMMIT',
          resourceType: 'flows',
          id: '5ea16c600e2fab71928a6152',
          patch: [{ op: 'replace', path: '/pageProcessors', value: [{ position: 'first' }, { position: 'third' }]}],
          options: undefined,
          context: undefined,
          parentContext: undefined,
          asyncKey: undefined,
        }
      );
    });
    test('should test handle delete when type is PageGenerator', async () => {
      const initialStore = getCreatedStore();

      mutateStore(initialStore, draft => {
        draft.data.resources.flows = flows;
      });

      renderWithProviders(
        <ConfirmDialogProvider>
          <HandleDelete type="pg" />
        </ConfirmDialogProvider>,
        {initialStore}
      );
      await userEvent.click(screen.getByText('Delete button'));
      expect(screen.getByText('Are you sure you want to remove this resource?')).toBeInTheDocument();
      await userEvent.click(screen.getByText('Remove'));
      expect(mockDispatch).toHaveBeenCalledWith(
        {
          type: 'RESOURCE_STAGE_PATCH_AND_COMMIT',
          resourceType: 'flows',
          id: '5ea16c600e2fab71928a6152',
          patch: [{ op: 'replace', path: '/pageGenerators', value: [{ position: 'first' }, { position: 'third' }] }],
          options: undefined,
          context: undefined,
          parentContext: undefined,
          asyncKey: undefined,
        }
      );
    });
  });
  describe('useHandleMovePP hook test', () => {
    test('should test useHandleMovePP dispatch calls', () => {
      const initialStore = getCreatedStore();

      mutateStore(initialStore, draft => {
        draft.data.resources.flows = flows;
      });

      renderWithProviders(<SomeComponent
        hook={useHandleMovePP} callHookWith={['5ea16c600e2fab71928a6152']} params={[{oldIndex: 0, newIndex: 2}]}
      />,
      {initialStore});
      expect(mockDispatch).toHaveBeenCalledWith(
        {
          type: 'RESOURCE_STAGE_PATCH_AND_COMMIT',
          resourceType: 'flows',
          id: '5ea16c600e2fab71928a6152',
          patch: [{ op: 'replace', path: '/pageProcessors', value: [{ position: 'sec' }, { position: 'third' }, { position: 'first' }] }],
          options: undefined,
          context: undefined,
          parentContext: undefined,
          asyncKey: undefined,
        }
      );
    });
  });
  describe('useHandleMovePG hook test', () => {
    test('should test useHandleMovePG dispatch calls', () => {
      const initialStore = getCreatedStore();

      mutateStore(initialStore, draft => {
        draft.data.resources.flows = flows;
      });

      renderWithProviders(<SomeComponent
        hook={useHandleMovePG} callHookWith={['5ea16c600e2fab71928a6152']} params={[{oldIndex: 0, newIndex: 2}]}
      />,
      {initialStore});
      expect(mockDispatch).toHaveBeenCalledWith(
        {
          type: 'RESOURCE_STAGE_PATCH_AND_COMMIT',
          resourceType: 'flows',
          id: '5ea16c600e2fab71928a6152',
          patch: [{ op: 'replace', path: '/pageGenerators', value: [{ position: 'sec' }, { position: 'third' }, { position: 'first' }] }],
          options: undefined,
          context: undefined,
          parentContext: undefined,
          asyncKey: undefined,
        }

      );
    });
  });
  describe('usePushOrReplaceHistory hook test', () => {
    test('should test the push call', () => {
      const history = createMemoryHistory();

      history.push = mockHistoryPush;
      render(<Router history={history}><SomeComponent hook={usePushOrReplaceHistory} callHookWith={[]} params={['/someLocation']} /></Router>);
      expect(mockHistoryPush).toHaveBeenCalledWith('/someLocation');
    });
    test('should test the replace call', () => {
      const history = createMemoryHistory({ initialEntries: ['someInitialURl']});

      history.replace = mockHistoryReplace;
      render(<Router history={history}><SomeComponent hook={usePushOrReplaceHistory} callHookWith={[]} params={['/someLocation']} /></Router>);
      expect(mockHistoryReplace).toHaveBeenCalledWith('/someLocation');
    });
  });
  describe('usePatchNewFlow hook test', () => {
    test('should test when all the parms are provided and intgerationId != none', () => {
      renderWithProviders(<SomeComponent
        hook={usePatchNewFlow}
        callHookWith={[]}
        params={['SomeNewFlowId', 'SomeFlowGroupingId', 'SomeNewName', {application: 'someApplication'}]}
      />);
      expect(mockDispatch).toHaveBeenCalledWith(
        {
          type: 'RESOURCE_STAGE_PATCH',
          patch: [
            { op: 'add', path: '/name', value: 'SomeNewName' },
            { op: 'add', path: '/pageGenerators', value: [{application: 'someApplication'}] },
            { op: 'add', path: '/pageProcessors', value: [] },
            { op: 'add', path: '/disabled', value: true },
            {
              op: 'add',
              path: '/_flowGroupingId',
              value: 'SomeFlowGroupingId',
            },
          ],
          id: 'SomeNewFlowId',
        }
      );
    });
    test('should test when newpg.application = dataLoader intgerationId = none and flowGrouping = unassigned', () => {
      renderWithProviders(<SomeComponent
        hook={usePatchNewFlow}
        callHookWith={[]}
        params={['SomeNewFlowId', 'unassigned', 'SomeNewName', {application: 'dataLoader'}]}
      />);
      expect(mockDispatch).toHaveBeenCalledWith(
        {
          type: 'RESOURCE_STAGE_PATCH',
          patch: [
            { op: 'add', path: '/name', value: 'SomeNewName' },
            { op: 'add', path: '/pageGenerators', value: [{application: 'dataLoader'}]},
            { op: 'add', path: '/pageProcessors', value: [] },
            { op: 'add', path: '/disabled', value: false },
          ],
          id: 'SomeNewFlowId',
        }
      );
    });
    test('should test when no params is provided as pg', () => {
      renderWithProviders(<SomeComponent
        hook={usePatchNewFlow}
        callHookWith={[]}
        params={['SomeNewFlowId', 'SomeFlowGroupingId', 'SomeNewName']}
      />);
      expect(mockDispatch).toHaveBeenCalledWith(
        {
          type: 'RESOURCE_STAGE_PATCH',
          patch: [
            { op: 'add', path: '/name', value: 'SomeNewName' },
            { op: 'add', path: '/pageGenerators', value: [] },
            { op: 'add', path: '/pageProcessors', value: [] },
            { op: 'add', path: '/disabled', value: true },
            {
              op: 'add',
              path: '/_flowGroupingId',
              value: 'SomeFlowGroupingId',
            },
          ],
          id: 'SomeNewFlowId',
        }
      );
    });
  });
  describe('useHandleExitClick hook test', () => {
    test('should test when URL is not havin IA route', () => {
      const history = createMemoryHistory({ initialEntries: ['part0/part1/part2']});

      history.push = mockHistoryPush;
      renderWithProviders(
        <Router history={history}>
          <SomeComponent hook={useHandleExitClick} callHookWith={[]} params={[]} />
        </Router>);
      expect(mockHistoryPush).toHaveBeenCalledWith('part0/part1/part2');
    });
    test('should test when URL is havin IA route', () => {
      const history = createMemoryHistory({ initialEntries: ['part0/integrationapps/part2']});

      history.push = mockHistoryPush;
      renderWithProviders(
        <Router history={history}>
          <SomeComponent hook={useHandleExitClick} callHookWith={[]} params={[]} />
        </Router>);
      expect(mockHistoryPush).toHaveBeenCalledWith('part0/integrationapps/part2');
    });
    test('should test should go abck twice call when isIARoute is false', () => {
      const history = createMemoryHistory({ initialEntries: ['part0/part2/part3/part4/part5/settings']});

      history.length = 6;
      history.go = jest.fn();
      renderWithProviders(
        <Router history={history}>
          <SomeComponent hook={useHandleExitClick} callHookWith={[]} params={[]} />
        </Router>);
      expect(history.go).toHaveBeenCalledWith(-2);
    });
    test('should test should go back twice call when isIARoute is true', () => {
      const history = createMemoryHistory({ initialEntries: ['part0/integrationapps/part2/part3/part4/part5/settings']});

      history.length = 4;
      history.go = jest.fn();
      renderWithProviders(
        <Router history={history}>
          <SomeComponent hook={useHandleExitClick} callHookWith={[]} params={[]} />
        </Router>);
      expect(history.go).toHaveBeenCalledWith(-2);
    });
    test('should test history.goback call', () => {
      const history = createMemoryHistory({ initialEntries: ['part0/integrationapps/part2/part3/part4/part5/settings']});

      history.length = 3;
      history.goBack = jest.fn();
      renderWithProviders(
        <Router history={history}>
          <SomeComponent hook={useHandleExitClick} callHookWith={[]} params={[]} />
        </Router>);
      expect(history.goBack).toHaveBeenCalledWith();
    });
  });
  describe('useHandleAddGenerator hook test', () => {
    test('should call pushOrReplaceHistory with genreated URL', () => {
      jest.spyOn(utils, 'generateNewId').mockReturnValue('SomeGeneratedID');
      const history = createMemoryHistory({ initialEntries: ['/someinitialURL']});

      history.push = jest.fn();
      history.replace = jest.fn();

      history.push = mockHistoryPush;
      renderWithProviders(
        <Router history={history}>
          <Route path="/:URl">
            <SomeComponent hook={useHandleAddGenerator} callHookWith={[]} params={[]} />
          </Route>
        </Router>);
      expect(history.push).toHaveBeenCalledWith('/someinitialURL/add/pageGenerator/SomeGeneratedID');
    });
  });
  describe('useHandleAddProcessor hook test', () => {
    test('should call pushOrReplaceHistory with genreated URL', () => {
      jest.spyOn(utils, 'generateNewId').mockReturnValue('SomeGeneratedID');
      const history = createMemoryHistory({ initialEntries: ['/someinitialURL']});

      history.push = jest.fn();
      history.replace = jest.fn();

      renderWithProviders(
        <Router history={history}>
          <Route path="/:URl">
            <SomeComponent hook={useHandleAddProcessor} callHookWith={[]} params={[]} />
          </Route>
        </Router>);
      expect(history.push).toHaveBeenCalledWith('/someinitialURL/add/pageProcessor/SomeGeneratedID');
    });
  });
  describe('useHandleAddNode hook test', () => {
    test('should test when edgeId is not in elementMap', () => {
      jest.spyOn(flowcontext, 'useFlowContext').mockReturnValue({elementsMap: [], flowId: 'someFlowId'});
      const history = createMemoryHistory({ initialEntries: ['/someinitialURL']});

      history.push = jest.fn();
      history.replace = jest.fn();
      renderWithProviders(
        <Router history={history}>
          <Route path="/:URl">
            <SomeComponent hook={useHandleAddNode} callHookWith={['edgeId']} params={[]} />
          </Route>
        </Router>);
      expect(mockDispatch).not.toHaveBeenCalled();
    });
    test('should test when edgeId is in elementMap', () => {
      const elementsMap = [];

      elementsMap.edgeId = {data: {path: 'somePath', processorIndex: 'someIndex'}};
      jest.spyOn(flowcontext, 'useFlowContext').mockReturnValue({elementsMap, flowId: 'someFlowId'});
      const history = createMemoryHistory({ initialEntries: ['/someinitialURL']});

      history.push = jest.fn();
      history.replace = jest.fn();
      renderWithProviders(
        <Router history={history}>
          <Route path="/:URl">
            <SomeComponent hook={useHandleAddNode} callHookWith={['edgeId']} params={[]} />
          </Route>
        </Router>);
      expect(mockDispatch).toHaveBeenCalledWith(
        {
          type: 'FLOW_ADD_NEW_PP_STEP_INFO',
          flowId: 'someFlowId',
          info: { branchPath: 'somePath', processorIndex: 'someIndex' },
        }
      );
    });
  });
  describe('useHandleRouterClick hook test', () => {
    test('should dispatch call and history push in the hook', () => {
      const routers = [{id: 'routerId', data: 'someData', routeRecordsTo: '/someLocation'}];

      jest.spyOn(flowcontext, 'useFlowContext').mockReturnValue({flow: {_integrationId: 'integrationId', routers}, flowId: 'someFlowId'});
      const history = createMemoryHistory({ initialEntries: ['/someinitialURL']});

      history.push = jest.fn();
      history.replace = jest.fn();
      renderWithProviders(
        <Router history={history}>
          <Route path="/:URl">
            <SomeComponent hook={useHandleRouterClick} callHookWith={['routerId']} params={[]} />
          </Route>
        </Router>);
      expect(mockDispatch).toHaveBeenCalledWith(
        {
          type: 'EDITOR_INIT',
          id: 'router-routerId',
          editorType: 'router',
          options: {
            flowId: 'someFlowId',
            resourceType: 'flows',
            resourceId: 'routerId',
            router: {
              id: 'routerId',
              data: 'someData',
              routeRecordsTo: '/someLocation',
            },
            fieldId: 'router',
            routerIndex: 0,
            branchNamingIndex: 1,
            stage: 'router',
            integrationId: 'integrationId',
          },
        }
      );
      expect(history.push).toHaveBeenCalledWith('/someinitialURL/editor/router-routerId');
    });
    test('should not call dispatch and history.push', () => {
      const routers = [{id: 'routerId', data: 'someData'}];

      jest.spyOn(flowcontext, 'useFlowContext').mockReturnValue({flow: {_integrationId: 'integrationId', routers}, flowId: 'someFlowId'});
      const history = createMemoryHistory({ initialEntries: ['/someinitialURL']});

      history.push = jest.fn();
      history.replace = jest.fn();
      renderWithProviders(
        <Router history={history}>
          <Route path="/:URl">
            <SomeComponent hook={useHandleRouterClick} callHookWith={['wrongrouterId']} params={[]} />
          </Route>
        </Router>);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(history.push).not.toHaveBeenCalled();
    });
  });
  describe('useHandleAddNewRouter hook test', () => {
    test('should test dispatch call and his', () => {
      jest.spyOn(emptyrouter, 'generateEmptyRouter').mockReturnValue('somegenratedId');
      jest.spyOn(emptyrouter, 'getNewRouterPatchSet').mockReturnValue({patchSet: ['somepatch'], routerIndex: 'someIndex'});
      const routers = [{id: 'routerId', data: 'someData'}];
      const elementsMap = [];

      elementsMap.edgeId = {data: {path: 'somePath', processorIndex: 'someIndex'}, source: 'edgeId2', target: 'edgeId3'};
      elementsMap.edgeId2 = {type: 'pg'};
      elementsMap.edgeId3 = {type: 'router'};
      jest.spyOn(flowcontext, 'useFlowContext').mockReturnValue(
        {flow: {_integrationId: 'integrationId', routers},
          flowId: 'someFlowId',
          elementsMap,
        });
      const history = createMemoryHistory({ initialEntries: ['/someinitialURL']});

      history.push = jest.fn();
      history.replace = jest.fn();
      renderWithProviders(
        <Router history={history}>
          <Route path="/:URl">
            <SomeComponent hook={useHandleAddNewRouter} callHookWith={['edgeId']} params={[]} />
          </Route>
        </Router>);
      expect(mockDispatch).toHaveBeenCalledWith(
        {
          type: 'EDITOR_INIT',
          id: 'router-undefined',
          editorType: 'router',
          options: {
            flowId: 'someFlowId',
            resourceType: 'flows',
            resourceId: undefined,
            router: 'somegenratedId',
            routerIndex: 'someIndex',
            integrationId: 'integrationId',
            branchNamingIndex: 1,
            fieldId: 'router',
            prePatches: ['somepatch'],
            stage: 'router',
            edge: { data: {path: 'somePath', processorIndex: 'someIndex'}, source: 'edgeId2', target: 'edgeId3' },
            isInsertingBeforeFirstRouter: true,
          },
        }
      );
      expect(history.push).toHaveBeenCalledWith('/someinitialURL/editor/router-undefined');
    });
  });
});
