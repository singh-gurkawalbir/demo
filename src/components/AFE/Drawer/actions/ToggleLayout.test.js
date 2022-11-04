/* eslint-disable no-undef */
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import actions from '../../../../actions';
import { getCreatedStore } from '../../../../store';
import { renderWithProviders } from '../../../../test/test-utils';
import ToggleLayout from './ToggleLayout';

let initialStore;

async function initToggleLayout(editorId, mappingPreviewType, editorType, layout) {
  initialStore.getState().session.editors = {
    [editorId]: {
      mappingPreviewType,
      editorType,
      layout,
    },
  };
  const ui = (
    <MemoryRouter>
      <ToggleLayout editorId={editorId} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('../../../icons/LayoutTriVerticalIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/LayoutTriVerticalIcon'),
  default: () => (
    <div>ViewColumnIcon</div>
  ),
}));
jest.mock('../../../icons/LayoutLgLeftSmrightIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/LayoutLgLeftSmrightIcon'),
  default: () => (
    <div>ViewCompactIcon</div>
  ),
}));
jest.mock('../../../icons/LayoutLgTopSmBottomIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/LayoutLgTopSmBottomIcon'),
  default: () => (
    <div>ViewCompactRowIcon</div>
  ),
}));
jest.mock('../../../icons/LayoutAssistantRightIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/LayoutAssistantRightIcon'),
  default: () => (
    <div>ViewAssistantRightIcon</div>
  ),
}));
jest.mock('../../../icons/LayoutAssistantTopRightIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/LayoutAssistantTopRightIcon'),
  default: () => (
    <div>ViewAssistantTopRightIcon</div>
  ),
}));
jest.mock('../../../icons/VerticalLayoutIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/VerticalLayoutIcon'),
  default: () => (
    <div>ViewRowIcon</div>
  ),
}));

describe('test suite for ToggleLayout', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
          initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('Should render properly when new dropdown is selected', async () => {
    await initToggleLayout('1', false, 'map', 'row');
    const inputbutton = screen.getByText('ViewRowIcon');

    expect(inputbutton).toBeInTheDocument();
    userEvent.click(inputbutton);
    const itemSelection = screen.getByText('ViewColumnIcon');

    userEvent.click(itemSelection);
    await expect(mockDispatchFn).toBeCalledWith(actions.editor.changeLayout('1', 'column'));
    await waitFor(() => expect(screen.queryByText('ViewRowIcon')).toBeNull());
  });
  test('Should render properly when isMappingsEditor is false and mappingPreviewType is not set', async () => {
    await initToggleLayout('1', false, 'map', 'row');
    const inputbutton = screen.getByText('ViewRowIcon');

    expect(inputbutton).toBeInTheDocument();
    userEvent.click(inputbutton);
    // dropdowns should should show correct components
    expect(screen.getByText('ViewColumnIcon')).toBeInTheDocument();
    expect(screen.getByText('ViewCompactIcon')).toBeInTheDocument();
    expect(screen.getByRole('option', {
      name: /viewrowicon/i,
      hidden: true,
    })).toBeInTheDocument();
  });
  test('Should render properly when isMappingsEditor is true and mappingPreviewType is set', async () => {
    await initToggleLayout('1', true, 'mappings', 'compact2');
    const inputbutton = screen.getByText('ViewCompactIcon');

    expect(inputbutton).toBeInTheDocument();
    userEvent.click(inputbutton);
    // dropdowns should should show correct components
    expect(screen.getByText('ViewCompactRowIcon')).toBeInTheDocument();
    expect(screen.getByText('ViewAssistantRightIcon')).toBeInTheDocument();
    expect(screen.getByText('ViewAssistantTopRightIcon')).toBeInTheDocument();
    expect(screen.getByRole('option', {
      name: /ViewCompactIcon/i,
      hidden: true,
    })).toBeInTheDocument();
  });
});
