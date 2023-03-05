
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HooksForm from './HooksForm';
import actions from '../../../../actions';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';

async function initHooksForm({
  props = {
    flowId: 'flow_id',
    integrationId: 'integration_id',
    formKey: 'form_key',
  },
  resourceId = 'export_id',
  resourceType = 'exports',
} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      flows: [
        {
          _id: 'flow_id',
          _connectorId: 'connector_id',
        },
      ],
      integrations: [
        {
          _id: 'integration_id',
        },
      ],
      exports: [
        {
          _id: 'export_id',
          hooks: {
            preSavePage: {
              function: 'preSavePageFunction',
              _scriptId: 'script_id',
            },
          },
          adaptorType: 'HTTPExport',
        },
        {
          _id: 'export_id_1',
          netsuite: {
            type: 'distributed',
            distributed: {
              hooks: {
                preSend: {
                  function: 'preSendFunction',
                },
              },
            },
          },
          adaptorType: 'NetSuiteExport',
        },
      ],
      imports: [
        {
          _id: 'import_id_1',
          hooks: {
            preMap: {
              function: 'preMapFunction',
            },
          },
          adaptorType: 'NetSuiteImport',
        },
        {
          _id: 'import_id_2',
          netsuite_da: {
            hooks: {
              preMap: {
                function: 'preMapFunction',
                fileInternalId: 'internal_id',
              },
            },
          },
          adaptorType: 'NetSuiteImport',
        },
      ],
      scripts: [
        {
          _id: 'script_id',
          name: 'script 1',
        },
      ],
    };
  });

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/flowBuilder/flow_id/hooks/${resourceType}/${resourceId}`}]}
    >
      <Route
        path="/flowBuilder/flow_id/hooks/:resourceType/:resourceId"
      >
        <HooksForm {...props} />
      </Route>
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}
const mockHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
}));

jest.mock('../../../../components/SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm'),
  default: props => (
    <>
      <button type="button" onClick={props.onSave}>mock onSave</button>
      <button type="button" onClick={props.onClose}>mock onClose</button>
      { /* eslint-disable-next-line react/jsx-handler-names */ }
      <button type="button" onClick={props.remountAfterSaveFn}>mock remountAfterSaveFn</button>
    </>
  ),
}));

describe('HooksForm test cases', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'HOOKS_SAVE':
        case 'RESOURCE_STAGE_PATCH_AND_COMMIT':
          break;
        default: reduxStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should pass the initial render with default value', async () => {
    await initHooksForm();

    waitFor(async () => {
      const saveButton = screen.getByRole('button', { name: 'mock onSave'});
      const closeButton = screen.getByRole('button', { name: 'mock onClose'});
      const remountButton = screen.getByRole('button', { name: 'mock remountAfterSaveFn'});

      expect(saveButton).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
      expect(remountButton).toBeInTheDocument();

      await userEvent.click(remountButton);

      await userEvent.click(closeButton);
      expect(mockHistoryGoBack).toBeCalled();
      mockDispatchFn.mockClear();

      await userEvent.click(saveButton);
      expect(mockDispatchFn).toBeCalledWith(actions.resource.patchAndCommitStaged('exports', 'export_id', [
        {
          op: 'replace',
          path: '/hooks',
          value: {
            preSavePage: {
              _scriptId: 'script_id',
              function: 'preSavePageFunction',
            },
          },
        },
      ], {
        context: { flowId: 'flow_id' },
        asyncKey: 'form_key',
      }));
      expect(mockDispatchFn).toBeCalledWith(actions.hooks.save({
        resourceType: 'exports',
        resourceId: 'export_id',
        flowId: 'flow_id',
        match: {
          isExact: true,
          params: {
            resourceId: 'export_id',
            resourceType: 'exports',
          },
          path: '/flowBuilder/flow_id/hooks/:resourceType/:resourceId',
          url: '/flowBuilder/flow_id/hooks/exports/export_id',
        },
      }));
    });
  });

  test('should pass the initial render with invalid export hook', async () => {
    await initHooksForm({
      resourceId: 'export_id_1',
    });

    waitFor(async () => {
      const saveButton = screen.getByRole('button', { name: 'mock onSave'});
      const closeButton = screen.getByRole('button', { name: 'mock onClose'});
      const remountButton = screen.getByRole('button', { name: 'mock remountAfterSaveFn'});

      expect(saveButton).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
      expect(remountButton).toBeInTheDocument();

      await userEvent.click(remountButton);

      await userEvent.click(closeButton);
      expect(mockHistoryGoBack).toBeCalled();

      await userEvent.click(saveButton);
    }); // onSave will return null. can't check any dispatch or operations at component level
  });

  test('should pass the initial render with invalid import hooks', async () => {
    await initHooksForm({
      resourceType: 'imports',
      resourceId: 'import_id_1',
    });

    waitFor(async () => {
      const saveButton = screen.getByRole('button', { name: 'mock onSave'});
      const closeButton = screen.getByRole('button', { name: 'mock onClose'});
      const remountButton = screen.getByRole('button', { name: 'mock remountAfterSaveFn'});

      expect(saveButton).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
      expect(remountButton).toBeInTheDocument();

      await userEvent.click(closeButton);
      expect(mockHistoryGoBack).toBeCalled();

      await userEvent.click(saveButton);
    });// onSave will return null. can't check any dispatch or operations at component level
  });

  test('should pass the initial render with import hook', async () => {
    await initHooksForm({
      resourceType: 'imports',
      resourceId: 'import_id_2',
    });

    waitFor(async () => {
      const saveButton = screen.getByRole('button', { name: 'mock onSave'});
      const closeButton = screen.getByRole('button', { name: 'mock onClose'});
      const remountButton = screen.getByRole('button', { name: 'mock remountAfterSaveFn'});

      expect(saveButton).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
      expect(remountButton).toBeInTheDocument();

      await userEvent.click(remountButton);

      await userEvent.click(closeButton);
      expect(mockHistoryGoBack).toBeCalled();

      await userEvent.click(saveButton);
      expect(mockDispatchFn).toBeCalledWith(actions.resource.patchAndCommitStaged('imports', 'import_id_2', [
        {
          op: 'replace',
          path: '/hooks',
          value: {},
        },
        {
          op: 'replace',
          path: '/netsuite_da/hooks',
          value: {
            postMap: {},
            postSubmit: {},
            preMap: {
              fileInternalId: 'internal_id',
              function: 'preMapFunction',
            },
          },
        },
      ], {
        context: { flowId: 'flow_id' },
        asyncKey: 'form_key',
      }));
      expect(mockDispatchFn).toBeCalledWith(actions.hooks.save({
        resourceType: 'imports',
        resourceId: 'import_id_2',
        flowId: 'flow_id',
        match: {
          isExact: true,
          params: {
            resourceId: 'import_id_2',
            resourceType: 'imports',
          },
          path: '/flowBuilder/flow_id/hooks/:resourceType/:resourceId',
          url: '/flowBuilder/flow_id/hooks/imports/import_id_2',
        },
      }));
    });
  });
});
