
import React from 'react';
import {
  screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import * as reactRedux from 'react-redux';
import actions from '../../../../actions';
import DynaFlowGroupName from './DynaFlowGroupName';
import { getCreatedStore } from '../../../../store';
import { ConfirmDialogProvider } from '../../../ConfirmDialog';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';

jest.mock('../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../LoadResources'),
  default: props => props.children,
}));

const initialStore = getCreatedStore();

function initDynaFlowGroupName(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.form = {
      formKey: {
        value: {
          integration: '5b3c75dd5d3c125c88b5dd20',
        },
      },
    };
    draft.data.resources = {
      integrations: [
        {
          _id: '5b3c75dd5d3c125c88b5dd20',
          name: 'integration1',
          installSteps: [{id: 'no lie'}],
          initChild: props.child,
          flowGroupings: [{_id: 'id1', name: 'random'}, {_id: 'id2', name: 'group2'}, {_id: 'id3', name: 'group3'}],
          _connectionId: '5b3c75dd5d3c125c88b5dd21',
        },
        {
          _id: '5c3c75dd5d3c125c88b5dd20',
          name: 'integration2',
          _connectionId: '5b2c75dd5d3c125c88b5dd21',
        },
        {
          _id: '5b3c75dd5d3c125b88b5dd20',
          name: 'integration3',
          _connectionId: '5b3c75dd5d3c225c88b5dd21',
        },
        {
          _id: '5b3c75dd5d3c125b88b5dd20',
          name: 'integration4',
          _connectionId: '5b3c65dd5d3c125c88b5dd21',
        },
        {
          _id: '5b3c75dd5d3c125c88b5cd20',
          name: 'integration5',
          _connectionId: '5b3c75dd5d3c125c88b5dd22',
        },
      ],
    };
  });

  return renderWithProviders(
    <MemoryRouter>
      <ConfirmDialogProvider>
        <DynaFlowGroupName {...props} />
      </ConfirmDialogProvider>
    </MemoryRouter>,
    {initialStore});
}

const mockHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
}));

describe('dynaFlowGroupName UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  const props = {
    integrationId: '5b3c75dd5d3c125c88b5dd20',
    flowIds: [],
    isEdit: true,
    flowGroupId: 'id1',
    formKey: 'formKey',
    id: 'testId',
    value: {},
    required: true,
  };

  test('should pass the initial render', () => {
    initDynaFlowGroupName(props);
    expect(screen.getByText('Delete flow group')).toBeInTheDocument();
  });
  test('should make a dispatch call when flowGroupingId passed in props is valid', async () => {
    initDynaFlowGroupName(props);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')('testId', {isValid: true})));
  });
  test('should make a dispatch call when value is unassigned section name', async () => {
    initDynaFlowGroupName({...props, flowGroupId: 'invalid', value: 'Unassigned'});
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')('testId', {
      isValid: false,
      errorMessages: 'Group name cannot be “Unassigned”.',
    })));
  });
  test('should make an error dispatch call when value is other than unassigned section name', async () => {
    initDynaFlowGroupName({...props, flowGroupId: 'invalid', value: 'random'});
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')('testId', {
      isValid: false,
      errorMessages: 'A group with this name already exists.',
    })));
  });
  test('should make a dispatch call with different error message when value is not passed in the props', async () => {
    initDynaFlowGroupName({...props, flowGroupId: 'invalid', value: null});
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('formKey')('testId', {
      isValid: false,
      errorMessages: 'A value must be provided',
    })));
  });
  test('should display the confirm dialog when clicked on delete flow group button', async () => {
    initDynaFlowGroupName(props);
    expect(screen.getByText('Delete flow group')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Delete flow group'));
    expect(screen.getByText('Confirm delete')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this flow group? Only the group will be deleted. Its flows will be moved into “Unassigned”.')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
  test('should make a dispatch call when clicked on delete button from confirm Dialog', async () => {
    initDynaFlowGroupName(props);
    expect(screen.getByText('Delete flow group')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Delete flow group'));
    expect(screen.getByText('Delete')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Delete'));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.integrations.flowGroups.delete('5b3c75dd5d3c125c88b5dd20', 'id1', [])));
    await waitFor(() => expect(mockHistoryGoBack).toHaveBeenCalled());
  });
});
