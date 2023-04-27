
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PageProcessorNode from './PpNode';
import {renderWithProviders} from '../../../../test/test-utils';
import * as mockContext from '../Context';
import { getCreatedStore } from '../../../../store';
import actions from '../../../../actions';
import { ConfirmDialogProvider } from '../../../../components/ConfirmDialog';

let initialStore;

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

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

function initPageProcessorNode({data}) {
  const ui = (
    <ConfirmDialogProvider>
      <MemoryRouter>
        <PageProcessorNode data={{...data}} />
      </MemoryRouter>
    </ConfirmDialogProvider>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('./Handles/DefaultHandle', () => ({
  __esModule: true,
  ...jest.requireActual('./Handles/DefaultHandle'),
  default: props => (
    <div>
      <div>Mock DefaultHandle {props.type} {props.position}</div>
    </div>
  ),
}));
jest.mock('../../PageProcessor', () => ({
  __esModule: true,
  ...jest.requireActual('../../PageProcessor'),
  default: props => (
    <div>
      <button type="button" data-test="delete" onClick={() => props.onDelete('Deleting..')}>
        Delete
      </button>
    </div>
  ),
}));
describe('Testsuite for Page processor node', () => {
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
  test('should test the branch name when is virtual is set to false and verify the delete option when the setup is in progress', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({
      flow: {_integrationId: '345'}, flowId: '234',
    });
    initPageProcessorNode({
      data: {
        branch: {
          name: 'Testing branch name',
        },
        isFirst: true,
        isLast: true,
        isVirtual: false,
        hideDelete: false,
        path: '/routers/0/branches/0/pageProcessors/0',
        resource: {_exportId: '123', _importId: '456', setupInProgress: true},
      },
    });
    expect(screen.getByText(/mock defaulthandle target left/i)).toBeInTheDocument();
    expect(screen.getByText(/testing branch name/i)).toBeInTheDocument();
    expect(screen.getByText(/mock defaulthandle source right/i)).toBeInTheDocument();
    const deleteButtonNode = screen.getByRole('button', {
      name: /delete/i,
    });

    expect(deleteButtonNode).toBeInTheDocument();
    await userEvent.click(deleteButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.flow.deleteStep('234', 'Deleting..'));
  });
  test('should test the branch name when is virtual is set to false and verify the delete option when the setup is not in progress and click on remove button on confirm dialog', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({
      flow: {_integrationId: '345'}, flowId: '234',
    });
    initPageProcessorNode({
      data: {
        branch: {
          name: 'Testing branch name',
        },
        isFirst: true,
        isLast: true,
        isVirtual: false,
        hideDelete: false,
        path: '/routers/0/branches/0/pageProcessors/0',
        resource: {_exportId: '123', _importId: '456', setupInProgress: false},
      },
    });
    expect(screen.getByText(/mock defaulthandle target left/i)).toBeInTheDocument();
    expect(screen.getByText(/testing branch name/i)).toBeInTheDocument();
    expect(screen.getByText(/mock defaulthandle source right/i)).toBeInTheDocument();
    const deleteButtonNode = screen.getByRole('button', {
      name: /delete/i,
    });

    expect(deleteButtonNode).toBeInTheDocument();
    await userEvent.click(deleteButtonNode);
    expect(screen.getByText(/confirm remove/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to remove this resource\?/i)).toBeInTheDocument();
    const removeButtonNode = screen.getByRole('button', {
      name: 'Remove',
    });

    expect(removeButtonNode).toBeInTheDocument();
    const cancelButton = screen.getByRole('button', {
      name: /cancel/i,
    });

    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(removeButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.flow.deleteStep('234', 'Deleting..'));
  });
  test('should test the page processor when no branch name passed and click on cancel button on confirm dialog', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({
      flow: {_integrationId: '345'}, flowId: '234',
    });
    initPageProcessorNode({
      data: {
        isFirst: true,
        isLast: true,
        isVirtual: true,
        hideDelete: false,
        path: '/routers/0/branches/0/pageProcessors/0',
      },
    });
    expect(screen.getByText(/mock defaulthandle target left/i)).toBeInTheDocument();
    expect(screen.queryByText(/testing branch name/i)).not.toBeInTheDocument();
    expect(screen.getByText(/mock defaulthandle source right/i)).toBeInTheDocument();
    const deleteButtonNode = screen.getByRole('button', {
      name: /delete/i,
    });

    expect(deleteButtonNode).toBeInTheDocument();
    await userEvent.click(deleteButtonNode);
    expect(screen.getByText(/confirm remove/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to remove this resource\?/i)).toBeInTheDocument();
    const removeButtonNode = screen.getByRole('button', {
      name: 'Remove',
    });

    expect(removeButtonNode).toBeInTheDocument();
    const cancelButton = screen.getByRole('button', {
      name: /cancel/i,
    });

    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(cancelButton);
    expect(screen.queryByText(/confirm remove/i)).not.toBeInTheDocument();
  });
});
