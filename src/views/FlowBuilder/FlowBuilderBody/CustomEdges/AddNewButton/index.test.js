/* global describe, test, expect, jest, beforeEach, afterEach */
import { screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import * as mockContext from '../../Context';
import AddNewButton from '.';
import * as mockLib from '../../lib';
import {renderWithProviders} from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';

let initialStore;
const mockUseHandleAddNode = jest.fn();
const mockUseHandleAddNewRouter = jest.fn();

function initAddNewButton({edgeId, disabled, disableFlowBranchingData}) {
  initialStore.getState().user.profile = {
    disableFlowBranching: disableFlowBranchingData,
  };
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
  test('should test the Add new button and by clicking on add destination lookup menu item', () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({elementsMap: {456: {type: 'router'}},
    });
    jest.spyOn(mockLib, 'isNodeConnectedToRouter').mockReturnValue(false);
    initAddNewButton({edgeId: '123', disabled: false, disableFlowBranchingData: false});
    expect(screen.getByText(/add icon/i)).toBeInTheDocument();
    const addButtonNode = screen.getByRole('button', {
      name: /add icon/i,
    });

    expect(addButtonNode).toBeInTheDocument();
    userEvent.click(addButtonNode);
    const addDestinationLookUpMenuItemNode = screen.getByRole('menuitem', {
      name: /add destination \/ lookup/i,
    });

    expect(addDestinationLookUpMenuItemNode).toBeInTheDocument();
    expect(addDestinationLookUpMenuItemNode).toBeEnabled();
    const addBranchingMenuItemNode = screen.getByRole('menuitem', {
      name: /add branching/i,
    });

    expect(addBranchingMenuItemNode).toBeInTheDocument();
    expect(addBranchingMenuItemNode).toBeEnabled();
    userEvent.click(addDestinationLookUpMenuItemNode);
    expect(mockUseHandleAddNode).toBeCalled();
  });
  test('should test the Add new button and disabled Add branching menubuttons', () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({elementsMap: {456: {type: 'router'}},
    });
    jest.spyOn(mockLib, 'isNodeConnectedToRouter').mockReturnValue(false);
    initAddNewButton({edgeId: '123', disabled: true, disableFlowBranchingData: false});
    expect(screen.getByText(/add icon/i)).toBeInTheDocument();
    const addButtonNode = screen.getByRole('button', {
      name: /add icon/i,
    });

    expect(addButtonNode).toBeInTheDocument();
    userEvent.click(addButtonNode);
    const addDestinationLookUpMenuItemNode = screen.getByRole('menuitem', {
      name: /add destination \/ lookup/i,
    });

    expect(addDestinationLookUpMenuItemNode).toBeInTheDocument();
    expect(addDestinationLookUpMenuItemNode).toBeEnabled();
    const addBranchingMenuItemNode = screen.getByRole('menuitem', {
      name: /add branching/i,
    });

    expect(addBranchingMenuItemNode).toBeInTheDocument();
    expect(addBranchingMenuItemNode.className).toEqual(expect.stringContaining('Mui-disabled'));
  });
  test('should test the Add new button and by clicking on add branch menu item', () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({elementsMap: {456: {type: 'router'}},
    });
    jest.spyOn(mockLib, 'isNodeConnectedToRouter').mockReturnValue(false);
    initAddNewButton({edgeId: '123', disabled: false, disableFlowBranchingData: false});
    expect(screen.getByText(/add icon/i)).toBeInTheDocument();
    const addButtonNode = screen.getByRole('button', {
      name: /add icon/i,
    });

    expect(addButtonNode).toBeInTheDocument();
    userEvent.click(addButtonNode);
    const addDestinationLookUpMenuItemNode = screen.getByRole('menuitem', {
      name: /add destination \/ lookup/i,
    });

    expect(addDestinationLookUpMenuItemNode).toBeInTheDocument();
    expect(addDestinationLookUpMenuItemNode).toBeEnabled();
    const addBranchingMenuItemNode = screen.getByRole('menuitem', {
      name: /add branching/i,
    });

    expect(addBranchingMenuItemNode).toBeInTheDocument();
    expect(addBranchingMenuItemNode).toBeEnabled();
    userEvent.click(addBranchingMenuItemNode);
    expect(mockUseHandleAddNewRouter).toBeCalled();
  });
  test('should test the Add new button when flowBranch is disabled', () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({elementsMap: {456: {type: 'router'}},
    });
    jest.spyOn(mockLib, 'isNodeConnectedToRouter').mockReturnValue(true);
    initAddNewButton({edgeId: '123', disabled: false, disableFlowBranchingData: true});
    expect(screen.getByText(/add icon/i)).toBeInTheDocument();
    const addButtonNode = screen.getByRole('button', {
      name: 'Add destination / lookup',
    });

    expect(addButtonNode).toBeInTheDocument();
    userEvent.click(addButtonNode);
    expect(mockUseHandleAddNode).toBeCalled();
  });
  test('should test the icon when node is not connected to the router and when flow branching is disabled', () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({elementsMap: {456: {type: 'router'}},
    });
    jest.spyOn(mockLib, 'isNodeConnectedToRouter').mockReturnValue(false);
    initAddNewButton({edgeId: '123', disabled: false, disableFlowBranchingData: true});
    expect(screen.getByText(/add icon/i)).toBeInTheDocument();
    const addButtonNode = screen.getByRole('button');

    expect(addButtonNode).toBeInTheDocument();
    userEvent.click(addButtonNode);
    expect(mockUseHandleAddNode).toBeCalled();
  });
});
