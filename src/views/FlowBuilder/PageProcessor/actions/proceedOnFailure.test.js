/* eslint-disable react/jsx-handler-names */

import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProceedOnFailure from './proceedOnFailure';
import actions from '../../../../actions';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';

async function initProceedOnFailure({
  props = {},
} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      flows: [
        {
          _id: 'flow_id',
          _connectorId: 'connector_id_1',
          pageProcessors: [
            {
              type: 'imports',
              _importId: 'import_id',
            },
          ],
        },
        {
          _id: 'flow_id_1',
          _connectorId: 'connector_id_2',
          routers: [
            {
              branches: [{
                pageProcessors: [{
                  type: 'imports',
                  _importId: 'import_id',
                  proceedOnFailure: true,
                }],
              }],
            },
          ],
        },
      ],
      imports: [
        {
          _id: 'import_id',
          name: 'import name 1',
        },
      ],
    };
  });

  const ui = (
    <MemoryRouter>
      <ProceedOnFailure.Component {...props} />
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  Redirect: jest.fn(({ to }) => `Redirected to ${to}`),
}));

jest.mock('../../../../components/ModalDialog', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/ModalDialog'),
  default: props => (
    <>
      <button type="button" onClick={props.onClose}>mock onClose</button>
      <button type="button" >mock {props.isSaving}</button>
      <div>{props.children}</div>
    </>
  ),
}));

jest.mock('../../../../components/SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm'),
  default: props => (
    <>
      <button type="button" onClick={props.remountAfterSaveFn}>mock remountAfterSaveFn</button>
      <button type="button" onClick={props.onSave}>mock onSave</button>
    </>
  ),
}));

describe('ProceedOnFailure test cases', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'RESOURCE_STAGE_PATCH_AND_COMMIT': break;
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
    const { utils } = await initProceedOnFailure();

    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render with pp props', async () => {
    const onClose = jest.fn();

    await initProceedOnFailure({
      props: {
        flowId: 'flow_id',
        resourceType: 'resource_type',
        resourceId: 'resource_id',
        onClose,
        open: true,
        pageProcessorIndex: 0,
      },
    });
    const mockOnClose = screen.getByRole('button', {name: 'mock onClose'});
    const mockremountAfterSaveFn = screen.getByRole('button', {name: 'mock remountAfterSaveFn'});
    const mockonSave = screen.getByRole('button', {name: 'mock onSave'});

    expect(mockOnClose).toBeInTheDocument();
    expect(mockremountAfterSaveFn).toBeInTheDocument();
    expect(mockonSave).toBeInTheDocument();

    await userEvent.click(mockOnClose);
    await userEvent.click(mockremountAfterSaveFn);
    await userEvent.click(mockonSave);
    expect(mockDispatchFn).toBeCalledWith(actions.resource.patchAndCommitStaged('flows', 'flow_id', [
      {
        op: 'replace',
        path: '/pageProcessors/0/proceedOnFailure',
        value: false,
      },
    ], {
      asyncKey: 'proceedOnFailure',
    }));
  });

  test('should pass the initial render with routers props', async () => {
    const onClose = jest.fn();

    await initProceedOnFailure({
      props: {
        flowId: 'flow_id_1',
        resourceType: 'exports',
        resourceId: 'resource_id',
        onClose,
        open: true,
        pageProcessorIndex: 0,
        branchIndex: 0,
        routerIndex: 0,
      },
    });
    const mockOnClose = screen.getByRole('button', {name: 'mock onClose'});
    const mockremountAfterSaveFn = screen.getByRole('button', {name: 'mock remountAfterSaveFn'});
    const mockonSave = screen.getByRole('button', {name: 'mock onSave'});

    expect(mockOnClose).toBeInTheDocument();
    expect(mockremountAfterSaveFn).toBeInTheDocument();
    expect(mockonSave).toBeInTheDocument();

    await userEvent.click(mockonSave);
    expect(mockDispatchFn).toBeCalledWith(actions.resource.patchAndCommitStaged('flows', 'flow_id_1', [
      {
        op: 'replace',
        path: '/routers/0/branches/0/pageProcessors/0/proceedOnFailure',
        value: true,
      },
    ], {
      asyncKey: 'proceedOnFailure',
    }));
  });
});
