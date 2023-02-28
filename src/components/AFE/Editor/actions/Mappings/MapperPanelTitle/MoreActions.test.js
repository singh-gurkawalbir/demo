
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import actions from '../../../../../../actions';
import {mutateStore, renderWithProviders} from '../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../store';
import { ConfirmDialogProvider } from '../../../../../ConfirmDialog';

import MoreActions from './MoreActions';

const initialStore = getCreatedStore();

function initMoreActions(props = {}) {
  const mustateState = draft => {
    draft.session.mapping = {
      mapping: {
        version: 2,
        importSampleData: {},
        importId: '5ea16cd30e2fab71928a6166',
        v2TreeData: props.tree,
      },
    };
    draft.data.resources = {imports: [{_id: '5ea16cd30e2fab71928a6166', name: 'import1' }]};
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<ConfirmDialogProvider><MoreActions {...props} /></ConfirmDialogProvider>, {initialStore});
}

describe('moreActions UI tests', () => {
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
  test('should pass the initial render', async () => {
    initMoreActions({importId: '5ea16cd30e2fab71928a6166'});
    expect(screen.getByRole('button')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Auto-populate destination fields')).toBeInTheDocument();
    expect(screen.getByText('Remove all mappings')).toBeInTheDocument();
  });
  test('should display the confirm dialog box when clicked on autopopulate mapping option', async () => {
    initMoreActions({importId: '5ea16cd30e2fab71928a6166', tree: [{isRequired: false, generate: true}]});
    expect(screen.getByRole('button')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Auto-populate destination fields')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Auto-populate destination fields'));
    expect(screen.getByText('Confirm auto-populate')).toBeInTheDocument();
    expect(screen.getByText('Auto-populate')).toBeInTheDocument();
  });
  test('should make a dispatch call when clicked on confirm button in the dialog box', async () => {
    initMoreActions({importId: '5ea16cd30e2fab71928a6166', tree: [{isRequired: false, generate: true}]});
    expect(screen.getByRole('button')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Auto-populate destination fields')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Auto-populate destination fields'));
    expect(screen.getByText('Auto-populate')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Auto-populate'));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.v2.autoCreateStructure({}, false)));
  });
  test('should make a dispatch call and should not display the confirm dialog when clicked on autopopulate when mappings are not present', async () => {
    initMoreActions({importId: '5ea16cd30e2fab71928a6166'});
    expect(screen.getByRole('button')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Auto-populate destination fields')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Auto-populate destination fields'));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.v2.autoCreateStructure({}, false)));
  });
  test('should make a dispatch call when clicked on Remove all mappings option', async () => {
    initMoreActions({importId: '5ea16cd30e2fab71928a6166'});
    expect(screen.getByRole('button')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Remove all mappings')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Remove all mappings'));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.v2.deleteAll(false)));
  });
});
