
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import * as mockContext from '../../Context';
import AddNewButton from '.';
import * as mockLib from '../../lib';
import {mutateStore, renderWithProviders} from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';

let initialStore;
const mockUseHandleAddNode = jest.fn();
const mockUseHandleAddNewRouter = jest.fn();

function initAddNewButton({edgeId, disabled, disableFlowBranchingData}) {
  mutateStore(initialStore, draft => {
    draft.user.profile = {
      disableFlowBranching: disableFlowBranchingData,
    };
  });
  const ui = (
    <AddNewButton edgeId={edgeId} disabled={disabled} />
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../../../hooks', () => ({
  __esModule: true,
  ...jest.requireActual('../../../hooks'),
  useHandleAddNode: () => mockUseHandleAddNode,
  useHandleAddNewRouter: () => mockUseHandleAddNewRouter,
}));
jest.mock('../../../../../components/icons/AddIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/icons/AddIcon'),
  default: () => (
    <div>Add Icon</div>
  ),
}));

describe('Testsuite for Add New Button', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  afterEach(() => {
    mockUseHandleAddNode.mockClear();
    mockUseHandleAddNewRouter.mockClear();
  });
  test('should test the Add new button and by clicking on add destination lookup menu item', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({elementsMap: {456: {type: 'router'}},
    });
    jest.spyOn(mockLib, 'isNodeConnectedToRouter').mockReturnValue(false);
    initAddNewButton({edgeId: '123', disabled: false, disableFlowBranchingData: false});
    expect(screen.getByText(/add icon/i)).toBeInTheDocument();

    waitFor(async () => {
      const addButtonNode = screen.getByRole('button', {
        name: /add icon/i,
      });

      expect(addButtonNode).toBeInTheDocument();
      await userEvent.click(addButtonNode);
    });
    let addDestinationLookUpMenuItemNode;

    waitFor(async () => {
      addDestinationLookUpMenuItemNode = screen.getByRole('menuitem', {
        name: /add destination \/ lookup/i,
      });

      expect(addDestinationLookUpMenuItemNode).toBeInTheDocument();
      expect(addDestinationLookUpMenuItemNode).toBeEnabled();
      const addBranchingMenuItemNode = screen.getByRole('menuitem', {
        name: /add branching/i,
      });

      expect(addBranchingMenuItemNode).toBeInTheDocument();
      expect(addBranchingMenuItemNode).toBeEnabled();
      await userEvent.click(addDestinationLookUpMenuItemNode);
      expect(mockUseHandleAddNode).toBeCalled();
    });
  });
  test('should test the Add new button and disabled Add branching menubuttons', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({elementsMap: {456: {type: 'router'}},
    });
    jest.spyOn(mockLib, 'isNodeConnectedToRouter').mockReturnValue(false);
    initAddNewButton({edgeId: '123', disabled: true, disableFlowBranchingData: false});
    expect(screen.getByText(/add icon/i)).toBeInTheDocument();
    waitFor(async () => {
      const addButtonNode = screen.getByRole('button', {
        name: /add icon/i,
      });

      expect(addButtonNode).toBeInTheDocument();
      await userEvent.click(addButtonNode);
    });
    waitFor(() => {
      const addDestinationLookUpMenuItemNode = screen.getByRole('menuitem', {
        name: /add destination \/ lookup/i,
      });

      expect(addDestinationLookUpMenuItemNode).toBeInTheDocument();
      expect(addDestinationLookUpMenuItemNode).toBeEnabled();
    });
    waitFor(() => {
      const addBranchingMenuItemNode = screen.getByRole('menuitem', {
        name: /add branching/i,
      });

      expect(addBranchingMenuItemNode).toBeInTheDocument();
      expect(addBranchingMenuItemNode.className).toEqual(expect.stringContaining('Mui-disabled'));
    });
  });
  test('should test the Add new button and by clicking on add branch menu item', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({elementsMap: {456: {type: 'router'}},
    });
    jest.spyOn(mockLib, 'isNodeConnectedToRouter').mockReturnValue(false);
    initAddNewButton({edgeId: '123', disabled: false, disableFlowBranchingData: false});
    expect(screen.getByText(/add icon/i)).toBeInTheDocument();
    waitFor(async () => {
      const addButtonNode = screen.getByRole('button', {
        name: /add icon/i,
      });

      expect(addButtonNode).toBeInTheDocument();
      await userEvent.click(addButtonNode);
    });
    waitFor(() => {
      const addDestinationLookUpMenuItemNode = screen.getByRole('menuitem', {
        name: /add destination \/ lookup/i,
      });

      expect(addDestinationLookUpMenuItemNode).toBeInTheDocument();
      expect(addDestinationLookUpMenuItemNode).toBeEnabled();
    });
    waitFor(async () => {
      const addBranchingMenuItemNode = screen.getByRole('menuitem', {
        name: /add branching/i,
      });

      expect(addBranchingMenuItemNode).toBeInTheDocument();
      expect(addBranchingMenuItemNode).toBeEnabled();
      await userEvent.click(addBranchingMenuItemNode);
      expect(mockUseHandleAddNewRouter).toBeCalled();
    });
  });
  test('should test the Add new button when flowBranch is disabled', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({elementsMap: {456: {type: 'router'}},
    });
    jest.spyOn(mockLib, 'isNodeConnectedToRouter').mockReturnValue(true);
    initAddNewButton({edgeId: '123', disabled: false, disableFlowBranchingData: true});
    expect(screen.getByText(/add icon/i)).toBeInTheDocument();
    waitFor(async () => {
      const addButtonNode = screen.getByRole('button', {
        name: 'Add destination / lookup',
      });

      expect(addButtonNode).toBeInTheDocument();
      await userEvent.click(addButtonNode);
      expect(mockUseHandleAddNode).toBeCalled();
    });
  });
  test('should test the icon when node is not connected to the router and when flow branching is disabled', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({elementsMap: {456: {type: 'router'}},
    });
    jest.spyOn(mockLib, 'isNodeConnectedToRouter').mockReturnValue(false);
    initAddNewButton({edgeId: '123', disabled: false, disableFlowBranchingData: true});
    expect(screen.getByText(/add icon/i)).toBeInTheDocument();
    waitFor(async () => {
      const addButtonNode = screen.getByRole('button');

      expect(addButtonNode).toBeInTheDocument();
      await userEvent.click(addButtonNode);
      expect(mockUseHandleAddNode).toBeCalled();
    }); '';
  });
});
